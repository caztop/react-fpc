require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 환경변수에서 비밀번호 불러오기
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// CORS 설정 (세션 쿠키 허용)
app.use(cors({
  origin: 'http://fpc-ws.netlify.app', // 실제 프론트 주소로 변경 가능
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'your_secret_key', // 실제 서비스에서는 더 복잡한 키 사용 권장
  resave: false,
  saveUninitialized: true
}));

// 관리자 로그인 처리
app.post('/admin-login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.status(200).json({ success: true, message: '로그인 성공' });
  } else {
    res.status(401).json({ success: false, message: '비밀번호가 틀렸습니다.' });
  }
});

// 관리자 페이지 라우팅
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// 글 저장 (모든 사용자 가능)
app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content || title.length > 100 || content.length > 1000) {
    return res.status(400).json({ message: '제목은 100자, 내용은 1,000자 이하로 작성해주세요.' });
  }

  const newPost = { title, content, date: new Date().toISOString() };

  let posts = [];
  if (fs.existsSync('posts.json')) {
    posts = JSON.parse(fs.readFileSync('posts.json'));
  }

  posts.push(newPost);
  fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
  res.status(200).json({ message: '글이 저장되었습니다.' });
});

// 글 목록 불러오기 (관리자만 가능)
app.get('/api/posts', (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).json({ message: '접근 권한이 없습니다.' });
  }

  if (fs.existsSync('posts.json')) {
    const posts = JSON.parse(fs.readFileSync('posts.json'));
    res.json(posts);
  } else {
    res.json([]);
  }
});

// 공개용 글 목록 (누구나 접근 가능)
app.get('/api/public-posts', (req, res) => {
  if (fs.existsSync('posts.json')) {
    const posts = JSON.parse(fs.readFileSync('posts.json'));
    res.json(posts);
  } else {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});

// 글 삭제
app.delete('/api/posts/:index', (req, res) => {
  if (!req.session.isAdmin) return res.status(403).json({ message: '권한 없음' });

  const index = parseInt(req.params.index);
  let posts = JSON.parse(fs.readFileSync('posts.json'));
  if (index < 0 || index >= posts.length) return res.status(400).json({ message: '잘못된 인덱스' });

  posts.splice(index, 1);
  fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
  res.json({ message: '삭제 완료' });
});

// 글 수정
app.put('/api/posts/:index', (req, res) => {
  if (!req.session.isAdmin) return res.status(403).json({ message: '권한 없음' });

  const index = parseInt(req.params.index);
  const { title, content } = req.body;
  let posts = JSON.parse(fs.readFileSync('posts.json'));

  if (index < 0 || index >= posts.length) return res.status(400).json({ message: '잘못된 인덱스' });
  if (!title || !content || title.length > 100 || content.length > 1000) {
    return res.status(400).json({ message: '제목은 100자, 내용은 1,000자 이하로 작성해주세요.' });
  }

  posts[index].title = title;
  posts[index].content = content;
  posts[index].date = new Date().toISOString();

  fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
  res.json({ message: '수정 완료' });
});

app.post('/admin-logout', (req, res) => {
  res.clearCookie('admin'); // 세션 쿠키 제거
  res.json({ success: true });
});