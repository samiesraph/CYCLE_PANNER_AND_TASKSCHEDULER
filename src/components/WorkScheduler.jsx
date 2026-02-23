import React, { useState, useEffect } from 'react'
import {
  calculateCycleDay,
  calculatePhase,
  predictEnergy,
  predictFocus,
  predictMood,
  getPhaseName
} from '../utils/cycleCalculator'
import { getTasks, saveTasks } from '../utils/storage'
import './WorkScheduler.css'

import { useInference } from '../context/InferenceContext'
import { EVENTS } from '../utils/inferenceEngine'

export default function WorkScheduler({ cycleData }) {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', deadline: '' })
  const [recommendations, setRecommendations] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [calendarView, setCalendarView] = useState('tasks') // 'tasks' or 'calendar'

  const { logSignal } = useInference()

  useEffect(() => {
    const savedTasks = getTasks()
    setTasks(savedTasks)

    if (cycleData) {
      calculateRecommendations()
    }
  }, [cycleData])

  const calculateRecommendations = () => {
    if (!cycleData) return

    const cycleDay = calculateCycleDay(cycleData.lastPeriodStart, cycleData.cycleLength)
    const phase = calculatePhase(cycleDay, cycleData.cycleLength, cycleData.periodDuration)
    const energy = predictEnergy(phase, cycleData.symptoms)
    const focus = predictFocus(phase, cycleData.symptoms)
    const mood = predictMood(phase, cycleData.symptoms)

    const isLowEnergy = energy <= 4
    const isLowFocus = focus <= 4
    const isLowMood = mood === 'low'

    setRecommendations({
      phase: getPhaseName(phase),
      energy,
      focus,
      mood,
      isLowEnergy,
      isLowFocus,
      isLowMood,
      suggestion: isLowEnergy || isLowMood
        ? 'Consider rescheduling demanding tasks. Focus on gentle, low-pressure activities today.'
        : 'Great day for important tasks! Your energy and focus are high.'
    })
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        ...newTask,
        completed: false,
        createdAt: new Date().toISOString()
      }
      const updatedTasks = [...tasks, task]
      setTasks(updatedTasks)
      saveTasks(updatedTasks)
      setNewTask({ title: '', priority: 'medium', deadline: '' })
      logSignal(EVENTS.TASK_ADD, { taskId: task.id, priority: task.priority })
      // New task added - neutral or slightly positive engagement
    }
  }

  const handleToggleTask = (id) => {
    const task = tasks.find(t => t.id === id)
    const updatedTasks = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    )
    setTasks(updatedTasks)
    saveTasks(updatedTasks)

    if (task && !task.completed) {
      logSignal(EVENTS.TASK_COMPLETE, { taskId: id })
    }
  }

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
    logSignal(EVENTS.TASK_DELETE, { taskId: id })
  }

  const clearAllTasks = () => {
    if (window.confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
      setTasks([])
      saveTasks([])
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'var(--sakura-pink-dark)',
      medium: 'var(--sakura-pink)',
      low: 'var(--sakura-purple)'
    }
    return colors[priority] || colors.medium
  }

  const getRecommendedTasks = () => {
    if (!recommendations) return tasks

    if (recommendations.isLowEnergy || recommendations.isLowMood) {
      return tasks.filter(task => task.priority === 'low' || task.priority === 'medium')
    } else {
      return tasks.filter(task => task.priority === 'high' || task.priority === 'medium')
    }
  }

  // Calendar utility functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getTasksForDate = (date) => {
    if (!date || !Array.isArray(tasks)) return []

    try {
      // Format date as YYYY-MM-DD in local timezone to match HTML date input format
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`

      // Filter tasks and ensure they have valid deadline strings
      return tasks.filter(task =>
        task &&
        typeof task.deadline === 'string' &&
        task.deadline.trim() === dateStr
      )
    } catch (error) {
      console.warn('Error filtering tasks for date:', error)
      return []
    }
  }

  const getTasksForSelectedDate = () => {
    return getTasksForDate(selectedDate)
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const selectDate = (date) => {
    if (date) {
      setSelectedDate(date)
      setCalendarView('tasks')

      // Update new task deadline to match selected date
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      setNewTask(prev => ({ ...prev, deadline: `${year}-${month}-${day}` }))
    }
  }

  const isToday = (date) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date) => {
    if (!date) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  return (
    <div className="work-scheduler">
      <div className="container">
        <div className="scheduler-header">
          <h1>📅 Smart Work Scheduler</h1>
          <p>Let your cycle guide your productivity</p>
        </div>

        {recommendations && (
          <div className="card recommendation-card">
            <div className="recommendation-header">
              <h2>Today's Energy Profile</h2>
              <span className="phase-badge">{recommendations.phase}</span>
            </div>
            <div className="energy-metrics">
              <div className="energy-metric">
                <span>Energy: {recommendations.energy}/10</span>
                <div className="mini-bar">
                  <div
                    className="mini-fill"
                    style={{
                      width: `${recommendations.energy * 10}%`,
                      background: recommendations.isLowEnergy ? 'var(--sakura-purple)' : 'var(--sakura-pink)'
                    }}
                  />
                </div>
              </div>
              <div className="energy-metric">
                <span>Focus: {recommendations.focus}/10</span>
                <div className="mini-bar">
                  <div
                    className="mini-fill"
                    style={{
                      width: `${recommendations.focus * 10}%`,
                      background: recommendations.isLowFocus ? 'var(--sakura-purple)' : 'var(--sakura-pink)'
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="recommendation-suggestion">
              <p>{recommendations.suggestion}</p>
            </div>
          </div>
        )}

        <div className="scheduler-grid">
          <div className="card task-form-card">
            <h2>Add New Task</h2>
            <form onSubmit={handleAddTask} className="task-form">
              <input
                type="text"
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="input"
                required
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="input"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                className="input"
                placeholder="Deadline (optional)"
              />
              <button type="submit" className="btn">Add Task</button>
            </form>
          </div>

          <div className="card tasks-card">
            <div className="tasks-header">
              <h2>Your Tasks</h2>
              <div className="tasks-controls">
                <div className="view-toggle">
                  <button
                    className={`view-btn ${calendarView === 'tasks' ? 'active' : ''}`}
                    onClick={() => setCalendarView('tasks')}
                  >
                    All Tasks
                  </button>
                  <button
                    className={`view-btn ${calendarView === 'calendar' ? 'active' : ''}`}
                    onClick={() => setCalendarView('calendar')}
                  >
                    Calendar View
                  </button>
                </div>
                <button
                  onClick={clearAllTasks}
                  className="btn btn-small btn-secondary clear-tasks-btn"
                  title="Clear all tasks"
                >
                  🗑️ Clear All
                </button>
              </div>
            </div>
            {calendarView === 'tasks' ? (
              tasks.length === 0 ? (
                <p className="empty-state">No tasks yet. Add one to get started! 🌸</p>
              ) : (
                <div className="tasks-list">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className={`task-item ${task.completed ? 'completed' : ''}`}
                    >
                      <div className="task-content">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id)}
                          className="task-checkbox"
                        />
                        <div className="task-info">
                          <span className="task-title">{task.title}</span>
                          <div className="task-meta">
                            <span
                              className="task-priority"
                              style={{ color: getPriorityColor(task.priority) }}
                            >
                              {task.priority}
                            </span>
                            {task.deadline && (
                              <span className="task-deadline">
                                📅 {new Date(task.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="task-delete"
                        aria-label="Delete task"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="calendar-tasks-view">
                <h3>Tasks for {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}</h3>
                {getTasksForSelectedDate().length > 0 ? (
                  <div className="tasks-list">
                    {getTasksForSelectedDate().map(task => (
                      <div
                        key={task.id}
                        className={`task-item ${task.completed ? 'completed' : ''}`}
                      >
                        <div className="task-content">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleTask(task.id)}
                            className="task-checkbox"
                          />
                          <div className="task-info">
                            <span className="task-title">{task.title}</span>
                            <div className="task-meta">
                              <span
                                className="task-priority"
                                style={{ color: getPriorityColor(task.priority) }}
                              >
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="task-delete"
                          aria-label="Delete task"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">No tasks scheduled for this date. Click on a date in the calendar to see tasks for that day.</p>
                )}
              </div>
            )}
          </div>

          <div className="card calendar-card">
            <div className="calendar-header">
              <h2>📅 Task Calendar</h2>
              <div className="calendar-nav">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="nav-btn"
                  aria-label="Previous month"
                >
                  ‹
                </button>
                <span className="calendar-title">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={() => navigateMonth(1)}
                  className="nav-btn"
                  aria-label="Next month"
                >
                  ›
                </button>
              </div>
            </div>
            <div className="calendar-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="calendar-day-header">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentDate).map((date, index) => (
                <div
                  key={index}
                  className={`calendar-day ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
                  onClick={() => selectDate(date)}
                >
                  {date && (
                    <>
                      <span className="day-number">{date.getDate()}</span>
                      <div className="task-dots">
                        {getTasksForDate(date).slice(0, 4).map((task, i) => (
                          <span
                            key={i}
                            className="task-dot"
                            style={{ backgroundColor: getPriorityColor(task.priority) }}
                            title={task.title}
                          />
                        ))}
                        {getTasksForDate(date).length > 4 && (
                          <span className="task-dot-more">+</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            {selectedDate && (
              <div className="selected-date-info">
                <h3>Tasks for {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</h3>
                {getTasksForSelectedDate().length > 0 ? (
                  <div className="selected-date-tasks">
                    {getTasksForSelectedDate().map(task => (
                      <div key={task.id} className="mini-task-item">
                        <span className="mini-task-title">{task.title}</span>
                        <span
                          className="mini-task-priority"
                          style={{ color: getPriorityColor(task.priority) }}
                        >
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-tasks-date">No tasks scheduled for this date</p>
                )}
              </div>
            )}
          </div>
        </div>

        {recommendations && tasks.length > 0 && (
          <div className="card recommended-tasks-card">
            <h2>🌸 Recommended Tasks for Today</h2>
            <p className="recommended-subtitle">
              Based on your current energy and focus levels
            </p>
            <div className="recommended-tasks">
              {getRecommendedTasks().length > 0 ? (
                getRecommendedTasks()
                  .filter(task => !task.completed)
                  .slice(0, 3)
                  .map(task => (
                    <div key={task.id} className="recommended-task">
                      <span className="recommended-task-title">{task.title}</span>
                      <span className="recommended-task-priority">{task.priority}</span>
                    </div>
                  ))
              ) : (
                <p className="no-recommendations">
                  All tasks are suitable for today! 🌟
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div >
  )
}
