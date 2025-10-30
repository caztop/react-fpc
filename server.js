require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Post 모델 불러오기
const Post = require('./models/Post');

// 미들웨어 설정
app.use(cors({
  origin: 'https://fpc-wp.netlify.app',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// 관리자 로그인
app.post('/admin-login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.status(200).json({ success: true, message: '로그인 성공' });
  } else {
    res.status(401).json({ success: false, message: '비밀번호가 틀렸습니다.' });
  }
});

// 관리자 로그아웃
app.post('/admin-logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// 관리자 로그인 상태 확인
app.get('/admin-check', (req, res) => {
  res.json({ isAdmin: !!req.session.isAdmin });
});

// 관리자 페이지
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// 글 등록 (모든 사용자 가능)
app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content || title.length > 100 || content.length > 1000) {
    return res.status(400).json({ message: '제목은 100자, 내용은 1,000자 이하로 작성해주세요.' });
  }

  try {
    const newPost = new Post({ title, content });
    await newPost.save();
    res.status(200).json({ message: '글이 저장되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '저장 중 오류 발생' });
  }
});

// 글 목록 조회 (관리자 전용)
app.get('/api/posts', async (req, res) => {
  if (!req.session.isAdmin) return res.status(403).json({ message: '접근 권한이 없습니다.' });

  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: '조회 실패' });
  }
});

// 공개 글 목록 (누구나 접근 가능)
app.get('/api/public-posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }).limit(10);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: '조회 실패' });
  }
});

// 글 삭제 (관리자 전용)
app.delete('/api/posts/:id', async (req, res) => {
  if (!req.session.isAdmin) return res.status(403).json({ message: '권한 없음' });

  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: '삭제 완료' });
  } catch (err) {
    res.status(500).json({ message: '삭제 실패' });
  }
});

// 글 수정 (관리자 전용)
app.put('/api/posts/:id', async (req, res) => {
  if (!req.session.isAdmin) return res.status(403).json({ message: '권한 없음' });

  const { title, content } = req.body;
  if (!title || !content || title.length > 100 || content.length > 1000) {
    return res.status(400).json({ message: '제목은 100자, 내용은 1,000자 이하로 작성해주세요.' });
  }

  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title,
      content,
      date: new Date()
    });
    res.json({ message: '수정 완료' });
  } catch (err) {
    res.status(500).json({ message: '수정 실패' });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
