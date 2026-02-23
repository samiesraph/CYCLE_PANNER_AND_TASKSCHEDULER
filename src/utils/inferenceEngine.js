/**
 * SakuraCycle Indirect Mood & Energy Inference Engine
 * 
 * Logic to infer mood and energy from behavioral signals.
 * 
 * SCORING RULES:
 * Mood/Energy: 0-10 scale (5 is neutral baseline)
 * 
 * Signal Weights:
 * - TASK_COMPLETE: Mood +0.5, Energy +0.5
 * - TASK_COMPLETE_EARLY: Mood +1.0, Energy +0.5
 * - TASK_RESCHEDULE: Mood -0.2, Energy -0.5
 * - TASK_DELETE: Mood -0.5
 * - CHAT_POSITIVE: Mood +1.0
 * - CHAT_NEGATIVE: Mood -2.0, Energy -1.0
 * - GAME_PLAY_CALM: Mood +1.5, Energy +0.5
 * - GAME_PLAY_ACTIVE: Energy +1.0, Mood +1.0
 * - SESSION_SHORT: Energy -0.2
 * 
 * DECAY:
 * Scores decay towards baseline (5) over time to represent transient states.
 */

const BASELINE = 5;
const MIN_VAL = 0;
const MAX_VAL = 10;
const DECAY_RATE = 0.1; // Amount to move towards baseline per check

export const EVENTS = {
    TASK_COMPLETE: 'TASK_COMPLETE',
    TASK_RESCHEDULE: 'TASK_RESCHEDULE',
    TASK_DELETE: 'TASK_DELETE',
    CHAT_MESSAGE: 'CHAT_MESSAGE',
    GAME_PLAYED: 'GAME_PLAYED',
    APP_SESSIONS: 'APP_SESSIONS'
};

// Keyword lists for basic sentiment analysis
const POSITIVE_WORDS = ['happy', 'great', 'good', 'love', 'excited', 'thanks', 'wonderful', 'better', 'calm', 'relaxed'];
const NEGATIVE_WORDS = ['sad', 'bad', 'tired', 'stress', 'angry', 'anxious', 'exhausted', 'pain', 'hurt', 'hard'];

const analyzeSentiment = (text) => {
    const lower = text.toLowerCase();
    const hasPositive = POSITIVE_WORDS.some(w => lower.includes(w));
    const hasNegative = NEGATIVE_WORDS.some(w => lower.includes(w));

    if (hasPositive && !hasNegative) return 'POSITIVE';
    if (hasNegative && !hasPositive) return 'NEGATIVE';
    return 'NEUTRAL';
};

export const calculateInference = (currentMood, currentEnergy, signal) => {
    let newMood = currentMood;
    let newEnergy = currentEnergy;
    const { type, data } = signal;

    switch (type) {
        case EVENTS.TASK_COMPLETE:
            newMood += 0.5;
            newEnergy += 0.5;
            break;

        case EVENTS.TASK_RESCHEDULE:
            newEnergy -= 0.5;
            newMood -= 0.2;
            break;

        case EVENTS.TASK_DELETE:
            newMood -= 0.5;
            break;

        case EVENTS.CHAT_MESSAGE: {
            const sentiment = analyzeSentiment(data.text || '');
            if (sentiment === 'POSITIVE') {
                newMood += 1.0;
            } else if (sentiment === 'NEGATIVE') {
                newMood -= 1.5;
                newEnergy -= 0.5;
            }
            break;
        }

        case EVENTS.GAME_PLAYED:
            if (data.gameId === 'breathing' || data.gameId === 'mandala') {
                newMood += 1.5; // Calming games improve mood significantly
                newEnergy += 0.5; // Restoration
            } else if (data.gameId === 'bubblepop' || data.gameId === 'sliding') {
                newMood += 1.0;
                newEnergy += 0.2; // Active fun
            }
            break;

        default:
            break;
    }

    // Clamp values
    newMood = Math.max(MIN_VAL, Math.min(MAX_VAL, newMood));
    newEnergy = Math.max(MIN_VAL, Math.min(MAX_VAL, newEnergy));

    return { mood: newMood, energy: newEnergy };
};

export const decayState = (mood, energy) => {
    // Move mood towards baseline (5)
    let newMood = mood > BASELINE ? Math.max(BASELINE, mood - DECAY_RATE) : Math.min(BASELINE, mood + DECAY_RATE);
    // Move energy towards baseline (5)
    let newEnergy = energy > BASELINE ? Math.max(BASELINE, energy - DECAY_RATE) : Math.min(BASELINE, energy + DECAY_RATE);

    return { mood: newMood, energy: newEnergy };
};

export const getInferenceLabel = (value) => {
    if (value <= 3.5) return 'Low';
    if (value >= 7.5) return 'High';
    return 'Moderate';
};
