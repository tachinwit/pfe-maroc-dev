import React, { useState } from 'react';
import { Search, PlusCircle, Clock, User, ChevronRight } from 'lucide-react';
import { Link, usePage, useForm, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Toast from '../components/common/Toast';

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
    post('/forum', {
      onSuccess: () => {
        setShowNewPostModal(false);
        reset();
        setToast({ message: 'Question publiée avec succès !', points: 10 });
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
    <div className="forum-page">
      <Head title="Forum Communauté" />
      
      <div className="forum-container">
        {/* New Post Modal */}
        {showNewPostModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Nouveau Poste</h2>
                <button className="close-btn" onClick={() => setShowNewPostModal(false)}>&times;</button>
              </div>
              <form onSubmit={handlePostSubmit}>
                <div className="form-grid">
                  <input 
                    className="u-input" 
                    placeholder="Titre de votre question" 
                    value={data.title} 
                    onChange={e => setData('title', e.target.value)} 
                    required 
                  />
                  <div className="form-row">
                    <select className="u-input" value={data.category} onChange={e => setData('category', e.target.value)}>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Security">Sécurité</option>
                    </select>
                    <input className="u-input" placeholder="Tags (React, Node...)" value={data.tags} onChange={e => setData('tags', e.target.value)} />
                  </div>
                  <textarea 
                    className="u-input" 
                    style={{minHeight:'120px'}} 
                    placeholder="Détails de votre question..." 
                    value={data.content} 
                    onChange={e => setData('content', e.target.value)} 
                    required 
                  />
                  <div className="form-actions">
                    <button type="submit" className="btn-new-thread" disabled={processing}>
                      {processing ? 'Publication...' : 'Publier'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="forum-header">
          <div className="header-title">
            <h1>Forum Communauté</h1>
            <p>Échangez avec les meilleurs développeurs du Maroc.</p>
          </div>
          <button className="btn-new-thread" onClick={() => setShowNewPostModal(true)}>
            <PlusCircle size={20}/> Nouveau Poste
          </button>
        </div>

        <div className="forum-nav-bar">
          <div className="nav-chips">
            {categories.map(cat => (
              <button 
                key={cat.id} 
                className={"nav-chip" + (activeCategory===cat.id ? " active" : "")} 
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <input 
            type="text" 
            className="forum-search-input" 
            placeholder="Rechercher..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
        </div>

        <div className="thread-list">
          {filtered.length === 0 ? (
            <div className="empty-state">Aucun post trouvé.</div>
          ) : (
            filtered.map(thread => (
              <div key={thread.id} className="thread-card">
                <div className="thread-main">
                  <span className="thread-category-label">{thread.category}</span>
                  <h3 className="thread-title-text">{thread.title}</h3>
                  <div className="thread-meta-info">
                    <span><User size={14} /> {thread.user?.name || 'Anonyme'}</span>
                    <span><Clock size={14} /> {thread.created_at_human || 'Récemment'}</span>
                  </div>
                </div>
                <div className="thread-stats-box">
                  <div className="stat-unit">
                    <span className="stat-value">{thread.replies_count || 0}</span>
                    <span className="stat-label">Réponses</span>
                  </div>
                  <ChevronRight size={20} className="arrow-icon" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)}/>
    </div>
  );
};

ForumPage.layout = page => <MainLayout>{page}</MainLayout>;

export default ForumPage;
