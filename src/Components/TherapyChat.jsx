import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../styles/Chatbot.css";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const TherapyChat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [personality, setPersonality] = useState("");
    const [loading, setLoading] = useState(true);




    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/"); // redirect to LandingPage
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };


    useEffect(() => {
        const fetchLatestPersonality = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const q = query(
                    collection(db, "quizResults"),
                    where("userId", "==", user.uid)
                );

                const snapshot = await getDocs(q);
                const results = [];
                snapshot.forEach((doc) => {
                    results.push({ id: doc.id, ...doc.data() });
                });

                const latest = results.sort(
                    (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
                )[0];

                setPersonality(latest.gptResponse || "a thoughtful individual");
                setLoading(false);
            } catch (err) {
                console.error("Error loading personality:", err);
            }
        };

        fetchLatestPersonality();
    }, []);

    const sendMessage = async () => {
        if (!userInput.trim()) return;

        const userMsg = { sender: "user", text: userInput };
        setMessages((prev) => [...prev, userMsg]);
        setUserInput("");

        // Compose prompt
        const prompt = `
You are a compassionate therapy chatbot. The user is ${personality}.
They just said: "${userInput}"

Reply with motivational, friendly advice in 2–4 sentences, like a supportive coach.
    `;

        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.8,
                }),
            });

            const data = await res.json();
            const botReply = data.choices?.[0]?.message?.content || "You're doing great!";

            const botMsg = { sender: "bot", text: botReply };
            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            console.error("GPT Error:", err);
            setMessages((prev) => [...prev, { sender: "bot", text: "Oops, something went wrong." }]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    if (loading) return <p>Loading chatbot...</p>;




    return (
        <>
            <div className="dashboard-wrapper">
                <header className="top-navbar">
                    <div className="nav-left">
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>

                        <Link to="/books" className="nav-link">Books</Link>
                        <Link to="/therapy" className="nav-link">Therapy</Link>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </header>


                <div className="chat-container">
                    <h2 className="chat-heading">🧠 Therapy Chatbot</h2>
                    <div className="chat-box">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input-box">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Type your thoughts here..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>

            </div>

        </>
    );
};

export default TherapyChat;
