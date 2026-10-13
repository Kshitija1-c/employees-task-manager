const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
app.use(express.json());
app.use(cors());

// Local MongoDB Compass Connection String
const MONGO_URI = 'mongodb://127.0.0.1:27017/employeeTasks';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully via Compass'))
  .catch(err => console.log('Database connection error:', err));

// Register Route
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ error: 'Email already registered or invalid data' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token, name: user.name });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Add Task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    const task = await Task.create({ title });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Delete Task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));