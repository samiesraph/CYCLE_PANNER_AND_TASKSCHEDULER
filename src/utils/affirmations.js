/**
 * Affirmations and Motivational Messages
 */

export const AFFIRMATIONS = {
  low: [
    "It's okay to rest. Your body is doing important work.",
    "You're not lazy—you're honoring your body's needs.",
    "Taking care of yourself is productive.",
    "Rest is not a reward; it's a requirement.",
    "You're doing your best, and that's enough.",
    "Your feelings are valid. Be gentle with yourself.",
    "This phase will pass. You're stronger than you know."
  ],
  neutral: [
    "You're exactly where you need to be.",
    "Every small step forward counts.",
    "You're capable of amazing things.",
    "Trust the process and be kind to yourself.",
    "You're doing great, one day at a time."
  ],
  high: [
    "You're radiating positive energy today!",
    "Your strength and resilience shine through.",
    "You're capable of achieving wonderful things.",
    "This is your time to shine!",
    "You're doing amazing—keep going!"
  ]
}

export const ACTIVITIES = {
  low: [
    "Take a warm bath with calming music",
    "Read a comforting book or watch a gentle show",
    "Do some gentle stretching or yoga",
    "Write in a journal about how you're feeling",
    "Listen to a guided meditation",
    "Spend time with a cozy blanket and tea"
  ],
  neutral: [
    "Go for a gentle walk in nature",
    "Try a new hobby or creative activity",
    "Connect with a friend or loved one",
    "Do some light organizing or tidying",
    "Listen to your favorite music"
  ],
  high: [
    "Tackle that project you've been excited about",
    "Go for a run or energetic workout",
    "Plan something fun for the future",
    "Try a new recipe or creative project",
    "Socialize and connect with others"
  ]
}

export function getRandomAffirmation(mood) {
  const list = AFFIRMATIONS[mood] || AFFIRMATIONS.neutral
  return list[Math.floor(Math.random() * list.length)]
}

export function getRandomActivity(mood) {
  const list = ACTIVITIES[mood] || ACTIVITIES.neutral
  return list[Math.floor(Math.random() * list.length)]
}
