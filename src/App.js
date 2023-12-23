import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import logo from './assets/webeasy.png';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) {
      alert('Please enter a task before adding.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTask, completed: false }),
      });
      const newTaskData = await response.json();
      setTasks([...tasks, newTaskData]);
      setNewTask('');
      setShowInput(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEditTask = (taskId, taskText) => {
    setEditingTaskId(taskId);
    setEditTaskText(taskText);
  };

  const updateTask = async () => {
    try {
      await fetch(`http://localhost:5000/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editTaskText }),
      });
      setTasks(tasks.map((task) =>
        task._id === editingTaskId ? { ...task, title: editTaskText } : task
      ));
      setEditingTaskId(null);
      setEditTaskText('');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const toggleCompletion = async (taskId, currentCompletionStatus) => {
    try {
      await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !currentCompletionStatus }),
      });
      setTasks(tasks.map((task) =>
        task._id === taskId ? { ...task, completed: !currentCompletionStatus } : task
      ));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  return (
    
    <div className="container mt-5">
      <h1 className="text-center">To do List</h1>

      <div className="mb-3">
        {showInput ? (
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="taskInput"
              placeholder="Enter a task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-success" onClick={addTask}>
                Add Task
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-success" onClick={() => setShowInput(true)}>
            Add Task
          </button>
        )}
      </div>

      <table className="table">
        <thead></thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className={task.completed ? 'completed' : ''}>
              <td>
  {editingTaskId === task._id ? (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        value={editTaskText}
        onChange={(e) => setEditTaskText(e.target.value)}
        style={{ marginRight: '5px' }}
      />
      <button className="btn btn-primary" onClick={updateTask}>
        <FontAwesomeIcon icon={faCheck} />
      </button>
    </div>
  ) : (
    <>
      {task.title}
    </>
  )}
</td>

              <td>
                <button className="btn btn-warning" onClick={() => startEditTask(task._id, task.title)}>
                  <FontAwesomeIcon icon={faPen} />
                </button>

                <button className="btn btn-danger" onClick={() => deleteTask(task._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>

                <button className="btn btn-info" onClick={() => toggleCompletion(task._id, task.completed)}>
                  <FontAwesomeIcon icon={faCheck} /> {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
const App = () => (
  <div>
    <img src={logo} alt="Logo" className="logo" />
    <TaskManager />
  </div>
);
export default App;