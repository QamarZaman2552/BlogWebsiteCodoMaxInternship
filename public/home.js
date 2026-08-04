const blogGrid = document.getElementById('blogGrid');
const blogCount = document.getElementById('blogCount');

async function loadBlogs() {
  try {
    const res = await fetch('/api/blogs');
    const blogs = await res.json();
    renderBlogs(blogs);
  } catch (err) {
    blogGrid.innerHTML = '<p class="empty-state">Failed to load blogs. Please try again later.</p>';
  }
}

function renderBlogs(blogs) {
  blogCount.textContent = blogs.length;

  if (!blogs.length) {
    blogGrid.innerHTML = '<p class="empty-state">No blogs yet. Add your first blog!</p>';
    return;
  }

  blogGrid.innerHTML = blogs
    .map(
      (blog) => `
        <article class="blog-card">
          <h3>${escapeHtml(blog.title)}</h3>
          <p class="blog-meta">By ${escapeHtml(blog.author)} on ${formatDate(blog.createdAt)}</p>
          <p class="blog-content">${escapeHtml(blog.content)}</p>
          <div class="card-actions">
            <button class="read-more" data-expanded="false">Read more</button>
            <div class="action-buttons">
              <a class="btn btn-edit" href="edit-blog.html?id=${blog.id}">Edit</a>
              <button class="btn btn-delete" data-id="${blog.id}" data-title="${escapeHtml(blog.title)}">Delete</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  blogGrid.querySelectorAll('.read-more').forEach((btn) => {
    btn.addEventListener('click', () => toggleReadMore(btn));
  });

  blogGrid.querySelectorAll('.btn-delete').forEach((btn) => {
    btn.addEventListener('click', () => deleteBlog(btn));
  });
}

function toggleReadMore(btn) {
  const content = btn.closest('.blog-card').querySelector('.blog-content');
  const expanded = btn.dataset.expanded === 'true';
  content.classList.toggle('expanded', !expanded);
  btn.dataset.expanded = String(!expanded);
  btn.textContent = expanded ? 'Read more' : 'Show less';
}

async function deleteBlog(btn) {
  const id = btn.dataset.id;
  const title = btn.dataset.title;
  const confirmed = confirm(`Are you sure you want to delete "${title}"?`);

  if (!confirmed) return;

  btn.disabled = true;
  btn.textContent = 'Deleting...';

  try {
    const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete blog');
    loadBlogs();
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Delete';
    alert('Failed to delete blog. Please try again.');
  }
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

loadBlogs();
