import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Send, Search, Clock, Check, CheckCheck, MoreVertical, Phone, Video, ArrowLeft, MessageSquare } from 'lucide-react';

/**
 * MessagesPage - Direct messaging system.
 * Allows interaction between developers.
 */
const MessagesPage = () => {
  const { auth, developers } = usePage().props;
  const urlParams = new URLSearchParams(window.location.search);
  const initialUserId = urlParams.get('user_id');

  const [activeChat, setActiveChat] = useState(initialUserId ? parseInt(initialUserId) : (developers?.[0]?.id || null));
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat, conversations]);

  const activeUser = developers?.find(d => d.id === activeChat);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChat) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setConversations(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage]
    }));
    setInputMessage('');
  };

  const filteredDevs = (developers || []).filter(dev => 
    dev.id !== auth?.user?.id && 
    dev.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messages-page-wrapper">
      <Head title="Messages" />
      
      <div className="messages-layout">
        <aside className="msg-sidebar">
          <div className="sidebar-header">
            <h2>Messages</h2>
            <div className="search-wrap-mini">
              <Search size={16} />
              <input 
                placeholder="Chercher..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="conv-list">
            {filteredDevs.map(dev => (
              <div 
                key={dev.id} 
                className={`conv-item ${activeChat === dev.id ? 'active' : ''}`}
                onClick={() => setActiveChat(dev.id)}
              >
                <div className="avatar-stack">
                  <img src={`https://i.pravatar.cc/150?u=${dev.id}`} alt={dev.name} />
                  <div className="online-dot" />
                </div>
                <div className="conv-meta">
                  <div className="conv-title-row">
                    <strong>{dev.name}</strong>
                    <span>12:45</span>
                  </div>
                  <p>Commencer une discussion...</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="chat-main">
          {activeChat && activeUser ? (
            <>
              <div className="chat-header">
                <div className="header-user">
                  <img src={`https://i.pravatar.cc/150?u=${activeUser.id}`} alt={activeUser.name} />
                  <div>
                    <h3>{activeUser.name}</h3>
                    <p>En ligne</p>
                  </div>
                </div>
                <div className="header-tools">
                   <Phone size={20}/>
                   <Video size={20}/>
                </div>
              </div>

              <div className="msgs-scroll">
                {(conversations[activeChat] || []).map(msg => (
                  <div key={msg.id} className={`msg-bubble-row ${msg.sender}`}>
                    <div className="bubble-text">{msg.text}</div>
                    <span className="msg-time">{msg.time}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-footer" onSubmit={sendMessage}>
                <input 
                  value={inputMessage} 
                  onChange={e => setInputMessage(e.target.value)} 
                  placeholder="Écrivez votre message..." 
                />
                <button type="submit" disabled={!inputMessage.trim()}><Send size={18}/></button>
              </form>
            </>
          ) : (
            <div className="empty-chat-state">
              <MessageSquare size={64} />
              <p>Sélectionnez une conversation</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

MessagesPage.layout = page => <MainLayout>{page}</MainLayout>;

export default MessagesPage;
