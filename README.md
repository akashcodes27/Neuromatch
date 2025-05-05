# 🧠 NeuroMatch — Personality-Based Recommendation System

NeuroMatch is an AI-assisted full-stack web application designed to help users discover personalized career paths, growth-focused book recommendations, and receive motivational guidance — all based on their unique personality type.

Whether you're feeling lost in your journey or just curious about how your personality maps to opportunities, **NeuroMatch** is your intelligent self-discovery assistant.

---

## 🔍 What It Does

- 🔐 Analyzes your personality through a 20-question MBTI-style quiz.
- 🎯 Recommends careers that suit your personality profile.
- 📚 Suggests curated self-improvement books tailored to your core traits.
- 💬 Includes a motivational therapy chatbot that speaks to your personality style.
- 🧠 Designed for clarity, simplicity, and purpose — no fluff.

---

## 🧰 Tech Stack

| Layer        | Technology                              |
|--------------|------------------------------------------|
| **Frontend** | React.js, HTML5, CSS3, JavaScript        |
| **Backend**  | Firebase (Realtime DB, Hosting)          |
| **Logic**    | LangChain-based scripted responses       |
| **Tools**    | Git, Vite, Netlify/Vercel (optional)     |

---

## ✨ Key Features

- ✅ **20-Question Personality Quiz**  
  Interactive MBTI-style quiz with a live progress bar and clean UI.

- 📊 **Real-Time Personality Analysis**  
  Instant evaluation of answers and generation of MBTI personality types.

- 💼 **Career Recommendations**  
  Based on your personality, the app offers role suggestions in tech, business, creativity, and more.

- 📖 **Book Recommendations**  
  Curated list of self-growth and mindset books matching personality traits.

- 🧘 **Therapy Chatbot**  
  Personality-based chatbot that gives motivational, cognitive behavioral-style advice using scripted logic.

- 🧾 **Firebase Integration**  
  Secure storage of quiz results and recommendation mappings using Firebase Realtime DB.

---

## 🖼️ Screenshots (Coming Soon)

> Add screenshots of quiz page, results page, chatbot conversation, etc.

---

## 🧩 App Structure

```plaintext
📦 NeuroMatch/
├── public/
├── src/
│   ├── components/
│   │   ├── Quiz.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── ResultPage.jsx
│   │   ├── BookRecommendations.jsx
│   │   ├── CareerRecommendations.jsx
│   │   └── Chatbot.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Dashboard.jsx
│   ├── utils/
│   │   ├── mbtiLogic.js
│   │   ├── recommendationMap.js
│   ├── App.js
│   └── index.js
├── firebaseConfig.js
├── package.json
└── README.md
