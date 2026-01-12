import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@monorepo/backend'
import './App.css'

function App() {
  const [newTask, setNewTask] = useState('')
  
  const tasks = useQuery(api.tasks.list)
  const createTask = useMutation(api.tasks.create)
  const toggleTask = useMutation(api.tasks.toggle)
  const removeTask = useMutation(api.tasks.remove)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return
    await createTask({ text: newTask.trim() })
    setNewTask('')
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Synced Tasks</h1>
        <p className="subtitle">Web App • Real-time with Convex</p>
      </header>

      <main className="main">
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="task-input"
          />
          <button type="submit" className="task-submit">Add</button>
        </form>

        <section className="tasks-container">
          <div className="tasks-header">
            <h2>Tasks</h2>
            <span className="task-count">
              {tasks?.filter(t => !t.isCompleted).length ?? 0} remaining
            </span>
          </div>
          
          {tasks === undefined ? (
            <div className="loading">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty">No tasks yet. Add one above!</div>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task._id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
                  <button 
                    className="task-checkbox"
                    onClick={() => toggleTask({ id: task._id })}
                  >
                    {task.isCompleted ? '✓' : ''}
                  </button>
                  <span className="task-text">{task.text}</span>
                  <button 
                    className="task-delete"
                    onClick={() => removeTask({ id: task._id })}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="info">
          <h2>Real-time Sync</h2>
          <p className="sync-info">
            Open the <strong>mobile app</strong> to see tasks sync in real-time!
            Changes made here appear instantly on mobile, and vice versa.
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>Built with Bun, Turborepo, and ❤️</p>
      </footer>
    </div>
  )
}

export default App
