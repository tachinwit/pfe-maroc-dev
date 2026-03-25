import React, { useState } from 'react';
import { Search, PlusCircle, Clock, User, ChevronRight, MessageSquare } from 'lucide-react';
import { Link, usePage, useForm, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import SkeletonLoader from '../Components/common/SkeletonLoader';
import Toast from '../Components/common/Toast';

/**
 * ForumPage - Community discussion area.
 * Displays a list of threads and allows creating new ones.
 */
const ForumPage = () => {
  const { auth, posts } = usePage().props;
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [toast, setToast] = useState(null);

  const { data, setData, post, processing, reset } = useForm({
    title: '',
    category: 'Frontend',
    content: '',
    tags: '',
  });

  const categories = [
    { id: 'All', label: 'Tout' },
    { id: 'Frontend', label: 'Frontend' },
    { id: 'Backend', label: 'Backend' },
    { id: 'DevOps', label: 'DevOps' },
    { id: 'Security', label: 'Sécurité' },
  ];

  const handlePostSubmit = (e) => {
    e.preventDefault();
    post('/forum/posts', {
      onSuccess: (page) => {
        setShowNewPostModal(false);
        reset();
        if (page.props.flash?.success) {
            setToast({ message: page.props.flash.success, points: page.props.flash.points || '+10 pts' });
        } else {
            setToast({ message: 'Question publiée avec succès !', points: '+10 pts' });
        }
      },
      onError: () => {
        setToast({ message: 'Erreur lors de la publication.', points: null });
      }
    });
  };

  const threadList = Array.isArray(posts) ? posts : (posts?.data || []);

  const filtered = threadList.filter(t => {
    const q = searchQuery.toLowerCase();
    const titleMatch = t.title?.toLowerCase().includes(q);
    const categoryMatch = activeCategory === 'All' || t.category === activeCategory;
    return titleMatch && categoryMatch;
  });

  return (
    <div className="container-center" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '1000px' }}>
      <Head title="Forum Communauté" />
      
      {/* New Post Modal */}
      {showNewPostModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '1rem' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '600px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Nouveau Poste</h2>
              <button 
                onClick={() => setShowNewPostModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '1.5rem', cursor: 'pointer', padding: '0.2rem' }}
              >&times;</button>
            </div>
            <form onSubmit={handlePostSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                className="u-input" 
                placeholder="Titre de votre question" 
                value={data.title} 
                onChange={e => setData('title', e.target.value)} 
                required 
                style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <select 
                  value={data.category} 
                  onChange={e => setData('category', e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                >
                  <option value="Frontend" style={{ color: 'black' }}>Frontend</option>
                  <option value="Backend" style={{ color: 'black' }}>Backend</option>
                  <option value="DevOps" style={{ color: 'black' }}>DevOps</option>
                  <option value="Security" style={{ color: 'black' }}>Sécurité</option>
                </select>
                <input 
                  placeholder="Tags (React, Node...)" 
                  value={data.tags} 
                  onChange={e => setData('tags', e.target.value)} 
                  style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                />
              </div>
              <textarea 
                placeholder="Détails de votre question..." 
                value={data.content} 
                onChange={e => setData('content', e.target.value)} 
                required 
                style={{ width: '100%', padding: '0.8rem 1rem', minHeight: '150px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowNewPostModal(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '8px', marginRight: '1rem', cursor: 'pointer', fontWeight: 600 }}>Annuler</button>
                <button type="submit" className="btn-premium" disabled={processing} style={{ padding: '0.8rem 2rem', border: 'none' }}>
                  {processing ? 'Publication...' : 'Publier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Forum <span className="gradient-text">Communauté</span>
        </h1>
        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Échangez avec les meilleurs développeurs du Maroc. Posez vos questions, aidez les autres et gagnez des points.
        </p>
      </div>

      {/* Actions & Filters Navbar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
           <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="hide-scroll">
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ 
                    background: activeCategory === cat.id ? 'rgba(0, 217, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: activeCategory === cat.id ? 'var(--cyan)' : 'var(--text-dim)',
                    border: `1px solid ${activeCategory === cat.id ? 'var(--cyan)' : 'rgba(255,255,255,0.1)'}`,
                    padding: '0.5rem 1.2rem',
                    borderRadius: '20px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.label}
                </button>
              ))}
           </div>
           <button className="btn-premium" onClick={() => setShowNewPostModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}>
              <PlusCircle size={18}/> Nouveau Poste
           </button>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input 
            type="text" 
            placeholder="Rechercher une discussion..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1rem' }}
          />
        </div>
      </div>

      {/* Thread List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.length === 0 ? (
          <div className="card-premium" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
             <MessageSquare size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-dim)', opacity: 0.5 }} />
             <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Aucun post trouvé</h3>
             <p style={{ color: 'var(--text-dim)' }}>Soyez le premier à lancer une discussion sur ce sujet !</p>
          </div>
        ) : (
          filtered.map(thread => (
            <Link key={thread.id} href={`/forum/${thread.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className="card-premium" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s, border-color 0.2s', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--indigo)', background: 'rgba(139, 92, 246, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', marginBottom: '0.8rem' }}>
                    {thread.category}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.8rem', lineHeight: 1.4 }}>
                    {thread.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={14} /> {thread.user?.name || 'Anonyme'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> {thread.created_at_human || 'Récemment'}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', paddingLeft: '1.5rem', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{thread.votes_sum_type || 0}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Votes</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--cyan)' }}>{thread.comments_count || 0}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Réponses</div>
                  </div>
                  <ChevronRight size={24} style={{ color: 'var(--text-dim)' }} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)}/>
    </div>
  );
};

ForumPage.layout = page => <MainLayout>{page}</MainLayout>;

export default ForumPage;

