import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' | 'pending' | 'completed'
  const [toasts, setToasts] = useState([])

  const API_URL = 'http://localhost:5000/tasks'

  // Toast Notification Helper
  const addToast = (type, message) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  // Fetch all tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL)
        const data = await response.json()
        if (data.success) {
          setTasks(data.tasks || [])
        } else {
          addToast('error', data.message || 'Failed to load tasks')
        }
      } catch (error) {
        console.error('Fetch tasks error:', error)
        addToast('error', 'Backend server is offline or unreachable')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // Create a new task
  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      addToast('error', 'Task title cannot be empty')
      return
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() }),
      })
      const data = await response.json()

      if (data.success) {
        setTasks((prev) => [...prev, data.task])
        setNewTitle('')
        addToast('success', 'Task created successfully!')
      } else {
        addToast('error', data.message || 'Failed to create task')
      }
    } catch (error) {
      console.error('Create task error:', error)
      addToast('error', 'Could not save task to backend')
    }
  }

  // Toggle task status (pending <=> completed)
  const handleToggleTask = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      const data = await response.json()

      if (data.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
        )
        addToast('success', `Task marked as ${nextStatus}`)
      } else {
        addToast('error', data.message || 'Failed to update task')
      }
    } catch (error) {
      console.error('Toggle task error:', error)
      addToast('error', 'Could not update task status')
    }
  }

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        setTasks((prev) => prev.filter((t) => t.id !== id))
        addToast('success', 'Task deleted successfully')
      } else {
        addToast('error', data.message || 'Failed to delete task')
      }
    } catch (error) {
      console.error('Delete task error:', error)
      addToast('error', 'Could not delete task from backend')
    }
  }

  // Calculations for Stats Dashboard
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const pendingTasks = totalTasks - completedTasks
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Filtered Tasks list
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return t.status === 'pending'
    if (filter === 'completed') return t.status === 'completed'
    return true
  })

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">T</div>
          <h1 className="logo-title">
            TaskFlow<span className="logo-version">v1.0</span>
          </h1>
        </div>
      </header>

      {/* Dashboard Stats */}
      <section className="glass-panel stats-dashboard">
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-val">{totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-box highlighted">
            <div className="stat-val">{completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-box">
            <div className="stat-val">{pendingTasks}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-label-row">
            <span>Completion Rate</span>
            <span className="progress-pct">{completionPercentage}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Add Task Input Form */}
      <section className="glass-panel">
        <form onSubmit={handleAddTask} className="task-form">
          <div className="input-wrapper">
            <input
              type="text"
              className="task-input"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn-add" disabled={loading}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Task
          </button>
        </form>
      </section>

      {/* Filter Controls */}
      <section className="filter-controls">
        <div className="filter-group">
          <button
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All <span className="filter-count">{totalTasks}</span>
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          >
            Pending <span className="filter-count">{pendingTasks}</span>
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          >
            Completed <span className="filter-count">{completedTasks}</span>
          </button>
        </div>
      </section>

      {/* Tasks List */}
      <main>
        {loading ? (
          <div className="no-tasks">
            <div className="no-tasks-icon">⌛</div>
            <p>Loading tasks from database...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="glass-panel no-tasks">
            <div className="no-tasks-icon">✨</div>
            <p>
              {filter === 'all'
                ? 'No tasks found. Create one to get started!'
                : filter === 'pending'
                ? 'No pending tasks. Hooray!'
                : 'No completed tasks yet. You can do it!'}
            </p>
          </div>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`task-card ${
                  task.status === 'completed' ? 'completed' : ''
                }`}
              >
                <div className="task-left">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => handleToggleTask(task.id, task.status)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <span className="task-title">{task.title}</span>
                </div>

                <div className="task-actions">
                  <span
                    className={`status-badge ${
                      task.status === 'completed' ? 'completed' : 'pending'
                    }`}
                  >
                    {task.status}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="btn-delete"
                    title="Delete task"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.type === 'success' ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                style={{ marginRight: '4px', color: 'var(--success-color)' }}
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                style={{ marginRight: '4px', color: 'var(--danger-color)' }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
