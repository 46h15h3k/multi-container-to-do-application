const express = require('express');
const mongoose = require('mongoose');
const Todo = require('../models/Todo');

const router = express.Router();

// Helper: validate ObjectId early so Mongoose doesn't throw a raw CastError
function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /todos - get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos', details: err.message });
  }
});

// POST /todos - create a new todo
router.post('/', async (req, res) => {
  try {
    const { title, completed } = req.body;
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'title is required and must be a string' });
    }
    const todo = await Todo.create({ title, completed: !!completed });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create todo', details: err.message });
  }
});

// GET /todos/:id - get a single todo by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid todo id' });

    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todo', details: err.message });
  }
});

// PUT /todos/:id - update a single todo by id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid todo id' });

    const { title, completed } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (completed !== undefined) update.completed = completed;

    const todo = await Todo.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update todo', details: err.message });
  }
});

// DELETE /todos/:id - delete a single todo by id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid todo id' });

    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    res.json({ message: 'Todo deleted', todo });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo', details: err.message });
  }
});

module.exports = router;
