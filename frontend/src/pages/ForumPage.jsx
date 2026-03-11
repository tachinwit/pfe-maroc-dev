import React, { useState } from 'react';
import { 
  Search, Filter, TrendingUp, Clock, CheckCircle, MessageSquare,
  ThumbsUp, ThumbsDown, Award, Bookmark, Share2, MoreVertical,
  Plus, Tag, Users, Eye, ChevronDown, AlertCircle
} from 'lucide-react';

const ForumPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const categories = [
    { id: 'all', name: 'Tous', count: 1247, icon: '🔥' },
    { id: 'react', name: 'React', count: 342, icon: '⚛️' },
    { id: 'laravel', name: 'Laravel', count: 278, icon: '🔴' },
    { id: 'nodejs', name: 'Node.js', count: 195, icon: '💚' },
    { id: 'python', name: 'Python', count: 167, icon: '🐍' },
    { id: 'database', name: 'Databases', count: 134, icon: '🗄️' },
    { id: 'devops', name: 'DevOps', count: 89, icon: '🚀' },
    { id: 'mobile', name: 'Mobile', count: 76, icon: '📱' }
  ];

  const questions = [
    {
      id: 1,
      title: "Comment gérer l'authentification JWT avec Laravel et React ?",
      author: {
        name: "Youssef Bennani",
        avatar: "https://i.pravatar.cc/40?img=12",
        reputation: 3420
      },
      content: "Je cherche la meilleure approche pour implémenter un système d'authentification sécurisé avec JWT. Comment gérer le refresh token et le stockage côté client ?",
      tags: ["Laravel", "React", "JWT", "Sécurité"],
      votes: 45,
      answers: 12,
      views: 1234,
      solved: true,
      createdAt: "2h ago",
      trending: true
    },
    {
      id: 2,
      title: "Optimisation des performances React avec useMemo et useCallback",
      author: {
        name: "Fatima Zahra",
        avatar: "https://i.pravatar.cc/40?img=45",
        reputation: 2890
      },
      content: "Mon application React devient lente avec de grandes listes. Quand utiliser useMemo vs useCallback ? Des conseils pour l'optimisation ?",
      tags: ["React", "Performance", "Hooks"],
      votes: 38,
      answers: 8,
      views: 987,
      solved: false,
      createdAt: "5h ago",
      trending: true
    },
    {
      id: 3,
      title: "Architecture microservices avec Node.js et Docker",
      author: {
        name: "Ahmed Tazi",
        avatar: "https://i.pravatar.cc/40?img=33",
        reputation: 4120
      },
      content: "Je veux migrer mon monolithe vers une architecture microservices. Quelle est la meilleure approche avec Node.js ? Comment gérer la communication entre services ?",
      tags: ["Node.js", "Docker", "Microservices", "Architecture"],
      votes: 52,
      answers: 15,
      views: 2145,
      solved: true,
      createdAt: "1d ago",
      trending: false
    },
    {
      id: 4,
      title: "Gestion d'état complexe avec Redux vs Context API",
      author: {
        name: "Karim Idrissi",
        avatar: "https://i.pravatar.cc/40?img=68",
        reputation: 1890
      },
      content: "Pour une grande application, vaut-il mieux utiliser Redux ou Context API ? Quels sont les avantages et inconvénients de chaque approche ?",
      tags: ["React", "Redux", "State Management"],
      votes: 29,
      answers: 6,
      views: 756,
      solved: false,
      createdAt: "3h ago",
      trending: true
    },
    {
      id: 5,
      title: "Configuration CI/CD avec GitLab pour projet Laravel",
      author: {
        name: "Salma Amrani",
        avatar: "https://i.pravatar.cc/40?img=25",
        reputation: 3650
      },
      content: "Je cherche à automatiser le déploiement de mon projet Laravel. Quelle configuration GitLab CI recommandez-vous ? Tests automatiques, déploiement staging/prod...",
      tags: ["Laravel", "GitLab", "CI/CD", "DevOps"],
      votes: 41,
      answers: 9,
      views: 1432,
      solved: false,
      createdAt: "8h ago",
      trending: false
    }
  ];

  const topContributors = [
    { name: "Hassan El Mourabit", reputation: 12450, answers: 342, badge: "🏆" },
    { name: "Nadia Benali", reputation: 10230, answers: 289, badge: "🥈" },
    { name: "Omar Chakir", reputation: 9870, answers: 256, badge: "🥉" },
    { name: "Zineb Alami", reputation: 8540, answers: 234, badge: "⭐" }
  ];

  return (
    <div className="forum-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Fira+Code:wght@400;600&display=swap');

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
          --success: #10B981;
          --warning: #F59E0B;
        }

        body {
          font-family: 'Manrope', sans-serif;
          background: var(--midnight);
          color: #ffffff;
        }

        .forum-page {
          min-height: 100vh;
          background: 
            radial-gradient(circle at 15% 30%, rgba(75, 0, 130, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 85% 70%, rgba(0, 217, 255, 0.08) 0%, transparent 50%);
        }

        /* Header */
        .forum-header {
          background: linear-gradient(135deg, rgba(75, 0, 130, 0.3), rgba(15, 32, 39, 0.9));
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(30px);
          padding: 2.5rem 0;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .forum-title {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff, var(--cyan));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ask-btn {
          padding: 0.9rem 2rem;
          background: linear-gradient(135deg, var(--indigo), #6B0FA6);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(75, 0, 130, 0.4);
        }

        .ask-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(75, 0, 130, 0.6);
        }

        /* Search Bar */
        .search-section {
          display: flex;
          gap: 1rem;
        }

        .search-container {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 1.1rem 1.5rem 1.1rem 3.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          color: #ffffff;
          font-size: 1rem;
          font-family: 'Manrope', sans-serif;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--cyan);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 30px rgba(0, 217, 255, 0.2);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .filter-btn {
          padding: 1.1rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-family: 'Manrope', sans-serif;
        }

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--cyan);
        }

        /* Categories */
        .categories-bar {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem 0;
        }

        .categories-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .categories-content::-webkit-scrollbar {
          display: none;
        }

        .category-chip {
          padding: 0.7rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .category-chip.active {
          background: linear-gradient(135deg, var(--indigo), #6B0FA6);
          border-color: transparent;
          color: #ffffff;
          box-shadow: 0 4px 20px rgba(75, 0, 130, 0.4);
        }

        .category-chip:hover:not(.active) {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--cyan);
        }

        .category-count {
          padding: 0.2rem 0.6rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        /* Main Content */
        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2rem;
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 3rem;
        }

        /* Sort Bar */
        .sort-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }

        .sort-info {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.95rem;
        }

        .sort-info strong {
          color: var(--cyan);
          font-weight: 700;
        }

        .sort-options {
          display: flex;
          gap: 0.5rem;
        }

        .sort-btn {
          padding: 0.6rem 1.2rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Manrope', sans-serif;
        }

        .sort-btn.active {
          background: rgba(0, 217, 255, 0.15);
          border-color: var(--cyan);
          color: var(--cyan);
        }

        .sort-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.05);
        }

        /* Questions List */
        .questions-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .question-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .question-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, var(--cyan), var(--indigo));
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }

        .question-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(0, 217, 255, 0.3);
          transform: translateX(8px);
        }

        .question-card:hover::before {
          transform: scaleY(1);
        }

        .question-card.trending {
          border-color: rgba(255, 215, 0, 0.3);
        }

        .trending-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.4rem 0.9rem;
          background: linear-gradient(135deg, #F59E0B, #EF4444);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .question-header {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .vote-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .vote-btn {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .vote-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--cyan);
          color: var(--cyan);
          transform: scale(1.1);
        }

        .vote-count {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--cyan);
        }

        .question-content {
          flex: 1;
        }

        .question-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .question-title:hover {
          color: var(--cyan);
        }

        .question-text {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .question-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tag {
          padding: 0.4rem 0.9rem;
          background: rgba(75, 0, 130, 0.2);
          border: 1px solid rgba(75, 0, 130, 0.4);
          border-radius: 20px;
          color: var(--lime);
          font-size: 0.8rem;
          font-weight: 600;
          font-family: 'Fira Code', monospace;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .tag:hover {
          background: rgba(75, 0, 130, 0.3);
          border-color: var(--lime);
          transform: translateY(-2px);
        }

        .question-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .question-meta {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
        }

        .meta-item svg {
          width: 18px;
          height: 18px;
        }

        .meta-item.solved {
          color: var(--success);
          font-weight: 600;
        }

        .question-author {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .author-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 2px solid var(--cyan);
        }

        .author-info {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-weight: 600;
          color: #ffffff;
          font-size: 0.9rem;
        }

        .author-reputation {
          font-size: 0.8rem;
          color: var(--cyan);
          font-weight: 700;
        }

        /* Sidebar */
        .sidebar {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .sidebar-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .sidebar-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sidebar-title svg {
          color: var(--cyan);
        }

        /* Top Contributors */
        .contributor-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .contributor-item:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(5px);
        }

        .contributor-badge {
          font-size: 1.5rem;
        }

        .contributor-info {
          flex: 1;
        }

        .contributor-name {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.25rem;
          font-size: 0.95rem;
        }

        .contributor-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .contributor-stat {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .contributor-stat strong {
          color: var(--cyan);
        }

        /* Stats Cards */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .stat-card {
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(75, 0, 130, 0.2), rgba(0, 217, 255, 0.1));
          border-radius: 12px;
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--cyan), var(--lime));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .header-top {
            flex-direction: column;
            gap: 1.5rem;
            align-items: stretch;
          }

          .search-section {
            flex-direction: column;
          }

          .question-header {
            flex-direction: column;
          }

          .vote-section {
            flex-direction: row;
          }

          .sort-bar {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .sort-options {
            justify-content: space-between;
          }
        }
      `}</style>

      {/* Header */}
      <div className="forum-header">
        <div className="header-content">
          <div className="header-top">
            <h1 className="forum-title">Forum & Q/A</h1>
            <button className="ask-btn">
              <Plus size={20} />
              Poser une Question
            </button>
          </div>
          
          <div className="search-section">
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher des questions, tags, sujets..." 
                className="search-input"
              />
            </div>
            <button className="filter-btn">
              <Filter size={20} />
              Filtres
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="categories-bar">
        <div className="categories-content">
          {categories.map(cat => (
            <div
              key={cat.id}
              className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="category-count">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div>
          {/* Sort Bar */}
          <div className="sort-bar">
            <div className="sort-info">
              <strong>1,247</strong> questions trouvées
            </div>
            <div className="sort-options">
              <button 
                className={`sort-btn ${sortBy === 'recent' ? 'active' : ''}`}
                onClick={() => setSortBy('recent')}
              >
                <Clock size={14} />
                Récent
              </button>
              <button 
                className={`sort-btn ${sortBy === 'trending' ? 'active' : ''}`}
                onClick={() => setSortBy('trending')}
              >
                <TrendingUp size={14} />
                Trending
              </button>
              <button 
                className={`sort-btn ${sortBy === 'unanswered' ? 'active' : ''}`}
                onClick={() => setSortBy('unanswered')}
              >
                <AlertCircle size={14} />
                Non résolues
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div className="questions-list">
            {questions.map(question => (
              <div key={question.id} className={`question-card ${question.trending ? 'trending' : ''}`}>
                {question.trending && (
                  <div className="trending-badge">
                    <TrendingUp size={14} />
                    Trending
                  </div>
                )}
                
                <div className="question-header">
                  <div className="vote-section">
                    <button className="vote-btn">
                      <ThumbsUp size={18} />
                    </button>
                    <div className="vote-count">{question.votes}</div>
                    <button className="vote-btn">
                      <ThumbsDown size={18} />
                    </button>
                  </div>

                  <div className="question-content">
                    <h3 className="question-title">{question.title}</h3>
                    <p className="question-text">{question.content}</p>
                    
                    <div className="question-tags">
                      {question.tags.map((tag, idx) => (
                        <span key={idx} className="tag">{tag}</span>
                      ))}
                    </div>

                    <div className="question-footer">
                      <div className="question-meta">
                        <div className={`meta-item ${question.solved ? 'solved' : ''}`}>
                          {question.solved ? <CheckCircle size={18} /> : <MessageSquare size={18} />}
                          <span>{question.answers} réponses</span>
                        </div>
                        <div className="meta-item">
                          <Eye size={18} />
                          <span>{question.views} vues</span>
                        </div>
                        <div className="meta-item">
                          <Clock size={18} />
                          <span>{question.createdAt}</span>
                        </div>
                      </div>

                      <div className="question-author">
                        <img 
                          src={question.author.avatar} 
                          alt={question.author.name}
                          className="author-avatar"
                        />
                        <div className="author-info">
                          <div className="author-name">{question.author.name}</div>
                          <div className="author-reputation">{question.author.reputation} pts</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Top Contributors */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">
              <Award size={20} />
              Top Contributors
            </h3>
            {topContributors.map((contributor, idx) => (
              <div key={idx} className="contributor-item">
                <div className="contributor-badge">{contributor.badge}</div>
                <div className="contributor-info">
                  <div className="contributor-name">{contributor.name}</div>
                  <div className="contributor-stats">
                    <div className="contributor-stat">
                      <strong>{contributor.reputation}</strong> pts
                    </div>
                    <div className="contributor-stat">
                      <strong>{contributor.answers}</strong> réponses
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">
              <TrendingUp size={20} />
              Statistiques
            </h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">1,247</div>
                <div className="stat-label">Questions</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">4,382</div>
                <div className="stat-label">Réponses</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">892</div>
                <div className="stat-label">Participants Actifs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
