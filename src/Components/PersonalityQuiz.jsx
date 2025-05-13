import React, { useState } from "react";
import "../styles/PersonalityQuiz.css";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const openaikey = process.env.REACT_APP_OPENAI_API_KEY 

const questionData = [
  { id: 1, question: "I enjoy spending time alone and often prefer it over social gatherings." },
  { id: 2, question: "I make decisions based on logic rather than emotions." },
  { id: 3, question: "I get energized by being around people and engaging in conversations." },
  { id: 4, question: "I prefer to plan everything in advance rather than be spontaneous." },
  { id: 5, question: "I often think about the deeper meaning of things rather than just accepting them at face value." },
  { id: 6, question: "I tend to avoid conflicts and prefer to keep peace in social settings." },
  { id: 7, question: "I adapt quickly when plans change unexpectedly." },
  { id: 8, question: "I focus more on facts and practicality than abstract ideas." },
  { id: 9, question: "I rely heavily on my intuition when making decisions." },
  { id: 10, question: "I enjoy taking the lead and making decisions in group settings." },
  { id: 11, question: "I often reflect deeply on my emotions and experiences." },
  { id: 12, question: "I’m more productive when I have a structured routine." },
  { id: 13, question: "I find it easy to express my thoughts and opinions openly." },
  { id: 14, question: "I tend to be reserved and take time to open up to others." },
  { id: 15, question: "I get stressed when there is a lack of organization or clarity." },
  { id: 16, question: "I trust my gut feeling even when it goes against logical reasoning." },
  { id: 17, question: "I often try to help others, even if it means putting my own needs second." },
  { id: 18, question: "I enjoy exploring new ideas and unconventional ways of thinking." },
  { id: 19, question: "I prefer working independently rather than in teams." },
  { id: 20, question: "I tend to look at situations objectively rather than getting emotionally involved." }
];

const questions = questionData.map((q) => ({
  ...q,
  options: ["Strongly Agree", "Agree", "Disagree", "Strongly Disagree"],
}));

const PersonalityQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(20).fill(null));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOptionSelect = (option) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = option;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestion] === null) {
      alert("Please select an option first.");
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentQuestion((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      alert("Please answer all questions.");
      return;
    }

    setLoading(true);
    console.log("Submitted Answers:", answers);

    try {
      const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaikey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Based on these answers, suggest a personality type and career with detailed explanation: ${answers.join(", ")}`,
            },
          ],
          temperature: 0.7,
        }),
      });

      const gptData = await gptRes.json();
      const gptResult = gptData.choices?.[0]?.message?.content || "No result";


       // 📚 2. Prompt for book suggestions
    const booksPrompt = `Based on these answers, recommend 5 books that match the user's personality and goals. Include a 1-line description for each. Answers: ${answers.join(", ")}`;

    const booksRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaikey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: booksPrompt }],
        temperature: 0.7,
      }),
    });

    const booksData = await booksRes.json();
    const bookResult = booksData.choices?.[0]?.message?.content || "No book result";




      await addDoc(collection(db, "quizResults"), {
        userId: auth.currentUser?.uid || "guest",
        answers,
        gptResponse: gptResult,
        bookSuggestions: bookResult,
        createdAt: Timestamp.now(),
      });

      console.log("✅ Data saved to Firestore");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error hitting GPT or saving to Firestore:", err.message || err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);

  return (
    <div className="quiz-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>

      <h3 className="question">{questions[currentQuestion].question}</h3>

      <div className="options">
        {questions[currentQuestion].options.map((option, idx) => (
          <button
            key={idx}
            className={`option-btn ${answers[currentQuestion] === option ? "selected" : ""}`}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>   

      <div className="navigation">
        {currentQuestion > 0 && (
          <button onClick={handleBack} className="nav-btn">Back</button>
        )}
        {currentQuestion < questions.length - 1 ? (
          <button onClick={handleNext} className="nav-btn primary">Next</button>
        ) : (
          <button onClick={handleSubmit} className="nav-btn submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PersonalityQuiz;
