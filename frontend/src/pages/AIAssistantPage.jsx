import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Code, FileCode, Zap, Lightbulb, 
  Copy, Check, Terminal, Cpu, MessageSquare, RefreshCw
} from 'lucide-react';

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: "Bonjour ! Je suis votre assistant IA pour le développement. Je peux vous aider avec :",
      suggestions: [
        "Analyser et débugger votre code",
        "Expliquer des concepts complexes",
        "Générer du code optimisé",
        "Proposer des solutions architecturales"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const exampleQuestions = [
    { icon: <Code />, text: "Comment optimiser une requête SQL complexe ?" },
    { icon: <Zap />, text: "Explique-moi les React Hooks en détail" },
    { icon: <Lightbulb />, text: "Quelle architecture pour une API scalable ?" },
    { icon: <FileCode />, text: "Debug ce code : [coller ton code]" }
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'assistant',
        content: "Voici une solution optimisée pour votre problème :",
        code: `// Solution avec React Hooks
import { useState, useEffect, useCallback } from 'react';

function useOptimizedData(apiUrl) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}`,
        explanation: "Ce hook personnalisé utilise useCallback pour mémoriser la fonction de fetch et éviter les re-renders inutiles. Il gère également les états de chargement et d'erreur de manière propre."
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const copyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="ai-assistant-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --midnight: #0F2027;
          --steel: #4A6070;
          --indigo: #4B0082;
          --cyan: #00D9FF;
          --lime: #CCFF00;
          --purple-light: #8B5CF6;
        }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: var(--midnight);
          color: #ffffff;
        }

        .ai-assistant-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: 
            radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 217, 255, 0.1) 0%, transparent 50%);
        }

        /* Header */
        .ai-header {
          background: linear-gradient(135deg, rgba(75, 0, 130, 0.4), rgba(15, 32, 39, 0.9));
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(30px);
          padding: 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .ai-icon {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--purple-light), var(--cyan));
          display: flex;
          align-items: center;
          justify-content: center;
          animation: glow 3s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 50px rgba(0, 217, 255, 0.8);
            transform: scale(1.05);
          }
        }

        .header-title {
          display: flex;
          flex-direction: column;
        }

        .ai-title {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff, var(--cyan), var(--purple-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ai-subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .status-badge {
          padding: 0.5rem 1.2rem;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 20px;
          color: #10B981;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10B981;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Chat Container */
        .chat-container {
          flex: 1;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          padding: 2rem;
          overflow: hidden;
        }

        /* Messages Area */
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 2rem 0;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }

        .messages-area::-webkit-scrollbar {
          width: 8px;
        }

        .messages-area::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-area::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }

        /* Message Styles */
        .message {
          display: flex;
          gap: 1.5rem;
          animation: fadeInUp 0.5s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message.assistant .message-avatar {
          background: linear-gradient(135deg, var(--purple-light), var(--cyan));
        }

        .message.user .message-avatar {
          background: linear-gradient(135deg, var(--indigo), #6B0FA6);
        }

        .message-content {
          flex: 1;
          max-width: 700px;
        }

        .message.user .message-content {
          text-align: right;
        }

        .message-bubble {
          padding: 1.5rem;
          border-radius: 20px;
          line-height: 1.7;
          font-size: 1rem;
        }

        .message.assistant .message-bubble {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px 20px 20px 4px;
        }

        .message.user .message-bubble {
          background: linear-gradient(135deg, var(--indigo), #6B0FA6);
          border-radius: 20px 20px 4px 20px;
        }

        /* Code Block */
        .code-block-container {
          margin: 1.5rem 0;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }

        .code-block-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .code-language {
          color: var(--cyan);
          font-size: 0.85rem;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
        }

        .copy-btn {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .copy-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--cyan);
          color: var(--cyan);
        }

        .copy-btn.copied {
          background: rgba(16, 185, 129, 0.15);
          border-color: #10B981;
          color: #10B981;
        }

        .code-block {
          padding: 1.5rem;
          overflow-x: auto;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          line-height: 1.8;
          color: #E5E7EB;
        }

        .code-comment { color: #6B7280; font-style: italic; }
        .code-keyword { color: var(--purple-light); font-weight: 600; }
        .code-function { color: var(--cyan); }
        .code-string { color: var(--lime); }
        .code-number { color: #F59E0B; }

        /* Suggestions */
        .suggestions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .suggestion-chip {
          padding: 0.75rem 1rem;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .suggestion-chip:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: var(--purple-light);
          transform: translateY(-2px);
        }

        /* Typing Indicator */
        .typing-indicator {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px 20px 20px 4px;
          width: fit-content;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--cyan);
          animation: typing 1.4s infinite;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
          30% { transform: translateY(-10px); opacity: 1; }
        }

        /* Example Questions */
        .example-questions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .example-card {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .example-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--cyan);
          transform: translateY(-3px);
        }

        .example-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--purple-light), var(--cyan));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }

        .example-text {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
        }

        /* Input Area */
        .input-area {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          transition: all 0.3s ease;
        }

        .input-area:focus-within {
          border-color: var(--cyan);
          box-shadow: 0 0 30px rgba(0, 217, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
        }

        .message-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 1rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none;
          min-height: 24px;
          max-height: 150px;
          resize: none;
        }

        .message-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .input-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: none;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .send-btn {
          background: linear-gradient(135deg, var(--purple-light), var(--cyan));
          color: #ffffff;
        }

        .send-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .chat-container {
            padding: 1rem;
          }

          .example-questions {
            grid-template-columns: 1fr;
          }

          .message-content {
            max-width: 100%;
          }

          .suggestions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header */}
      <div className="ai-header">
        <div className="header-content">
          <div className="header-left">
            <div className="ai-icon">
              <Sparkles size={24} />
            </div>
            <div className="header-title">
              <h1 className="ai-title">Assistant IA</h1>
              <p className="ai-subtitle">Propulsé par Claude AI</p>
            </div>
          </div>
          <div className="status-badge">
            <div className="status-dot"></div>
            En ligne
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="chat-container">
        {/* Example Questions (shown when no messages) */}
        {messages.length === 1 && (
          <div className="example-questions">
            {exampleQuestions.map((q, idx) => (
              <div 
                key={idx} 
                className="example-card"
                onClick={() => setInput(q.text)}
              >
                <div className="example-icon">{q.icon}</div>
                <div className="example-text">{q.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Messages Area */}
        <div className="messages-area">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              <div className="message-avatar">
                {msg.type === 'assistant' ? <Cpu size={22} /> : <MessageSquare size={22} />}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {msg.content}
                </div>
                
                {msg.suggestions && (
                  <div className="suggestions">
                    {msg.suggestions.map((suggestion, i) => (
                      <div 
                        key={i} 
                        className="suggestion-chip"
                        onClick={() => setInput(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}

                {msg.code && (
                  <div className="code-block-container">
                    <div className="code-block-header">
                      <span className="code-language">JavaScript</span>
                      <button 
                        className={`copy-btn ${copiedCode === idx ? 'copied' : ''}`}
                        onClick={() => copyCode(msg.code, idx)}
                      >
                        {copiedCode === idx ? (
                          <>
                            <Check size={16} />
                            Copié !
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copier
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="code-block">{msg.code}</pre>
                  </div>
                )}

                {msg.explanation && (
                  <div className="message-bubble" style={{ marginTop: '1rem' }}>
                    💡 {msg.explanation}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message assistant">
              <div className="message-avatar">
                <Cpu size={22} />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <textarea
            className="message-input"
            placeholder="Posez votre question ou collez votre code..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
          />
          <div className="input-actions">
            <button className="action-btn">
              <Terminal size={20} />
            </button>
            <button 
              className="action-btn send-btn"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
