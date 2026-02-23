# 🌸 SakuraCycle - Cycle-Aware Wellness & Productivity Companion

A beautiful, empathetic web application that understands the menstrual cycle and provides personalized wellness guidance, productivity planning, and emotional support.

## ✨ Features

### 1. **Menstrual Cycle Intelligence**
- Track your cycle with customizable parameters
- Automatic phase calculation (Menstrual, Follicular, Ovulation, Luteal)
- Daily mood, energy, and focus predictions
- Symptom tracking and integration

### 2. **Mood Prediction & Support**
- Visual mood indicators with sakura-themed design
- Gentle affirmations and motivational messages
- Activity suggestions based on current mood
- Empathetic, non-robotic support

### 3. **Health & Wellness Advice**
- Phase-specific nutrition tips
- Hydration reminders
- Exercise recommendations
- Rest and recovery guidance
- Clear medical disclaimer

### 4. **Smart Work Scheduling**
- Task management with priority levels
- Energy-based task recommendations
- Automatic scheduling suggestions based on cycle phase
- Visual calendar integration ready

### 5. **Mini Games & Stress Relief**
- **Breathing Exercise**: Guided breathing with animated sakura petals
- **Memory Game**: Sakura-themed card matching game
- Instant, no-login required
- Designed for relaxation, not competition

### 6. **AI Companion**
- Supportive, empathetic chat interface
- Cycle-aware responses
- Daily check-ins and encouragement
- Contextual advice based on current phase
- Gentle, friend-like personality

## 🎨 Design

- **Aesthetic**: Hand-drawn 2D Sakura (cherry blossom) style
- **Colors**: Pastel pinks, soft purples, warm creams
- **Animations**: Smooth, gentle micro-interactions
- **Theme**: Calm, cozy, emotionally safe atmosphere
- **Responsive**: Mobile-first design

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
sakura-cycle/
├── src/
│   ├── components/
│   │   ├── games/
│   │   │   ├── BreathingGame.jsx
│   │   │   ├── BreathingGame.css
│   │   │   ├── MemoryGame.jsx
│   │   │   └── MemoryGame.css
│   │   ├── AICompanion.jsx
│   │   ├── CycleSetup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MiniGames.jsx
│   │   ├── MoodIndicator.jsx
│   │   ├── Navigation.jsx
│   │   ├── SakuraPetals.jsx
│   │   ├── WellnessCard.jsx
│   │   └── WorkScheduler.jsx
│   ├── utils/
│   │   ├── affirmations.js
│   │   ├── cycleCalculator.js
│   │   ├── storage.js
│   │   └── wellnessAdvice.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Technology Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **Vite** - Build tool and dev server
- **CSS3** - Styling with animations
- **Local Storage** - Data persistence

## 💡 Key Features Explained

### Cycle Calculation
The app uses rule-based logic to calculate cycle phases and predictions. The code is structured to be easily upgradeable to AI/ML models in the future.

### Data Privacy
All data is stored locally in your browser. Nothing is sent to external servers. Your cycle information, tasks, and chat history remain private.

### Responsive Design
The application is fully responsive and works beautifully on:
- Desktop computers
- Tablets
- Mobile phones

## 🎯 Use Cases

1. **Daily Check-in**: Start your day by checking your cycle phase and energy predictions
2. **Task Planning**: Use the scheduler to align important work with high-energy days
3. **Stress Relief**: Take breaks with calming mini-games
4. **Emotional Support**: Chat with the AI companion when you need encouragement
5. **Wellness Guidance**: Get phase-specific advice for nutrition, exercise, and rest

## ⚠️ Important Disclaimer

**This application provides wellness guidance based on general patterns and is not medical advice.** Always consult healthcare professionals for medical concerns, diagnosis, or treatment.

## 🌟 Future Enhancements (AI/ML Ready)

The codebase is structured to easily integrate:
- Machine learning models for more accurate predictions
- Personalized pattern recognition
- Advanced mood tracking
- Predictive analytics
- Integration with wearable devices

## 📝 License

This project is created for hackathon purposes. Feel free to use and modify as needed.

## 🙏 Acknowledgments

Built with empathy and care for women's health and wellness. Designed to reduce stigma around menstrual cycles and promote self-care without guilt.

---

**Made with 🌸 for better cycle awareness and wellness**
