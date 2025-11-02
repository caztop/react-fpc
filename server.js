require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// 🔧 프록시 환경 인식 (Render에서 필수)
app.set('trust proxy', 1);

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI);

// Post 모델 불러오기
const Post = require('./models/Post');

// CORS 설정
const allowedOrigins = [
  'https://fpc-wp.netlify.app',
  'https://www.fpc-wp.com'
];

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 세션 설정 (MongoDB 저장소 사용)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 60 * 60 * 2 // 2시간
  }),
  cookie: {
    secure: true,
    sameSite: 'none'
  }
}));

// 관리자 로그인
app.post('/admin-login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.status(200).send({ success: true, message: '로그인 성공' });
  } else {
    res.status(401).send({ success: false, message: '비밀번호가 틀렸습니다.' });
  }
});

// 관리자 로그아웃
app.post('/admin-logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.send({ success: true });
  });
});

// 관리자 로그인 상태 확인
app.get('/admin-check', (req, res) => {
  res.send({ isAdmin: !!req.session.isAdmin });
});

// 관리자 페이지
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// 글 등록 (모든 사용자 가능)
app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content || title.length > 50 || content.length > 500) {
    return res.status(400).send({ message: '제목은 50자, 내용은 500자 이하로 작성해주세요.' });
  }

  try {
    const newPost = new Post({ title, content });
    await newPost.save();
    res.status(200).send({ message: '글이 저장되었습니다.' });
  } catch (err) {
    console.error('🔴 저장 중 오류 발생:', err);
    res.status(500).send({ message: '저장 중 오류 발생' });
  }
});

// 글 목록 조회 (관리자 전용)
app.get('/api/posts', async (req, res) => {
  if (!req.session.isAdmin) return res.status(403).send({ message: '접근 권한이 없습니다.' });

  try {
    const posts = await Post.find().sort({ date: -1 });
    res.send(posts);
  } catch (err) {
    res.status(500).send({ message: '조회 실패' });
  }
});

// 공개 글 목록 (누구나 접근 가능)
app.get('/api/public-posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }).limit(10);
    res.send(posts);
  } catch (err) {
    res.status(500).send({ message: '조회 실패' });
  }
});

// 글 삭제 (관리자 전용)
app.delete('/api/posts/:id', async (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).send({ message: '권한 없음' });
  }

  const { id } = req.params;
  if (!id || id.length !== 24) {
    return res.status(400).send({ message: '잘못된 요청입니다. ID가 유효하지 않습니다.' });
  }

  try {
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).send({ message: '해당 글을 찾을 수 없습니다.' });
    }
    res.send({ message: '삭제 완료' });
  } catch (err) {
    console.error('🔴 삭제 중 오류 발생:', err);
    res.status(500).send({ message: '삭제 실패' });
  }
});

// 글 수정 (관리자 전용)
app.put('/api/posts/:id', async (req, res) => {
  if (!req.session.isAdmin) return res.status(403).send({ message: '권한 없음' });

  const { title, content } = req.body;
  if (!title || !content || title.length > 100 || content.length > 1000) {
    return res.status(400).send({ message: '제목은 100자, 내용은 1,000자 이하로 작성해주세요.' });
  }

  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title,
      content,
      date: new Date()
    });
    res.send({ message: '수정 완료' });
  } catch (err) {
    console.error('🔴 수정 중 오류 발생:', err);
    res.status(500).send({ message: '수정 실패' });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
