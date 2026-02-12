import { useState, useEffect } from 'react';

function InquiryForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [apiBase, setApiBase] = useState(null);

  const candidateUrls = [
    'https://fpc-backend-b1v4.onrender.com'
  ];

  // 작동하는 백엔드 주소 탐색
  const findWorkingBackend = async () => {
    for (const base of candidateUrls) {
      try {
        const res = await fetch(`${base}/api/public-posts`);
        if (res.ok) {
          const data = await res.json();
          console.log(`✅ 작동하는 백엔드 주소: ${base}`);
          setApiBase(base);
          setPosts(data.slice(-10).reverse());
          return;
        }
      } catch (err) {
        console.warn(`❌ 실패: ${base}`, err);
      }
    }
    console.error('❌ 작동하는 백엔드 주소를 찾을 수 없습니다.');
  };

  // 글 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiBase) {
      alert('백엔드 서버를 찾을 수 없습니다.');
      return;
    }

    if (title.length > 50 || content.length > 500) {
      alert('제목은 50자, 내용은 500자 이하로 작성해주세요.');
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content }),
      });
      const result = await res.json();
      alert(result.message);
      setTitle('');
      setContent('');
      loadPosts(apiBase);
    } catch (error) {
      console.error('글 등록 실패:', error);
      alert('글 등록 중 오류가 발생했습니다.');
    }
  };

  // 글 목록 불러오기
  const loadPosts = async (base) => {
    try {
      const res = await fetch(`${base}/api/public-posts`);
      const data = await res.json();
      setPosts(data.slice(-10));
    } catch (error) {
      console.error('글 목록 불러오기 실패:', error);
    }
  };

  // 백엔드 주소 탐색 시작
  useEffect(() => {
    findWorkingBackend();
  }, []);

  // 주소가 설정되면 글 목록 불러오기
  useEffect(() => {
    if (apiBase) {
      loadPosts(apiBase);
    }
  }, [apiBase]);

  return (
    <div id="postarea">
      <h3>📋 문의사항</h3>
      <h5 id="postans">
        문의사항에 대한 답변을 받기 위해서는 연락처(이메일 또는 전화번호 등)만 남겨 주시고 이름이나 기타 개인정보는 기재하지 마시기 바랍니다.
      </h5>
      <form onSubmit={handleSubmit}>
        <input
          id="posttitle"
          type="text"
          name="title"
          placeholder="제목"
          required
          maxLength={50}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p id="titleCount">{title.length} / 50</p>
        <textarea
          id="postcon"
          name="content"
          placeholder="내용"
          required
          maxLength={500}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <p id="conCount">{content.length} / 500</p>
        <button id="submitBtn" type="submit">문의사항 등록</button>
      </form>
      <h3>📝 등록한 글 목록</h3>
      <h5 id="postans">
        등록한 글은 화면에 최신 10개만 보이며, 본 사이트와 관련이 없거나 문의사항이 해소된 글은 예고 없이 삭제될 수 있습니다.
      </h5>
      <div id="posts">
        {posts.map((post, i) => (
          <div className="post" key={i}>
            <strong>{post.title}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InquiryForm;
