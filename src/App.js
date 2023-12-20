import React, { useState, useEffect } from 'react';
import './App.css'

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');

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
    // Check if the newTask input is empty
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
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'DELETE',
      });
      // Remove the deleted task from the tasks array
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
      // Update the tasks array with the edited task
      setTasks(tasks.map((task) =>
        task._id === editingTaskId ? { ...task, title: editTaskText } : task
      ));
      // Reset the editing state
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
      // Update the tasks array with the toggled completion status
      setTasks(tasks.map((task) =>
        task._id === taskId ? { ...task, completed: !currentCompletionStatus } : task
      ));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  return (
    <div>
      <h1>Task Manager</h1>

      <label htmlFor="taskInput">Task:</label>
      <input
        type="text"
        id="taskInput"
        placeholder="Enter a task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>

      <h2>Task List</h2>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Edit</th>
            <th>Delete</th>
            <th>Toggle Completion</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className={task.completed ? 'completed' : ''}>
              <td>
                {editingTaskId === task._id ? (
                  <>
                    <input
                      type="text"
                      value={editTaskText}
                      onChange={(e) => setEditTaskText(e.target.value)}
                    />
                    <button onClick={updateTask}>Update</button>
                  </>
                ) : (
                  <>
                    {task.title}
                  </>
                )}
              </td>
              <td>
                <button onClick={() => startEditTask(task._id, task.title)}>Edit</button>
              </td>
              <td>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </td>
              <td>
                <button onClick={() => toggleCompletion(task._id, task.completed)}>
                  {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskManager;
