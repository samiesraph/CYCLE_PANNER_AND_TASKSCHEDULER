import React, { useState, useEffect, useRef } from 'react'
import {
  calculateCycleDay,
  calculatePhase,
  predictMood,
  getPhaseName
} from '../utils/cycleCalculator'
import { getChatHistory, saveChatHistory } from '../utils/storage'
import { getRandomAffirmation } from '../utils/affirmations'
import './AICompanion.css'

export default function AICompanion({ cycleData }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const savedHistory = getChatHistory()
    if (savedHistory.length > 0) {
      setMessages(savedHistory)
    } else {
      // Initial greeting
      const greeting = generateGreeting()
      setMessages([{ role: 'assistant', text: greeting, timestamp: new Date() }])
    }
  }, [cycleData])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    saveChatHistory(messages)
  }, [messages])

  const generateGreeting = () => {
    if (!cycleData) {
      return "Hello! I'm your SakuraCycle companion. 🌸 How are you feeling today?"
    }

    const cycleDay = calculateCycleDay(cycleData.lastPeriodStart, cycleData.cycleLength)
    const phase = calculatePhase(cycleDay, cycleData.cycleLength, cycleData.periodDuration)
    const mood = predictMood(phase, cycleData.symptoms)
    const phaseName = getPhaseName(phase)

    const greetings = {
      low: `Hi there! 🌙 I noticed you're in your ${phaseName} phase. How are you feeling today? Remember, it's okay to take things slow.`,
      neutral: `Hello! ☁️ You're in your ${phaseName} phase. How can I support you today?`,
      high: `Hey! ✨ You're in your ${phaseName} phase - a great time for energy! How are you doing?`
    }

    return greetings[mood] || greetings.neutral
  }

  const generateResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()

    // Menstrual cycle phases and information
    if (lowerMessage.match(/\b(what is|tell me about|explain|information about|know about)\s+(menstrual|period|cycle|ovulation|luteal|follicular|phase)\b/)) {
      if (lowerMessage.includes('menstrual') || lowerMessage.includes('period')) {
        return `The menstrual phase (your period) is when your body sheds the uterine lining. It typically lasts 3-7 days. During this time, estrogen and progesterone are at their lowest. It's normal to feel tired, have cramps, or experience mood changes. Rest and self-care are especially important now. 🌸`
      }
      if (lowerMessage.includes('follicular')) {
        return `The follicular phase starts after your period ends and lasts until ovulation (about days 6-14). Estrogen rises, and your body prepares an egg. This is often when energy and mood improve! Many people feel more creative and social during this phase. ✨`
      }
      if (lowerMessage.includes('ovulation')) {
        return `Ovulation happens around day 14 (mid-cycle) when an egg is released. Estrogen peaks, and you might feel your best - highest energy, confidence, and even enhanced senses! This is your most fertile time. 🌺`
      }
      if (lowerMessage.includes('luteal')) {
        return `The luteal phase is after ovulation until your next period (days 15-28). Progesterone rises, then drops if no pregnancy occurs. You might experience PMS symptoms like bloating, mood swings, or fatigue. This is normal! Be gentle with yourself. 💝`
      }
      return `Your menstrual cycle has four phases: Menstrual (period), Follicular (building up), Ovulation (egg release), and Luteal (preparing). Each phase brings different hormones and experiences. Would you like to know more about a specific phase? 🌸`
    }

    // Symptoms and concerns
    if (lowerMessage.match(/\b(cramps|pain|headache|bloating|fatigue|tired|symptoms|pms|premenstrual)\b/)) {
      if (lowerMessage.includes('cramps') || lowerMessage.includes('pain')) {
        return `Period cramps are caused by uterine contractions. Try: heat therapy (heating pad), gentle movement, magnesium-rich foods, staying hydrated, and over-the-counter pain relief if needed. If pain is severe or unusual, please consult a healthcare provider. 💝`
      }
      if (lowerMessage.includes('bloating')) {
        return `Bloating is very common, especially in the luteal phase. Try: reducing salt, staying hydrated, eating smaller meals, gentle movement, and avoiding carbonated drinks. It usually improves once your period starts. 🌸`
      }
      if (lowerMessage.includes('pms') || lowerMessage.includes('premenstrual')) {
        return `PMS (Premenstrual Syndrome) includes physical and emotional symptoms before your period. Common symptoms: mood swings, bloating, fatigue, food cravings, and breast tenderness. These are normal but can vary. Tracking your cycle helps identify patterns. Would you like tips for managing PMS? 💝`
      }
      return `Many cycle symptoms are normal, but everyone's experience is different. Tracking your symptoms can help you understand your patterns. If symptoms are severe or concerning, it's always best to talk to a healthcare provider. How are you feeling today? 🌸`
    }

    // Cycle length and irregularity
    if (lowerMessage.match(/\b(irregular|regular|length|how long|days|cycle length|late|early|missed)\b/)) {
      return `A typical cycle is 21-35 days, with 28 days being average. Cycles can vary! Stress, travel, illness, or lifestyle changes can affect timing. If your cycles are consistently outside 21-35 days or you've missed periods, consider talking to a healthcare provider. Are you tracking your cycle? 🌸`
    }

    // Fertility and ovulation
    if (lowerMessage.match(/\b(fertile|fertility|ovulation|pregnant|conception|trying to conceive)\b/)) {
      return `Ovulation typically occurs around day 14 of a 28-day cycle, but this varies. The fertile window is usually 5-6 days (sperm can live up to 5 days, egg lives ~24 hours). Tracking basal body temperature, cervical mucus, or using ovulation tests can help identify your fertile days. For personalized fertility advice, consult a healthcare provider. 🌺`
    }

    // Nutrition and diet
    if (lowerMessage.match(/\b(food|eat|diet|nutrition|what should i eat|cravings|hungry)\b/)) {
      if (lowerMessage.includes('cravings')) {
        return `Food cravings, especially for sweets or carbs, are very common, especially in the luteal phase! It's okay to honor your cravings in moderation. Try balancing with protein and fiber to help stabilize blood sugar. Dark chocolate, nuts, and fruits can satisfy sweet cravings healthfully. 💝`
      }
      return `During your cycle, your body needs different nutrients: Iron-rich foods during your period (leafy greens, beans, lean meat), protein and complex carbs during follicular phase, and magnesium-rich foods for cramps (dark chocolate, nuts, seeds). Stay hydrated throughout! 🌸`
    }

    // Exercise and activity
    if (lowerMessage.match(/\b(exercise|workout|gym|yoga|activity|movement|sport)\b/)) {
      return `Exercise can help with cycle symptoms! During your period: gentle movement like yoga, walking, or stretching. Follicular/ovulation: great time for more intense workouts. Luteal phase: moderate exercise like pilates or moderate cardio. Listen to your body - rest when you need it! 🏃‍♀️`
    }

    // Current cycle status
    if (lowerMessage.match(/\b(where am i|what phase|current|now|today|my cycle|cycle day)\b/)) {
      if (cycleData) {
        const cycleDay = calculateCycleDay(cycleData.lastPeriodStart, cycleData.cycleLength)
        const phase = calculatePhase(cycleDay, cycleData.cycleLength, cycleData.periodDuration)
        const phaseName = getPhaseName(phase)

        const phaseInfo = {
          menstrual: `You're on day ${cycleDay} of your cycle, in the Menstrual phase. This is a time for rest and self-care. Your body is working hard, so be gentle with yourself. 💝`,
          follicular: `You're on day ${cycleDay} of your cycle, in the Follicular phase. Energy is rising! Great time for new projects and social activities. ✨`,
          ovulation: `You're on day ${cycleDay} of your cycle, in the Ovulation phase. Peak energy and confidence! Perfect time for important tasks and activities you enjoy. 🌺`,
          luteal: `You're on day ${cycleDay} of your cycle, in the Luteal phase. Time to slow down and focus on completion. You might feel more sensitive - that's normal and okay. 🌙`
        }

        return phaseInfo[phase] || `You're in the ${phaseName} phase. How are you feeling? 🌸`
      }
      return `I'd love to tell you about your cycle! Please set up your cycle information in the Dashboard first, then I can give you personalized insights about where you are in your cycle. 💝`
    }

    // Mood-related keywords
    if (lowerMessage.match(/\b(sad|down|tired|exhausted|stressed|anxious|worried|overwhelmed|bad|terrible|awful|depressed)\b/)) {
      const affirmation = getRandomAffirmation('low')
      return `I hear you, and I want you to know that ${affirmation.toLowerCase()} It's completely normal to feel this way, especially during certain phases of your cycle. Hormonal changes can really affect mood. Would you like to try a breathing exercise, talk more about what's on your mind, or learn about cycle-related mood changes? 💝`
    }

    if (lowerMessage.match(/\b(good|great|amazing|wonderful|happy|excited|energetic|fantastic|good mood)\b/)) {
      return `That's wonderful to hear! ✨ I'm so glad you're feeling good. Your cycle phases can really influence mood - it sounds like you might be in a high-energy phase! Is there anything specific you'd like to accomplish today, or would you just like to chat? 🌸`
    }

    // Self-care related
    if (lowerMessage.match(/\b(rest|break|self.care|care|tired|sleep|exhausted|self care)\b/)) {
      return `Taking breaks and prioritizing self-care is so important! 💝 Your body works hard throughout your cycle, and rest is not a luxury—it's a necessity. During your period and luteal phase especially, your body needs more rest. Would you like some gentle activity suggestions, or do you just need permission to rest? Remember, you're doing enough. 🌸`
    }

    // Work/productivity related
    if (lowerMessage.match(/\b(work|task|productivity|focus|concentrate|deadline|busy|study)\b/)) {
      if (cycleData) {
        const cycleDay = calculateCycleDay(cycleData.lastPeriodStart, cycleData.cycleLength)
        const phase = calculatePhase(cycleDay, cycleData.cycleLength, cycleData.periodDuration)
        const mood = predictMood(phase, cycleData.symptoms)

        if (mood === 'low') {
          return `I understand you have things to do, but remember that your energy levels naturally fluctuate with your cycle. It's okay to adjust your expectations and focus on lighter tasks when you're not feeling your best. Be kind to yourself - your productivity will return. 🌙`
        } else {
          return `Great time to tackle important tasks! Your energy and focus are likely higher right now - this is a perfect phase for productivity. But remember, even on high-energy days, take breaks and stay hydrated. You've got this! ✨`
        }
      }
      return `I'd love to help you plan your work schedule! Check out the Schedule page to see how your cycle can guide your productivity. Different cycle phases are better suited for different types of work. 🌸`
    }

    // Health concerns
    if (lowerMessage.match(/\b(concerned|worried|normal|abnormal|should i|when to see|doctor|healthcare|medical)\b/)) {
      return `It's always okay to have concerns about your cycle! While many variations are normal, you should consider seeing a healthcare provider if: cycles are consistently shorter than 21 days or longer than 35 days, extremely heavy bleeding, severe pain, irregular bleeding between periods, or sudden changes. Your concerns are valid - don't hesitate to seek professional advice. 💝`
    }

    // Gratitude/thanks
    if (lowerMessage.match(/\b(thank|thanks|appreciate|grateful|helpful)\b/)) {
      return `You're so welcome! I'm here for you anytime you need support, encouragement, or information about your cycle. Remember, you're doing great, and understanding your cycle is a journey. Feel free to ask me anything! 💝`
    }

    // Greetings
    if (lowerMessage.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
      if (cycleData) {
        const cycleDay = calculateCycleDay(cycleData.lastPeriodStart, cycleData.cycleLength)
        const phase = calculatePhase(cycleDay, cycleData.cycleLength, cycleData.periodDuration)
        const phaseName = getPhaseName(phase)
        return `Hello! 🌸 I see you're on day ${cycleDay} of your cycle, in the ${phaseName} phase. How are you feeling today? I'm here to chat about your cycle, answer questions, or just listen. What's on your mind? 💝`
      }
      return `Hello! 🌸 I'm your SakuraCycle companion. I'm here to help you understand your menstrual cycle, answer questions, and provide support. How can I help you today? 💝`
    }

    // Questions about the app
    if (lowerMessage.match(/\b(what can you|what do you|help|assist|capabilities|features)\b/)) {
      return `I can help you with: understanding your cycle phases, explaining symptoms, nutrition and exercise tips for different phases, tracking your current cycle day, mood and energy patterns, self-care suggestions, and general menstrual health information. I'm also here to listen and provide emotional support. What would you like to know? 🌸`
    }

    // Default empathetic responses
    const defaultResponses = [
      `I'm here to listen and support you. 🌸 Feel free to ask me anything about your menstrual cycle, or just tell me how you're feeling. What's on your mind?`,
      `That sounds important to you. Tell me more about how you're feeling, or ask me anything about your cycle. 💝`,
      `I understand. Remember, your feelings are valid, and it's okay to not be okay sometimes. What would help you right now? Would you like to talk about your cycle, or just chat? 🌙`,
      `Thank you for sharing that with me. You're not alone in this. How can I support you today? Feel free to ask me about your cycle or anything else. ✨`,
      `I'm here for you. Whether you need information about your cycle, encouragement, a listening ear, or just someone to chat with, I've got you. What would you like to talk about? 🌸`
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')

    // Log message for inference
    logSignal(EVENTS.CHAT_MESSAGE, { text: userMessage })

    // Add user message
    const newMessages = [...messages, { role: 'user', text: userMessage, timestamp: new Date() }]
    setMessages(newMessages)
    setIsTyping(true)

    // Simulate thinking time
    setTimeout(() => {
      const response = generateResponse(userMessage)
      setIsTyping(false)
      setMessages([...newMessages, { role: 'assistant', text: response, timestamp: new Date() }])
    }, 1000 + Math.random() * 1000) // 1-2 second delay
  }

  return (
    <div className="ai-companion">
      <div className="container">
        <div className="companion-header">
          <h1>💬 Your AI Companion</h1>
          <p>A supportive friend who understands your cycle and cares about your wellbeing</p>
        </div>

        <div className="card chat-container">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-content">
                  {msg.role === 'assistant' && (
                    <span className="message-avatar">🌸</span>
                  )}
                  <div className="message-bubble">
                    <p>{msg.text}</p>
                  </div>
                  {msg.role === 'user' && (
                    <span className="message-avatar">👤</span>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message assistant-message">
                <div className="message-content">
                  <span className="message-avatar">🌸</span>
                  <div className="message-bubble typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
              disabled={isTyping}
            />
            <button
              type="submit"
              className="btn chat-send-button"
              disabled={isTyping || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>

        <div className="quick-questions">
          <h3>💡 Quick Questions You Can Ask:</h3>
          <div className="question-buttons">
            <button
              className="quick-btn"
              onClick={() => {
                setInput("What phase am I in?")
                setTimeout(() => {
                  const inputEl = document.querySelector('.chat-input')
                  if (inputEl) inputEl.focus()
                }, 100)
              }}
            >
              What phase am I in?
            </button>
            <button
              className="quick-btn"
              onClick={() => {
                setInput("Tell me about my cycle")
                setTimeout(() => {
                  const inputEl = document.querySelector('.chat-input')
                  if (inputEl) inputEl.focus()
                }, 100)
              }}
            >
              Tell me about my cycle
            </button>
            <button
              className="quick-btn"
              onClick={() => {
                setInput("What helps with cramps?")
                setTimeout(() => {
                  const inputEl = document.querySelector('.chat-input')
                  if (inputEl) inputEl.focus()
                }, 100)
              }}
            >
              What helps with cramps?
            </button>
            <button
              className="quick-btn"
              onClick={() => {
                setInput("What should I eat during my period?")
                setTimeout(() => {
                  const inputEl = document.querySelector('.chat-input')
                  if (inputEl) inputEl.focus()
                }, 100)
              }}
            >
              What should I eat?
            </button>
          </div>
        </div>

        <div className="companion-note">
          <p>💝 Your companion is here to support, encourage, and listen. Ask me anything about your menstrual cycle, symptoms, self-care, or just chat about how you're feeling. This is a safe space. 🌸</p>
        </div>
      </div>
    </div>
  )
}
