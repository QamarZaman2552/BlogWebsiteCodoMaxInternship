const blogGrid = document.getElementById('blogGrid');
const blogCount = document.getElementById('blogCount');

async function loadBlogs() {
  try {
    const blogs = await api.getBlogs();
    renderBlogs(blogs);
  } catch (err) {
    renderBlogs(getFallbackBlogs());
  }
}

function getFallbackBlogs() {
  return [
    {
      id: 1,
      title: 'Sample Blog Post',
      author: 'Admin',
      content: 'This is a sample blog post. When hosted on GitHub Pages (static hosting), the Express API is not available, so this sample data is shown. Run the app locally to use the full backend.',
      createdAt: '2026-07-28T10:00:00',
    },
    {
      id: 2,
      title: 'Getting Started with Blogging',
      author: 'Qamar',
      content: 'Blogging is a great way to express your ideas and connect with readers. This demonstration shows how the frontend gracefully handles a missing backend.',
      createdAt: '2026-07-27T09:30:00',
    },
  ];
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
              <a class="btn btn-view" href="view-blog.html?id=${blog.id}">View</a>
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
    await api.deleteBlog(id);
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
