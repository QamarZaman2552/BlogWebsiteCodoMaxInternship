const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let blogs = [
  {
    id: 1,
    title: 'Sample Blog Post',
    author: 'Admin',
    content: 'This is a sample blog post. More content coming soon!',
    createdAt: new Date('2026-07-28T10:00:00'),
  },
  {
    id: 2,
    title: 'Getting Started with Blogging',
    author: 'Qamar',
    content: 'Blogging is a great way to express your ideas and connect with readers.',
    createdAt: new Date('2026-07-27T09:30:00'),
  },
];

app.get('/api/blogs', (req, res) => {
  res.json(blogs);
});

app.get('/api/blogs/:id', (req, res) => {
  const blog = blogs.find((b) => b.id === parseInt(req.params.id, 10));
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  res.json(blog);
});

app.post('/api/blogs', (req, res) => {
  const { title, author, content } = req.body;

  if (!title || !author || !content) {
    return res.status(400).json({ message: 'Title, author, and content are required' });
  }

  const newBlog = {
    id: blogs.length ? blogs[blogs.length - 1].id + 1 : 1,
    title,
    author,
    content,
    createdAt: new Date(),
  };

  blogs.push(newBlog);
  res.status(201).json(newBlog);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
