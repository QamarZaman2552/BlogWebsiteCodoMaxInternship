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
            <a class="btn btn-edit" href="edit-blog.html?id=${blog.id}">Edit</a>
          </div>
        </article>
      `
    )
    .join('');

  blogGrid.querySelectorAll('.read-more').forEach((btn) => {
    btn.addEventListener('click', () => toggleReadMore(btn));
  });
}

function toggleReadMore(btn) {
  const content = btn.previousElementSibling;
  const expanded = btn.dataset.expanded === 'true';
  content.classList.toggle('expanded', !expanded);
  btn.dataset.expanded = String(!expanded);
  btn.textContent = expanded ? 'Read more' : 'Show less';
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
