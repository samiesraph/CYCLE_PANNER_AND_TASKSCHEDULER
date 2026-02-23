/**
 * Cycle Calculator - Calculates menstrual cycle phases and predictions
 * Uses rule-based logic, structured to be AI/ML-ready
 */

export const PHASES = {
  MENSTRUAL: 'menstrual',
  FOLLICULAR: 'follicular',
  OVULATION: 'ovulation',
  LUTEAL: 'luteal'
}

/**
 * Calculate current phase based on cycle day
 */
export function calculatePhase(cycleDay, cycleLength = 28, periodDuration = 5, isMenopausal = false) {
  if (isMenopausal) {
    return 'menopausal'
  }
  if (cycleDay <= periodDuration) {
    return PHASES.MENSTRUAL
  } else if (cycleDay <= 13) {
    return PHASES.FOLLICULAR
  } else if (cycleDay <= 16) {
    return PHASES.OVULATION
  } else {
    return PHASES.LUTEAL
  }
}

/**
 * Calculate cycle day from last period start date
 */
export function calculateCycleDay(lastPeriodStart, cycleLength = 28, isMenopausal = false) {
  if (isMenopausal) {
    return 1 // Cycle day is irrelevant for menopausal individuals
  }
  const today = new Date()
  const lastPeriod = new Date(lastPeriodStart)
  const diffTime = today - lastPeriod
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  // Handle cycle wrapping
  const cycleDay = (diffDays % cycleLength) + 1

  return cycleDay
}

/**
 * Predict mood based on phase and symptoms
 * Returns: 'low', 'neutral', or 'high'
 */
export function predictMood(phase, symptoms = [], isMenopausal = false) {
  if (isMenopausal) {
    return 'neutral' // Stable mood for menopausal individuals
  }
  const phaseMoodMap = {
    [PHASES.MENSTRUAL]: 'low',
    [PHASES.FOLLICULAR]: 'high',
    [PHASES.OVULATION]: 'high',
    [PHASES.LUTEAL]: 'low'
  }

  let baseMood = phaseMoodMap[phase] || 'neutral'

  // Adjust based on symptoms
  if (symptoms.includes('anxiety') || symptoms.includes('fatigue')) {
    if (baseMood === 'high') baseMood = 'neutral'
    if (baseMood === 'neutral') baseMood = 'low'
  }

  return baseMood
}

/**
 * Predict energy level (1-10 scale)
 */
export function predictEnergy(phase, symptoms = [], isMenopausal = false) {
  if (isMenopausal) {
    return 7 // Stable, medium-high energy for menopausal individuals
  }
  const phaseEnergyMap = {
    [PHASES.MENSTRUAL]: 3,
    [PHASES.FOLLICULAR]: 8,
    [PHASES.OVULATION]: 9,
    [PHASES.LUTEAL]: 4
  }

  let energy = phaseEnergyMap[phase] || 5

  // Adjust based on symptoms
  if (symptoms.includes('fatigue')) {
    energy = Math.max(1, energy - 2)
  }
  if (symptoms.includes('cramps')) {
    energy = Math.max(1, energy - 1)
  }

  return energy
}

/**
 * Predict focus level (1-10 scale)
 */
export function predictFocus(phase, symptoms = [], isMenopausal = false) {
  if (isMenopausal) {
    return 7 // Stable, medium-high focus for menopausal individuals
  }
  const phaseFocusMap = {
    [PHASES.MENSTRUAL]: 4,
    [PHASES.FOLLICULAR]: 8,
    [PHASES.OVULATION]: 9,
    [PHASES.LUTEAL]: 5
  }

  let focus = phaseFocusMap[phase] || 6

  // Adjust based on symptoms
  if (symptoms.includes('headaches')) {
    focus = Math.max(1, focus - 2)
  }
  if (symptoms.includes('anxiety')) {
    focus = Math.max(1, focus - 1)
  }

  return focus
}

/**
 * Get phase name for display
 */
export function getPhaseName(phase) {
  const names = {
    [PHASES.MENSTRUAL]: 'Menstrual',
    [PHASES.FOLLICULAR]: 'Follicular',
    [PHASES.OVULATION]: 'Ovulation',
    [PHASES.LUTEAL]: 'Luteal',
    'menopausal': 'Post-Menopause'
  }
  return names[phase] || 'Unknown'
}

/**
   * Get phase description
   */
export function getPhaseDescription(phase) {
  const descriptions = {
    [PHASES.MENSTRUAL]: 'Rest and self-care time. Your body is renewing itself.',
    [PHASES.FOLLICULAR]: 'Energy is rising! Great time for new projects and creativity.',
    [PHASES.OVULATION]: 'Peak energy and confidence! Perfect for important tasks.',
    [PHASES.LUTEAL]: 'Time to slow down. Focus on completion and gentle activities.',
    'menopausal': 'In the post-menopausal phase, focus on overall wellbeing, stable energy, and consistent self-care. Cycle-based fluctuations are minimal.'
  }
  return descriptions[phase] || 'Listen to your body and honor its needs.'
}

/**
 * Analyze historical data for a specific phase
 */
export function analyzeHistory(currentPhase, dailyLogs) {
  if (!dailyLogs || Object.keys(dailyLogs).length === 0) return null

  // Filter logs for the current phase
  const relevantLogs = Object.values(dailyLogs).filter(log => log.phase === currentPhase)

  if (relevantLogs.length < 3) return null // Need at least 3 logs to establish a pattern

  // Calculate average energy
  const totalEnergy = relevantLogs.reduce((sum, log) => sum + (log.energy || 5), 0)
  const avgEnergy = (totalEnergy / relevantLogs.length).toFixed(1)

  // Find most common mood
  const moodCounts = {}
  relevantLogs.forEach(log => {
    if (log.mood) {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1
    }
  })

  let commonMood = null
  let maxCount = 0
  for (const [mood, count] of Object.entries(moodCounts)) {
    if (count > maxCount) {
      maxCount = count
      commonMood = mood
    }
  }

  return {
    phase: currentPhase,
    logCount: relevantLogs.length,
    avgEnergy,
    commonMood
  }
}
