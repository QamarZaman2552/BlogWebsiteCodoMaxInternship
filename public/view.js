const container = document.getElementById('blogContainer');
const params = new URLSearchParams(window.location.search);
const blogId = params.get('id');

if (!blogId) {
  window.location.href = 'index.html';
}

async function loadBlog() {
  try {
    const blog = await api.getBlog(blogId);
    renderBlog(blog);
  } catch (err) {
    container.innerHTML = `
      <div class="blog-detail">
        <p class="empty-state">Blog not found. It may have been deleted.</p>
        <a class="btn" href="index.html">Back to Home</a>
      </div>
    `;
  }
}

function renderBlog(blog) {
  container.innerHTML = `
    <article class="blog-detail">
      <p class="blog-meta">By ${escapeHtml(blog.author)} on ${formatDate(blog.createdAt)}</p>
      <h1 class="detail-title">${escapeHtml(blog.title)}</h1>
      <p class="detail-content">${escapeHtml(blog.content)}</p>
      <div class="detail-actions">
        <a class="btn" href="index.html">Back to Home</a>
        <a class="btn btn-edit" href="edit-blog.html?id=${blog.id}">Edit</a>
      </div>
    </article>
  `;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

loadBlog();
