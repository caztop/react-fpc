const API_BASE = 'https://react-fpc.onrender.com';
let allPosts = [];
let sortDesc = true;

function applyFilter() {
  const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  const filtered = allPosts.filter(p =>
    p.title.toLowerCase().includes(keyword) || p.content.toLowerCase().includes(keyword)
  );
  renderPosts(filtered);
}

function toggleSort() {
  sortDesc = !sortDesc;
  document.getElementById('sortLabel').textContent = sortDesc ? '최신순' : '오래된순';
  renderPosts(allPosts);
}

function renderPosts(posts) {
  const sorted = [...posts].sort((a, b) =>
    sortDesc ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
  );

  const container = document.getElementById('posts');
  container.innerHTML = '';

  for (let post of sorted) {
    const div = document.createElement('div');
    div.className = 'post';
    div.id = `post-${post._id}`;
    div.innerHTML = `
      <strong contenteditable="true">${post.title}</strong>
      <p contenteditable="true" class="editable-content">${post.content}</p>
      <small>${new Date(post.date).toLocaleString()}</small><br>
      <button onclick="updatePost('${post._id}')">수정</button>
      <button onclick="deletePost('${post._id}')">삭제</button>
    `;
    container.appendChild(div);
  }
}

async function loadPosts() {
  try {
    const res = await fetch(`${API_BASE}/api/posts`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('서버 오류');
    allPosts = await res.json();
    renderPosts(allPosts);
  } catch (err) {
    document.getElementById('posts').innerHTML = '글을 불러오는 중 오류가 발생했습니다.';
  }
}

async function updatePost(id) {
  const postDiv = document.getElementById(`post-${id}`);
  const title = postDiv.querySelector('strong').textContent.trim();
  const content = postDiv.querySelector('.editable-content').textContent.trim();

  const res = await fetch(`${API_BASE}/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ title, content })
  });

  if (res.ok) {
    alert('수정 완료');
    loadPosts();
  } else {
    alert('수정 실패');
  }
}

async function deletePost(id) {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  const res = await fetch(`${API_BASE}/api/posts/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (res.ok) {
    alert('삭제 완료');
    loadPosts();
  } else {
    alert('삭제 실패');
  }
}
