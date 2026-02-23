/**
 * Phase-Specific Wellness Advice
 */

import { PHASES } from './cycleCalculator'

export const WELLNESS_ADVICE = {
  [PHASES.MENSTRUAL]: {
    nutrition: [
      "Focus on iron-rich foods like leafy greens, beans, and lean meats",
      "Include magnesium-rich foods (dark chocolate, nuts, seeds) to help with cramps",
      "Stay hydrated with warm herbal teas",
      "Consider foods rich in omega-3s (salmon, walnuts) to reduce inflammation"
    ],
    hydration: "Aim for 8-10 glasses of water. Warm beverages can be especially comforting.",
    exercise: "Gentle movement is best—yoga, stretching, or short walks. Listen to your body.",
    rest: "Prioritize rest. Your body is working hard, and rest is essential for recovery."
  },
  [PHASES.FOLLICULAR]: {
    nutrition: [
      "This is a great time to try new healthy recipes",
      "Focus on protein and complex carbs for sustained energy",
      "Include plenty of fresh fruits and vegetables",
      "Your metabolism may be slightly higher—nourish your body well"
    ],
    hydration: "Stay well-hydrated to support your rising energy levels.",
    exercise: "Great time for more intense workouts! Cardio, strength training, or new activities.",
    rest: "You may need less rest, but still aim for 7-8 hours of quality sleep."
  },
  [PHASES.OVULATION]: {
    nutrition: [
      "Your body needs quality fuel for peak performance",
      "Focus on balanced meals with protein, healthy fats, and carbs",
      "Include antioxidant-rich foods (berries, colorful vegetables)",
      "Stay consistent with meal timing"
    ],
    hydration: "Keep water nearby—your body is working at peak efficiency.",
    exercise: "Perfect time for your most challenging workouts! Push yourself if you feel good.",
    rest: "Even at peak energy, quality sleep remains important for recovery."
  },
  [PHASES.LUTEAL]: {
    nutrition: [
      "Cravings are normal—try to balance them with nutritious choices",
      "Include complex carbs to help with mood stability",
      "Foods rich in B vitamins can support energy",
      "Small, frequent meals may help with bloating"
    ],
    hydration: "Drink plenty of water to help with bloating and mood.",
    exercise: "Moderate exercise is best—yoga, pilates, or moderate cardio.",
    rest: "You may need more rest. Honor that need without guilt."
  }
}

export function getWellnessAdvice(phase) {
  return WELLNESS_ADVICE[phase] || WELLNESS_ADVICE[PHASES.MENSTRUAL]
}
