import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      setError('Task cannot be empty');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/tasks`, { text: newTask, completed: false });
      setNewTask('');
      fetchTasks();
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`${API_BASE_URL}/tasks/${task._id}`, { ...task, completed: !task.completed });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const startEditing = (task) => {
    setEditingTask({ ...task });
  };

  const saveEdit = async () => {
    if (!editingTask.text.trim()) {
      setError('Task cannot be empty');
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/tasks/${editingTask._id}`, editingTask);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      setError('Failed to save task');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={addTask} className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add Task
        </button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="mb-2 p-2 border rounded">
            {editingTask && editingTask._id === task._id ? (
              <div>
                <input
                  type="text"
                  value={editingTask.text}
                  onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                  className="w-full p-1 border rounded"
                />
                <button onClick={saveEdit} className="mt-1 bg-green-500 text-white p-1 rounded hover:bg-green-600">
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className={task.completed ? 'line-through' : ''}>
                  {task.text}
                </span>
                <div>
                  <button onClick={() => toggleComplete(task)} className="mr-2 text-blue-500 hover:text-blue-700">
                    {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => startEditing(task)} className="mr-2 text-yellow-500 hover:text-yellow-700">
                    Edit
                  </button>
                  <button onClick={() => deleteTask(task._id)} className="text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
