const form = document.getElementById('editForm');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const contentInput = document.getElementById('content');

const params = new URLSearchParams(window.location.search);
const blogId = params.get('id');

if (!blogId) {
  window.location.href = 'index.html';
}

async function loadBlog() {
  try {
    const res = await fetch(`/api/blogs/${blogId}`);
    if (!res.ok) throw new Error('Blog not found');
    const blog = await res.json();
    titleInput.value = blog.title;
    authorInput.value = blog.author;
    contentInput.value = blog.content;
  } catch (err) {
    const msg = document.createElement('p');
    msg.className = 'error-message';
    msg.textContent = 'Failed to load blog. It may have been deleted.';
    form.prepend(msg);
    setTimeout(() => (window.location.href = 'index.html'), 2000);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const updatedBlog = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    content: contentInput.value.trim(),
  };

  const submitBtn = form.querySelector('.btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Updating...';
  submitBtn.disabled = true;

  try {
    const res = await fetch(`/api/blogs/${blogId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBlog),
    });

    if (!res.ok) throw new Error('Failed to update blog');

    const success = document.createElement('p');
    success.className = 'success-message';
    success.textContent = 'Blog updated successfully! Redirecting...';
    form.prepend(success);
    setTimeout(() => (window.location.href = 'index.html'), 1500);
  } catch (err) {
    const error = document.createElement('p');
    error.className = 'error-message';
    error.textContent = 'Failed to update blog. Please try again.';
    form.prepend(error);
    setTimeout(() => error.remove(), 3000);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

loadBlog();
