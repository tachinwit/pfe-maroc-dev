import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Send, User, MessageCircle, ArrowLeft, Trash2, Edit2, Check, X } from 'lucide-react';
import MainLayout from '../Layouts/MainLayout';
import Toast from '../Components/common/Toast';

export default function MessagesPage({ auth, contacts, activeUserId, activeChat }) {
    const [toast, setToast] = useState(null);
    const messagesEndRef = useRef(null);
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editContent, setEditContent] = useState('');
    
    const { data, setData, post, processing, reset } = useForm({
        receiver_id: activeUserId || '',
        content: ''
    });

    const activeContact = contacts.find(c => c.user.id === activeUserId)?.user;

    useEffect(() => {
        setData('receiver_id', activeUserId || '');
    }, [activeUserId]);

    // Scroll to bottom when chat updates
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeChat]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!data.content.trim()) return;

        post('/messages', {
            preserveScroll: true,
            onSuccess: () => {
                reset('content');
            },
            onError: () => {
                setToast({ message: 'Erreur lors de l\'envoi du message.', points: null });
            }
        });
    };

    const handleDeleteConversation = () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer toute cette conversation ?")) {
            router.delete(`/messages/conversation/${activeUserId}`, {
                preserveScroll: true
            });
        }
    };

    const handleEditSubmit = (msgId) => {
        if (!editContent.trim()) return;
        router.put(`/messages/${msgId}`, { content: editContent }, {
            preserveScroll: true,
            onSuccess: () => setEditingMessageId(null)
        });
    };

    const handleDeleteMessage = (msgId) => {
        if (confirm("Supprimer ce message ?")) {
            router.delete(`/messages/${msgId}`, { preserveScroll: true });
        }
    };

    return (
        <MainLayout>
            <Head title="Messagerie" />
            {toast && <Toast message={toast.message} points={toast.points} onClose={() => setToast(null)} />}

            <div className="container-center fade-in" style={{ paddingTop: '2rem', paddingBottom: '2rem', maxWidth: '1200px', height: 'calc(100vh - 100px)', minHeight: '600px' }}>
                <div className="card-premium" style={{ display: 'flex', height: '100%', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    
                    {/* Contacts Sidebar */}
                    <div style={{ width: '350px', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', background: 'rgba(15,23,42,0.4)', flexShrink: 0 }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MessageCircle size={24} color="var(--cyan)" />
                                Messagerie
                            </h2>
                        </div>
                        
                        <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scroll">
                            {contacts.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                                    <p>Aucune conversation pour le moment.</p>
                                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Allez sur le profil d'un développeur pour le contacter !</p>
                                </div>
                            ) : (
                                contacts.map((contact) => (
                                    <Link 
                                        key={contact.user.id} 
                                        href={`/messages?user_id=${contact.user.id}`}
                                        style={{ display: 'block', textDecoration: 'none' }}
                                        preserveScroll
                                    >
                                        <div style={{ 
                                            padding: '1rem 1.5rem', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '1rem', 
                                            borderBottom: '1px solid rgba(255,255,255,0.02)',
                                            background: activeUserId === contact.user.id ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
                                            transition: '0.2s',
                                            cursor: 'pointer'
                                        }} className="hover:bg-opacity-5">
                                            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), var(--indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, color: 'white' }}>
                                                {contact.user.name[0].toUpperCase()}
                                            </div>
                                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                                                    <span style={{ fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contact.user.name}</span>
                                                    {contact.last_message && (
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                                            {new Date(contact.last_message.created_at).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {contact.last_message ? (
                                                        contact.last_message.sender_id === auth.user.id 
                                                            ? `Vous: ${contact.last_message.content}` 
                                                            : contact.last_message.content
                                                    ) : 'Nouvelle conversation'}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(10,15,30,0.6)' }}>
                        {!activeUserId ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                                <MessageCircle size={64} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.2rem', color: 'white' }}>Vos Messages</h3>
                                <p>Sélectionnez une conversation pour commencer à discuter</p>
                            </div>
                        ) : (
                            <>
                                {/* Chat Header */}
                                <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), var(--indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {activeContact?.name ? activeContact.name[0].toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: 'white' }}>{activeContact?.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--cyan)' }}>{activeContact?.title || 'Membre DevMaroc'}</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={handleDeleteConversation} className="btn-outline hover-bright" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', color: '#ff4d4d', borderColor: 'rgba(255,77,77,0.3)', background: 'transparent', cursor: 'pointer' }}>
                                            <Trash2 size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                                            Supprimer
                                        </button>
                                        <Link href={`/user/${activeUserId}`} className="btn-outline hover-bright" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                                            Voir profil
                                        </Link>
                                    </div>
                                </div>

                                {/* Messages List */}
                                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="hide-scroll">
                                    {activeChat.length === 0 ? (
                                        <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-dim)' }}>
                                            Dites bonjour à {activeContact?.name} !
                                        </div>
                                    ) : (
                                        activeChat.map((msg) => {
                                            const isMe = msg.sender_id === auth.user.id;
                                            const isEditing = editingMessageId === msg.id;

                                            return (
                                                <div 
                                                    key={msg.id} 
                                                    style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}
                                                    onMouseEnter={() => setHoveredMessageId(msg.id)}
                                                    onMouseLeave={() => setHoveredMessageId(null)}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: isMe ? 'row' : 'row-reverse' }}>
                                                        {isMe && hoveredMessageId === msg.id && !isEditing && (
                                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                                <button onClick={() => { setEditingMessageId(msg.id); setEditContent(msg.content); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: '5px' }} className="hover-bright"><Edit2 size={14} /></button>
                                                                <button onClick={() => handleDeleteMessage(msg.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ff4d4d', padding: '5px' }} className="hover-bright"><Trash2 size={14} /></button>
                                                            </div>
                                                        )}

                                                        {isEditing ? (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--cyan)' }}>
                                                                <input 
                                                                    type="text" 
                                                                    value={editContent} 
                                                                    onChange={e => setEditContent(e.target.value)} 
                                                                    style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.9rem', width: '200px' }}
                                                                    autoFocus
                                                                    onKeyDown={e => { if (e.key === 'Enter') handleEditSubmit(msg.id); if (e.key === 'Escape') setEditingMessageId(null); }}
                                                                />
                                                                <button onClick={() => handleEditSubmit(msg.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--cyan)' }}><Check size={16} /></button>
                                                                <button onClick={() => setEditingMessageId(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ff4d4d' }}><X size={16} /></button>
                                                            </div>
                                                        ) : (
                                                            <div style={{ 
                                                                maxWidth: '75%', 
                                                                padding: '0.8rem 1.2rem', 
                                                                borderRadius: '16px',
                                                                borderBottomRightRadius: isMe ? '4px' : '16px',
                                                                borderBottomLeftRadius: !isMe ? '4px' : '16px',
                                                                background: isMe ? 'var(--cyan)' : 'rgba(255,255,255,0.05)',
                                                                color: isMe ? '#000' : 'white',
                                                                border: isMe ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                                                fontWeight: 500,
                                                                wordBreak: 'break-word'
                                                            }}>
                                                                {msg.content}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.3rem', padding: '0 0.5rem' }}>
                                                        {msg.time_human || msg.created_at} {msg.created_at !== msg.updated_at && '(modifié)'}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                                    <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            value={data.content}
                                            onChange={e => setData('content', e.target.value)}
                                            placeholder="Écrivez votre message..."
                                            className="u-input"
                                            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.5rem', borderRadius: '30px', color: 'white' }}
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={processing || !data.content.trim()} 
                                            className="btn-premium"
                                            style={{ width: '50px', height: '50px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: (processing || !data.content.trim()) ? 'not-allowed' : 'pointer', opacity: (processing || !data.content.trim()) ? 0.6 : 1 }}
                                        >
                                            <Send size={20} style={{ marginLeft: '-2px' }}/>
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
