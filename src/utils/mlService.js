/**
 * ML Service - Communicates with the Flask ML API for enhanced predictions
 * Provides fallback to rule-based predictions if ML API is unavailable
 */

const API_BASE_URL = 'http://localhost:5000';

// Convert phase string to numeric value for ML API
const phaseToNumber = (phase) => {
  const phaseMap = {
    'menstrual': 0,
    'follicular': 1,
    'ovulation': 2,
    'luteal': 3
  };
  return phaseMap[phase] || 0;
};

// Convert mood string to numeric value for ML API
const moodToNumber = (mood) => {
  const moodMap = {
    'low': 1,
    'neutral': 2,
    'high': 3
  };
  return moodMap[mood] || 2;
};

/**
 * Predict energy using ML API with fallback to rule-based
 */
export async function predictEnergyML(phase, symptoms = [], userData = {}, isMenopausal = false) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict_energy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cycle_phase: isMenopausal ? -1 : phaseToNumber(phase), // -1 or special phase for menopause
        symptoms: symptoms.length,
        age: userData.age || 25,
        menopause: isMenopausal ? 1 : 0,
        sleep_hours: userData.sleepHours || 8,
        mood: moodToNumber(userData.currentMood) || 2,
        stress: userData.stress || 3,
        activity: userData.activity || 2
      })
    });

    if (response.ok) {
      const data = await response.json();
      // Convert ML energy score (0-10) to our scale (1-10)
      return Math.max(1, Math.min(10, Math.round(data.energy_score)));
    }
  } catch (error) {
    console.warn('ML API unavailable, using rule-based prediction:', error.message);
  }

  // Fallback to rule-based prediction
  return predictEnergyRuleBased(phase, symptoms, isMenopausal);
}

/**
 * Predict mood using ML API with fallback to rule-based
 */
export async function predictMoodML(phase, symptoms = [], isMenopausal = false) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict_mood`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cycle_phase: isMenopausal ? -1 : phaseToNumber(phase),
        symptoms: symptoms,
        menopause: isMenopausal ? 1 : 0
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.mood; // 'low', 'neutral', or 'high'
    }
  } catch (error) {
    console.warn('ML API unavailable, using rule-based prediction:', error.message);
  }

  // Fallback to rule-based prediction
  return predictMoodRuleBased(phase, symptoms, isMenopausal);
}

/**
 * Check if ML API is available
 */
export async function checkMLAPIHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      return data.model_loaded;
    }
  } catch (error) {
    console.warn('ML API health check failed:', error.message);
  }
  return false;
}

// Rule-based fallbacks (from existing cycleCalculator.js)
function predictEnergyRuleBased(phase, symptoms = [], isMenopausal = false) {
  if (isMenopausal) {
    return 7; // Stable, medium-high energy for menopausal individuals
  }
  const phaseEnergyMap = {
    'menstrual': 3,
    'follicular': 8,
    'ovulation': 9,
    'luteal': 4
  };

  let energy = phaseEnergyMap[phase] || 5;

  // Adjust based on symptoms
  if (symptoms.includes('fatigue')) {
    energy = Math.max(1, energy - 2);
  }
  if (symptoms.includes('cramps')) {
    energy = Math.max(1, energy - 1);
  }

  return energy;
}

function predictMoodRuleBased(phase, symptoms = [], isMenopausal = false) {
  if (isMenopausal) {
    return 'neutral'; // Stable mood for menopausal individuals
  }
  const phaseMoodMap = {
    'menstrual': 'low',
    'follicular': 'high',
    'ovulation': 'high',
    'luteal': 'low'
  };

  let baseMood = phaseMoodMap[phase] || 'neutral';

  // Adjust based on symptoms
  if (symptoms.includes('anxiety') || symptoms.includes('fatigue')) {
    if (baseMood === 'high') baseMood = 'neutral';
    if (baseMood === 'neutral') baseMood = 'low';
  }

  return baseMood;
}