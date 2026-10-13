import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Automatically uses your live Render URL on Vercel, or localhost when running locally
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
    }
  }, [isLoggedIn]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/register`, { name, email, password });
      alert('Registration successful! Please login.');
      setIsRegistering(false);
    } catch (err) {
      alert('Error registering user.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/login`, { email, password });
      setUserName(res.data.name || name);
      setIsLoggedIn(true);
    } catch (err) {
      alert('Invalid login details.');
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await axios.post(`${API_URL}/api/tasks`, { title: newTask });
      setNewTask('');
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '40px', maxWidth: '450px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px', marginTop: '50px' }}>
      <h2 style={{ textAlign: 'center' }}>Employees Task Manager</h2>

      {!isLoggedIn ? (
        isRegistering ? (
          <form onSubmit={handleRegister}>
            <h3 style={{ textAlign: 'center' }}>Register</h3>
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} /><br/>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} /><br/>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} /><br/>
            <button type="submit" style={btnStyle}>Register</button>
            <p onClick={() => setIsRegistering(false)} style={{ color: 'blue', cursor: 'pointer', textAlign: 'center', marginTop: '15px' }}>Already registered? Login</p>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <h3 style={{ textAlign: 'center' }}>Login</h3>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} /><br/>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} /><br/>
            <button type="submit" style={btnStyle}>Login</button>
            <p onClick={() => setIsRegistering(true)} style={{ color: 'blue', cursor: 'pointer', textAlign: 'center', marginTop: '15px' }}>Create Account / Register</p>
          </form>
        )
      ) : (
        <div>
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Welcome, {userName || 'Kshitija Patil'}!</p>
          <button onClick={() => setIsLoggedIn(false)} style={{ ...btnStyle, backgroundColor: '#d9534f', marginBottom: '20px' }}>Logout</button>
          
          <form onSubmit={addTask}>
            <input type="text" placeholder="Enter employee task..." value={newTask} onChange={e => setNewTask(e.target.value)} style={inputStyle} /><br/>
            <button type="submit" style={btnStyle}>Add Task</button>
          </form>

          <h3>My Tasks ({tasks.length})</h3>
          {tasks.map(task => (
            <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: '1px solid #ddd', marginBottom: '8px', borderRadius: '4px' }}>
              <span>{task.title}</span>
              <button onClick={() => deleteTask(task._id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', marginBottom: '12px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };
const btnStyle = { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' };

export default App;