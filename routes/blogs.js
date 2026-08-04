const express = require('express');
const router = express.Router();

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

router.get('/', (req, res) => {
  res.json(blogs);
});

router.get('/:id', (req, res) => {
  const blog = blogs.find((b) => b.id === parseInt(req.params.id, 10));
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  res.json(blog);
});

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
  const blog = blogs.find((b) => b.id === parseInt(req.params.id, 10));
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  const { title, author, content } = req.body;

  if (!title || !author || !content) {
    return res.status(400).json({ message: 'Title, author, and content are required' });
  }

  blog.title = title;
  blog.author = author;
  blog.content = content;

  res.json(blog);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = blogs.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  const deleted = blogs.splice(index, 1)[0];
  res.json({ message: 'Blog deleted successfully', deleted });
});

module.exports = router;
