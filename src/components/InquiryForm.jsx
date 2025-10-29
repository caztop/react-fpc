import { useState, useEffect } from 'react';

function InquiryForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
    const res = await fetch('/api/public-posts');
    const data = await res.json();
    setPosts(data.slice(-10).reverse());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, content }),
    });
    setTitle('');
    setContent('');
    loadPosts();
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div id="postarea">
      <h3>📋 문의사항</h3>
      <h5 id="postans">문의사항에 대한 답변을 받기 위해서는 이메일 또는 전화번호만 남겨 주시고 이름이나 기타 개인정보는 기재하지 마시기 바랍니다.</h5>
      <form onSubmit={handleSubmit}>
        <input
          id="posttitle"
          type="text"
          name="title"
          placeholder="제목"
          required
          maxLength={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p id="titleCount">{title.length} / 100</p>
        <textarea
          id="postcon"
          name="content"
          placeholder="내용"
          required
          maxLength={1000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <p id="conCount">{content.length} / 1000</p>
        <button type="submit"><h4>문의사항 등록</h4></button>
      </form>
      <h3>📝 등록한 글 목록</h3>
      <h5 id="postans">본 사이트와 관련이 없거나 문의사항이 해소된 글은 예고 없이 삭제될 수 있습니다.</h5>
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
