import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Sparkles, Code, FileCode, Zap, Lightbulb, Copy, Check, Terminal, Cpu, MessageSquare, Loader2, User } from 'lucide-react';
import { Link, usePage, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import Toast from '../Components/common/Toast';

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
      const errorMsg = err.response?.data?.error || 'Le service IA est indisponible pour le moment. Veuillez réessayer plus tard.';
      setMessages(prev => [...prev, { type: 'assistant', content: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const insertSuggestion = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <div className="container-center" style={{ paddingTop: '1rem', paddingBottom: '2rem', maxWidth: '1400px', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <Head title="Assistant IA Pro" />
      
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <Sparkles className="text-cyan" size={40} /> Assistant <span className="gradient-text">Expert IA</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', color: 'var(--text-dim)', fontSize: '1.1rem' }}>
            <span style={{ padding: '0.2rem 0.8rem', background: 'rgba(0, 217, 255, 0.1)', color: 'var(--cyan)', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem' }}>Llama 3.3 PRO</span>
            <span>•</span>
            <span>Discussion Instantanée</span>
        </div>
      </div>

      <div className="card-premium" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, border: '1px solid rgba(255,255,255,0.05)' }}>
        
        {/* Chat Area */}
        <div className="hide-scroll" style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: msg.type === 'user' ? 'row-reverse' : 'row',
              gap: '1rem',
              alignItems: 'flex-start'
            }}>
               
               {/* Avatar */}
               <div style={{
                 width: '36px',
                 height: '36px',
                 borderRadius: '10px',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 background: msg.type === 'assistant' ? 'rgba(0, 217, 255, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                 color: msg.type === 'assistant' ? 'var(--cyan)' : 'var(--indigo)',
                 flexShrink: 0
               }}>
                 {msg.type === 'assistant' ? <Cpu size={20}/> : <User size={20}/>}
               </div>

               {/* Message Content */}
                   <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{
                    padding: '1.5rem 2rem',
                    borderRadius: '24px',
                    borderTopLeftRadius: msg.type === 'assistant' ? 0 : '24px',
                    borderTopRightRadius: msg.type === 'user' ? 0 : '24px',
                    background: msg.type === 'assistant' ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, var(--indigo), var(--cyan))',
                    border: msg.type === 'assistant' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    color: msg.type === 'assistant' ? '#fff' : '#000',
                    fontSize: '1.2rem', // VERY LARGE AND READABLE
                    lineHeight: 1.8,
                    boxShadow: msg.type === 'assistant' ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 20px rgba(0, 217, 255, 0.2)'
                  }}>
                    {msg.content}
                  </div>

                  {/* Assistant Suggestions */}
                  {msg.suggestions && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '1rem' }}>
                      {msg.suggestions.map((sug, i) => (
                        <button 
                          key={i} 
                          onClick={() => insertSuggestion(sug)}
                          style={{
                            background: 'rgba(0, 217, 255, 0.05)',
                            border: '1px solid rgba(0, 217, 255, 0.2)',
                            color: 'var(--cyan)',
                            padding: '0.6rem 1.5rem',
                            borderRadius: '30px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(0, 217, 255, 0.1)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(0, 217, 255, 0.05)'; }}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Code Snippet */}
                  {msg.code && (
                    <div style={{ marginTop: '0.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                       <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                         <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>Extrait de code</span>
                         <button 
                           onClick={() => copyCode(msg.code, idx)}
                           style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
                         >
                           {copiedCode === idx ? <><Check size={14} color="var(--cyan)"/> Copié</>  : <><Copy size={14}/> Copier</>}
                         </button>
                       </div>
                       <pre style={{ margin: 0, padding: '1.5rem', background: '#080c14', overflowX: 'auto', fontSize: '1.1rem', color: '#e2e8f0', fontFamily: 'JetBrains Mono, SFMono-Regular, Consolas, monospace' }}>
                         <code>{msg.code}</code>
                       </pre>
                    </div>
                  )}
               </div>
            </div>
          ))}

          {isTyping && (
             <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 217, 255, 0.1)', color: 'var(--cyan)', flexShrink: 0 }}>
                  <Cpu size={20}/>
                </div>
                <div style={{ padding: '1rem 1.2rem', borderRadius: '16px', borderTopLeftRadius: 0, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Loader2 size={16} className="animate-spin" color="var(--cyan)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>L'IA réfléchit...</span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
           <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
             <textarea 
               value={input} 
               onChange={e => setInput(e.target.value)}
               placeholder="Posez votre question technique ici..."
               style={{ 
                 width: '100%', 
                 padding: '1.5rem 5rem 1.5rem 2rem', 
                 background: 'rgba(255,255,255,0.08)', 
                 border: '2px solid rgba(255,255,255,0.15)', 
                 borderRadius: '35px', 
                 color: 'white', 
                 fontSize: '1.25rem',
                 resize: 'none',
                 height: '90px',
                 lineHeight: '34px',
                 overflow: 'hidden',
                 boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                 transition: 'all 0.3s'
               }}
               onFocus={(e) => e.target.style.borderColor = 'var(--cyan)'}
               onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
               onKeyDown={e => { if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
             />
             <button 
               onClick={handleSend} 
               disabled={!input.trim() || isTyping}
               style={{ 
                 position: 'absolute', 
                 right: '0.5rem', 
                 top: '50%', 
                 transform: 'translateY(-50%)', 
                 width: '40px', 
                 height: '40px', 
                 borderRadius: '50%', 
                 background: (!input.trim() || isTyping) ? 'rgba(255,255,255,0.1)' : 'var(--cyan)', 
                 color: (!input.trim() || isTyping) ? 'rgba(255,255,255,0.3)' : '#000', 
                 border: 'none', 
                 display: 'flex', 
                 alignItems: 'center', 
                 justifyContent: 'center', 
                 cursor: (!input.trim() || isTyping) ? 'not-allowed' : 'pointer',
                 transition: 'all 0.2s'
               }}
             >
               <Send size={18} style={{ marginLeft: '-2px' }}/>
             </button>
           </div>
           <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
             <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>L'IA peut faire des erreurs. Vérifiez toujours le code généré.</span>
           </div>
        </div>
      </div>
      
      <Toast toast={toast} onClose={() => setToast(null)}/>
    </div>
  );
};

AIAssistantPage.layout = page => <MainLayout>{page}</MainLayout>;

export default AIAssistantPage;

