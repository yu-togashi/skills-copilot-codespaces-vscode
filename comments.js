// Create web server
// Create a comment
// Read a comment
// Update a comment
// Delete a comment

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const COMMENTS_FILE = './comments.json';

// Create web server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// Create a comment
app.post('/comments', (req, res) => {
  const comment = req.body;
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf8'));

  if (!comment.id) {
    comment.id = comments.length + 1;
  }

  comments.push(comment);
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));

  res.status(201).send(comment);
});

// Read a comment
app.get('/comments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf8'));
  const comment = comments.find((comment) => comment.id === id);

  if (!comment) {
    res.status(404).send('Comment not found');
    return;
  }

  res.status(200).send(comment);
});

// Update a comment
app.put('/comments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf8'));
  const commentIndex = comments.findIndex((comment) => comment.id === id);

  if (commentIndex === -1) {
    res.status(404).send('Comment not found');
    return;
  }

  const updatedComment = { ...comments[commentIndex], ...req.body };
  comments[commentIndex] = updatedComment;
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));

  res.status(200).send(updatedComment);
});

// Delete a comment
app.delete('/comments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf8'));
  const commentIndex = comments.findIndex((comment) => comment.id === id);

  if (commentIndex === -1) {
    res.status(404).send('Comment not found');