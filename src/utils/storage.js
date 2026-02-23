/**
 * Local Storage Utilities
 */

const STORAGE_KEYS = {
  CYCLE_DATA: 'sakuraCycle_data',
  TASKS: 'sakuraCycle_tasks',
  CHAT_HISTORY: 'sakuraCycle_chat'
}

export function getCycleData() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CYCLE_DATA)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error reading cycle data:', error)
    return null
  }
}

export function saveCycleData(data) {
  try {
    localStorage.setItem(STORAGE_KEYS.CYCLE_DATA, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving cycle data:', error)
  }
}

export function getTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading tasks:', error)
    return []
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
  } catch (error) {
    console.error('Error saving tasks:', error)
  }
}

export function getChatHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading chat history:', error)
    return []
  }
}

export function saveChatHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history))
  } catch (error) {
    console.error('Error saving chat history:', error)
  }
}

export function getDailyLogs() {
  try {
    const data = localStorage.getItem('sakuraCycle_dailyLogs')
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Error reading daily logs:', error)
    return {}
  }
}

export function saveDailyLog(date, logData) {
  try {
    const logs = getDailyLogs()
    logs[date] = logData
    localStorage.setItem('sakuraCycle_dailyLogs', JSON.stringify(logs))
  } catch (error) {
    console.error('Error saving daily log:', error)
  }
}

export function clearCycleData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CYCLE_DATA)
  } catch (error) {
    console.error('Error clearing cycle data:', error)
  }
}