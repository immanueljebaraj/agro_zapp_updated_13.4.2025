import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const formatBotResponse = (text) => {
    // Convert markdown-style bullets and formatting
    return text
      .replace(/\n/g, "<br/>")
      .replace(/\•/g, "•")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to the chat
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsTyping(true);

    try {
      const optimizedPrompt = `Provide concise agricultural advice following these rules:
      1. Respond in 1-2 short sentences (max 30 words)
      2. Use bullet points (•) for lists
      3. Bold (**) key terms
      4. Include 1 actionable recommendation
      5. Skip disclaimers unless critical
      6. Format with clear line breaks
      
      Query: ${input}`;

      const response = await fetch(
        "http://localhost:8000/api/ollama/ask-ollama/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ question: optimizedPrompt }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.response,
            formatted: formatBotResponse(data.response),
          },
        ]);
      } else {
        throw new Error("Failed to fetch response");
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong. Please try again later.",
          formatted: "Sorry, something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Overlay when chat is open */}
      {isOpen && (
        <div className="chatbot-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* Chatbot button */}
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <img
            src="/chatbot.png"
            alt="Agri Assistant"
            className="chatbot-icon"
          />
          <span>Agri Assistant</span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <img
                src="/chatbot.png"
                alt="Agri Assistant"
                className="chatbot-header-icon"
              />
              <h3>Agri Assistant</h3>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div className="chatbot-welcome">
                <p>Hello! I'm your agriculture assistant.</p>
                <p>Ask me about crops, soil, weather, or farming techniques.</p>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chatbot-message ${msg.sender}`}
                    dangerouslySetInnerHTML={{
                      __html: msg.formatted || msg.text,
                    }}
                  />
                ))}
                {isTyping && (
                  <div className="chatbot-message bot typing-indicator">
                    Analyzing...
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input area */}
          <div className="chatbot-input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="chatbot-input"
              placeholder="Ask about crops, soil, weather..."
            />
            <button
              className="chatbot-send"
              onClick={sendMessage}
              disabled={isTyping}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
