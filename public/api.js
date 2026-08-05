const api = {
  getBlogs() {
    return fetch('/api/blogs').then(handleResponse);
  },
  getBlog(id) {
    return fetch(`/api/blogs/${id}`).then(handleResponse);
  },
  createBlog(data) {
    return fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse);
  },
  updateBlog(id, data) {
    return fetch(`/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse);
  },
  deleteBlog(id) {
    return fetch(`/api/blogs/${id}`, {
      method: 'DELETE',
    }).then(handleResponse);
  },
};

function handleResponse(res) {
  if (!res.ok) {
    return res.json().then((err) => {
      throw new Error(err.message || 'Request failed');
    });
  }
  return res.json();
}
