const blogGrid = document.getElementById('blogGrid');

async function loadBlogs() {
  try {
    const res = await fetch('/api/blogs');
    const blogs = await res.json();
    renderBlogs(blogs);
  } catch (err) {
    blogGrid.innerHTML = '<p>Failed to load blogs. Please try again later.</p>';
  }
}

function renderBlogs(blogs) {
  if (!blogs.length) {
    blogGrid.innerHTML = '<p>No blogs yet. Add your first blog!</p>';
    return;
  }

  blogGrid.innerHTML = blogs
    .map(
      (blog) => `
        <article class="blog-card">
          <h3>${blog.title}</h3>
          <p>${blog.content}</p>
          <small>By ${blog.author} on ${formatDate(blog.createdAt)}</small>
        </article>
      `
    )
    .join('');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

loadBlogs();
