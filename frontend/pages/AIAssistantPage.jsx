import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Sparkles, Code, FileCode, Zap, Lightbulb, Copy, Check, Terminal, Cpu, MessageSquare } from 'lucide-react';
import { Link, usePage, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Toast from '../components/common/Toast';

/**
 * AIAssistantPage - Real-time AI chat for developers.
 * Provides code help and technical explanations.
 */
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
  const [toast, setToast] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { type: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post('/ai/chat', { message: currentInput });
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: res.data.response || 'Désolé, je ne peux pas répondre pour le moment.',
        code: res.data.code || null,
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { type: 'assistant', content: 'Le service IA est indisponible.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="ai-assistant-page">
      <Head title="Assistant IA" />
      
      <div className="ai-chat-header">
        <div className="header-icon"><Sparkles size={24}/></div>
        <div className="header-text">
          <h1>Assistant IA</h1>
          <p>Propulsé par Claude AI</p>
        </div>
      </div>

      <div className="chat-area">
        <div className="messages-list">
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg-row ${msg.type}`}>
               <div className="avatar-mini">
                 {msg.type === 'assistant' ? <Cpu size={20}/> : <MessageSquare size={20}/>}
               </div>
               <div className="msg-payload">
                  <div className="bubble">{msg.content}</div>
                  {msg.code && (
                    <div className="code-container">
                       <div className="code-header">
                         <span>Snippet</span>
                         <button onClick={() => copyCode(msg.code, idx)}>
                           {copiedCode === idx ? <Check size={14}/> : <Copy size={14}/>}
                         </button>
                       </div>
                       <pre><code>{msg.code}</code></pre>
                    </div>
                  )}
               </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-box-wrapper">
           <div className="input-inner">
             <textarea 
               value={input} 
               onChange={e => setInput(e.target.value)}
               placeholder="Posez votre question..."
               onKeyDown={e => { if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
             />
             <button onClick={handleSend} disabled={!input.trim() || isTyping}>
               <Send size={18}/>
             </button>
           </div>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)}/>
    </div>
  );
};

AIAssistantPage.layout = page => <MainLayout>{page}</MainLayout>;

export default AIAssistantPage;
