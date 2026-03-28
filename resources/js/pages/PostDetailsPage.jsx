import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Clock, User, Share2, ChevronUp, ChevronDown, CheckCircle, Award } from 'lucide-react';
import { Link, useForm, Head, router } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import Toast from '../Components/common/Toast';

export default function PostDetailsPage({ post, auth }) {
  const [toast, setToast] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  
  const { data, setData, post: submitPost, processing, reset, errors } = useForm({
    content: ''
  });

  const handleVote = (e, type, id, value) => {
    if (isVoting) return;
    if (!auth.user) {
      setToast({ message: 'Veuillez vous connecter pour voter.', type: 'error', points: null });
      return;
    }
    
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    setIsVoting(true);
    router.post(`/forum/${type}/${id}/vote`, { vote_type: value }, { 
      preserveScroll: true, 
      preserveState: true,
      onSuccess: (page) => {
        if (page.props.flash?.success) {
          setToast({ message: page.props.flash.success, points: page.props.flash.points || null });
        }
      },
      onFinish: () => setIsVoting(false)
    });
    
    // Inertia reloads the page, which resets the state. 
    // But setting it back to false onFinish is safer.
    setTimeout(() => setIsVoting(false), 1000); 
  };

  const handleBestAnswer = (commentId) => {
    router.post(`/forum/comments/${commentId}/best-answer`, {}, { 
      preserveScroll: true, 
      preserveState: true,
      onSuccess: (page) => {
        if (page.props.flash?.success) {
            setToast({ message: page.props.flash.success, points: null });
        }
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitPost(`/forum/${post.id}/comments`, {
      onSuccess: (page) => {
        reset();
        if (page.props.flash?.success) {
            setToast({ message: page.props.flash.success, points: null });
        } else {
            setToast({ message: 'Réponse ajoutée avec succès !', points: null });
        }
      },
      onError: () => {
        setToast({ message: 'Erreur lors de l\'envoi de la réponse.', type: 'error', points: null });
      }
    });
  };

  return (
    <MainLayout>
      <Head title={`${post.title} - Communauté`} />
      
      {toast && <Toast message={toast.message} points={toast.points} onClose={() => setToast(null)} />}

      <div className="container-center fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '800px' }}>
        
        {/* Back Button */}
        <Link href="/forum" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cyan)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600, transition: '0.3s' }} className="hover-bright">
          <ArrowLeft size={18} /> Retour à la communauté
        </Link>
        
        {/* Original Post */}
        <div className="card-premium" style={{ marginBottom: '2rem', padding: '2rem', border: '1px solid rgba(0, 217, 255, 0.2)', background: 'linear-gradient(to bottom, rgba(15,23,42,0.8), rgba(15,23,42,0.4))' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ 
              padding: '0.3rem 0.8rem', 
              background: post.category === 'Frontend' ? 'rgba(168, 85, 247, 0.15)' : (post.category === 'Backend' ? 'rgba(59, 130, 246, 0.15)' : (post.category === 'DevOps' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)')), 
              color: post.category === 'Frontend' ? '#A855F7' : (post.category === 'Backend' ? '#3B82F6' : (post.category === 'DevOps' ? '#10B981' : '#F43F5E')), 
              borderRadius: '20px', 
              fontSize: '0.8rem', 
              fontWeight: 700,
              border: `1px solid ${post.category === 'Frontend' ? 'rgba(168, 85, 247, 0.2)' : (post.category === 'Backend' ? 'rgba(59, 130, 246, 0.2)' : (post.category === 'DevOps' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'))}`
            }}>
              {post.category || 'Général'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              <Clock size={14} /> {post.created_at_human || 'Récemment'}
            </div>
          </div>
          
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem', lineHeight: 1.3 }}>
            {post.title}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), var(--indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {post.user?.name ? post.user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'white' }}>{post.user?.name || 'Utilisateur inconnu'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--cyan)' }}>Membre de la communauté</div>
            </div>
          </div>
          
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {post.content}
          </div>
          
          {/* Post Vote Actions (Premium Redesign) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '16px', 
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '0.2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(5px)'
            }}>
              <button 
                onClick={(e) => handleVote(e, 'post', post.id, 1)} 
                disabled={isVoting}
                className="hover-scale"
                style={{ 
                  background: post.votes?.find(v => v.user_id === auth?.user?.id)?.type === 1 ? 'rgba(0, 217, 255, 0.15)' : 'transparent', 
                  color: post.votes?.find(v => v.user_id === auth?.user?.id)?.type === 1 ? 'var(--cyan)' : 'var(--text-dim)', 
                  border: 'none', 
                  padding: '0.6rem', 
                  borderRadius: '12px', 
                  cursor: isVoting ? 'not-allowed' : 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                }}
              >
                <ChevronUp size={20} strokeWidth={post.votes?.find(v => v.user_id === auth?.user?.id)?.type === 1 ? 3 : 2} />
              </button>
              
              <span style={{ 
                minWidth: '40px', 
                textAlign: 'center', 
                fontSize: '1.1rem', 
                fontWeight: 800, 
                color: post.votes_sum_type > 0 ? 'var(--cyan)' : (post.votes_sum_type < 0 ? '#ef4444' : 'white'),
                textShadow: post.votes_sum_type !== 0 ? '0 0 10px currentColor' : 'none'
              }}>
                {post.votes_sum_type || 0}
              </span>
              
              <button 
                onClick={(e) => handleVote(e, 'post', post.id, -1)} 
                disabled={isVoting}
                className="hover-scale"
                style={{ 
                  background: post.votes?.find(v => v.user_id === auth?.user?.id)?.type === -1 ? 'rgba(239, 68, 68, 0.15)' : 'transparent', 
                  color: post.votes?.find(v => v.user_id === auth?.user?.id)?.type === -1 ? '#ef4444' : 'var(--text-dim)', 
                  border: 'none', 
                  padding: '0.6rem', 
                  borderRadius: '12px', 
                  cursor: isVoting ? 'not-allowed' : 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                }}
              >
                <ChevronDown size={20} strokeWidth={post.votes?.find(v => v.user_id === auth?.user?.id)?.type === -1 ? 3 : 2} />
              </button>
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: 500 }}>
              {post.votes_sum_type >= 0 ? "Avez-vous trouvé cette discussion utile ?" : "Cette question semble peu claire."}
            </div>
          </div>
        </div>
        
        {/* Thread Info Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} color="var(--cyan)" />
            {post.comments ? post.comments.length : 0} Réponses
          </h3>
        </div>

        {/* Comments List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment.id} className="card-premium" style={{ padding: '1.5rem', border: comment.is_best_answer ? '2px solid var(--cyan)' : '1px solid rgba(255,255,255,0.05)', background: comment.is_best_answer ? 'linear-gradient(to bottom, rgba(0, 217, 255, 0.05), transparent)' : 'rgba(255,255,255,0.01)' }}>
                 {comment.is_best_answer && (
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--cyan)', color: '#0f172a', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1rem' }}>
                     <CheckCircle size={16} /> Meilleure Réponse
                   </div>
                 )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: 'white' }}>
                      {comment.user?.name ? comment.user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>{comment.user?.name || 'Utilisateur'}</div>
                    </div>
                  </div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {post.user_id === auth?.user?.id && !post.comments.some(c => c.is_best_answer) && (
                       <button onClick={() => handleBestAnswer(comment.id)} style={{ background: 'rgba(0, 217, 255, 0.1)', border: '1px solid rgba(0, 217, 255, 0.2)', color: 'var(--cyan)', padding: '0.3rem 0.6rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600, transition: '0.2s' }} className="hover:bg-cyan-500 hover:text-white">
                          <Award size={14} /> Marquer Résolu
                       </button>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={12} /> {comment.created_at_human || 'Récemment'}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  {/* Comment Votes Column (Premium Redesign) */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '0.2rem',
                    background: 'rgba(255,255,255,0.02)',
                    padding: '0.2rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    alignSelf: 'flex-start'
                  }}>
                    <button 
                      onClick={(e) => handleVote(e, 'comment', comment.id, 1)} 
                      disabled={isVoting}
                      className="hover-scale"
                      style={{ 
                        background: 'transparent', 
                        color: comment.votes?.find(v => v.user_id === auth?.user?.id)?.type === 1 ? 'var(--cyan)' : 'var(--text-dim)', 
                        border: 'none', 
                        cursor: isVoting ? 'not-allowed' : 'pointer', 
                        padding: '0.4rem',
                        transition: '0.2s'
                      }}
                    >
                      <ChevronUp size={22} strokeWidth={comment.votes?.find(v => v.user_id === auth?.user?.id)?.type === 1 ? 3 : 2} />
                    </button>
                    
                    <span style={{ 
                      fontSize: '0.95rem', 
                      fontWeight: 800, 
                      color: comment.votes_sum_type > 0 ? 'var(--cyan)' : (comment.votes_sum_type < 0 ? '#ef4444' : 'white'),
                      opacity: isVoting ? 0.5 : 1 
                    }}>
                      {comment.votes_sum_type || 0}
                    </span>
                    
                    <button 
                      onClick={(e) => handleVote(e, 'comment', comment.id, -1)} 
                      disabled={isVoting}
                      className="hover-scale"
                      style={{ 
                        background: 'transparent', 
                        color: comment.votes?.find(v => v.user_id === auth?.user?.id)?.type === -1 ? '#ef4444' : 'var(--text-dim)', 
                        border: 'none', 
                        cursor: isVoting ? 'not-allowed' : 'pointer', 
                        padding: '0.4rem',
                        transition: '0.2s'
                      }}
                    >
                      <ChevronDown size={22} strokeWidth={comment.votes?.find(v => v.user_id === auth?.user?.id)?.type === -1 ? 3 : 2} />
                    </button>
                  </div>
                  
                  {/* Comment Content */}
                  <div style={{ flex: 1, color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.6, whiteSpace: 'pre-line', marginTop: '0.2rem' }}>
                    {comment.content}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              Aucune réponse pour le moment. Soyez le premier à répondre !
            </div>
          )}
        </div>
        
        {/* Reply Form */}
        {auth.user ? (
          <div className="card-premium" style={{ border: '1px solid rgba(0, 217, 255, 0.3)', padding: '2rem' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Votre réponse</h4>
            <form onSubmit={handleSubmit}>
              <textarea
                value={data.content}
                onChange={(e) => setData('content', e.target.value)}
                placeholder="Tapez votre réponse ici..."
                className="u-input"
                style={{ width: '100%', minHeight: '120px', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', marginBottom: '1rem', resize: 'vertical' }}
                required
              />
              {errors.content && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.85rem' }}>{errors.content}</div>}
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={processing} className="btn-premium" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', cursor: processing ? 'not-allowed' : 'pointer' }}>
                  {processing ? 'Envoi...' : 'Publier la réponse'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(0, 217, 255, 0.05)', borderRadius: '16px', border: '1px solid rgba(0, 217, 255, 0.2)' }}>
            <p style={{ color: 'white', marginBottom: '1rem' }}>Connectez-vous pour participer à la discussion.</p>
            <Link href="/login" className="btn-premium" style={{ display: 'inline-block', padding: '0.6rem 1.5rem', borderRadius: '8px', textDecoration: 'none' }}>Connexion</Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
