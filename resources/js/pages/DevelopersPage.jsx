import React, { useState, useEffect } from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Search, MapPin, Award, MessageSquare, UserPlus, UserCheck, Trophy, Crown, Medal, TrendingUp, Calendar, Globe, X, ChevronUp, ArrowUpDown } from 'lucide-react';
import SkeletonLoader from '../Components/common/SkeletonLoader';
import Toast from '../Components/common/Toast';

/**
 * DevelopersPage - Community directory with integrated leaderboard.
 * Allows searching and filtering developers, and viewing leaderboards.
 */
const DevelopersPage = () => {
  const { developers, leaderboard, auth } = usePage().props;
  const [searchQuery, setSearchQuery] = useState('');
  const [followed, setFollowed] = useState({});
  const [toast, setToast] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [leaderboardType, setLeaderboardType] = useState('monthly'); // 'monthly' or 'global'
  const [selectedMonth, setSelectedMonth] = useState('2026-03'); // Format: YYYY-MM
  const [sortBy, setSortBy] = useState('points'); // 'points', 'name', 'newest'
  const [showBackToTop, setShowBackToTop] = useState(false);

  const devList = Array.isArray(developers) ? developers : [];

  const filteredDevs = devList
    .filter(dev => {
      const q = searchQuery.toLowerCase();
      const skills = getSkills(dev.title || dev.profession || '').join(' ').toLowerCase();
      const level = (dev.level || '').toLowerCase();
      return (
        dev.name?.toLowerCase().includes(q) ||
        (dev.title || dev.profession || '').toLowerCase().includes(q) ||
        (dev.location || '').toLowerCase().includes(q) ||
        skills.includes(q) ||
        level.includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'points') return (b.points || 0) - (a.points || 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'newest') return (b.id || 0) - (a.id || 0);
      return 0;
    });

  const visibleDevs = filteredDevs.slice(0, visibleCount);
  const hasMore = filteredDevs.length > visibleCount;

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    setShowBackToTop(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFollow = (id) => {
    setFollowed(f => ({ ...f, [id]: !f[id] }));
    setToast({
      message: followed[id] ? 'Désabonnement réussi' : 'Abonnement réussi !',
      points: null
    });
  };

  function getSkills(title) {
    const skillsMap = {
      'Frontend Developer': ['React', 'JavaScript', 'CSS'],
      'Backend Developer': ['Node.js', 'Python', 'SQL'],
      'Full Stack Developer': ['React', 'Node.js', 'MongoDB'],
      'Mobile Developer': ['React Native', 'Flutter', 'iOS'],
      'Data Scientist': ['Python', 'Machine Learning', 'Pandas'],
      'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS'],
      'UI/UX Designer': ['Figma', 'Adobe XD', 'Sketch'],
      'Product Manager': ['Agile', 'Scrum', 'Analytics'],
      'Développeur': ['JavaScript', 'Git', 'REST API']
    };
    return skillsMap[title] || ['JavaScript', 'Git', 'REST API'];
  }

  const getLevelColor = (level) => {
    switch(level) {
      case 'Expert': return 'text-yellow-400 bg-yellow-400/10';
      case 'Avancé': return 'text-purple-400 bg-purple-400/10';
      case 'Confirmé': return 'text-blue-400 bg-blue-400/10';
      case 'Débutant': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const currentLeaderboard = leaderboard?.[leaderboardType] || {};
  const currentUserRank = currentLeaderboard.current_user_rank;

  return (
    <MainLayout>
      <div className="developers-page">
        <Head title="Communauté & Classement" />

        {/* Section Leaderboard Simplifiée */}
        <div className="leaderboard-section-simple">
          <div className="leaderboard-header-simple">
            <h2 className="leaderboard-title-simple">
              <Trophy className="trophy-icon" size={24} />
              Classement des Développeurs
            </h2>

            {/* Onglets Leaderboard */}
            <div className="leaderboard-tabs-simple">
              <button
                className={`tab-button-simple ${leaderboardType === 'monthly' ? 'active' : ''}`}
                onClick={() => setLeaderboardType('monthly')}
              >
                <Calendar size={14} />
                Mensuel
              </button>
              <button
                className={`tab-button-simple ${leaderboardType === 'global' ? 'active' : ''}`}
                onClick={() => setLeaderboardType('global')}
              >
                <Globe size={14} />
                Global
              </button>
            </div>
          </div>

          {/* Podium Textuel */}
          {currentLeaderboard.top_three && currentLeaderboard.top_three.length > 0 && (
            <div className="leaderboard-podium-simple">
              {currentLeaderboard.top_three.map((entry, index) => (
                <div key={entry.user.id} className={`podium-position-simple position-${index + 1}`}>
                  <div className={`medal-large podium-rank-${index + 1}`}>{entry.rank === 1 ? <Crown size={24} /> : <Medal size={24} />}</div>
                  <div className="podium-info-simple">
                    <h4 className="podium-name">{entry.user.name}</h4>
                    <span className={`level-badge-simple ${getLevelColor(entry.level)}`}>
                      {entry.level}
                    </span>
                    <div className="podium-points-simple">
                      {leaderboardType === 'monthly' ? (
                        <>
                          <span className="points-earned-simple">+{entry.points_earned} pts</span>
                          <span className="total-points-simple">{entry.total_points} total</span>
                        </>
                      ) : (
                        <span className="total-points-simple">{entry.total_points} points</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Classement Simplifié */}
          <div className="leaderboard-table-simple">
            {currentLeaderboard.leaderboard && currentLeaderboard.leaderboard.slice(0, 10).map((entry) => (
              <div key={entry.user.id} className={`leaderboard-row-simple ${currentUserRank === entry.rank ? 'current-user-simple' : ''}`}>
                <div className="rank-cell-simple">
                  <span className="rank-number-simple">#{entry.rank}</span>
                  {entry.rank <= 3 && <span className={`rank-medal-simple rank-${entry.rank}`}>
                    {entry.rank === 1 ? <Crown size={16} /> : <Medal size={16} />}
                  </span>}
                </div>

                <div className="user-cell-simple">
                  <div className="user-info-simple">
                    <span className="user-name-simple">{entry.user.name}</span>
                    <span className="user-title-simple">{entry.user.title || 'Développeur'}</span>
                  </div>
                </div>

                <div className="level-cell-simple">
                  <span className={`level-badge-simple ${getLevelColor(entry.level)}`}>
                    {entry.level}
                  </span>
                </div>

                <div className="points-cell-simple">
                  {leaderboardType === 'monthly' ? (
                    <div className="points-breakdown-simple">
                      <span className="points-earned-simple">+{entry.points_earned}</span>
                      <span className="total-points-simple">{entry.total_points}</span>
                    </div>
                  ) : (
                    <span className="total-points-simple">{entry.total_points}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Position personnelle */}
          {auth?.user && currentUserRank && (
            <div className="user-rank-card-simple">
              <div className="user-rank-header-simple">
                <TrendingUp size={18} />
                <span>Votre position : #{currentUserRank}</span>
              </div>
            </div>
          )}

          {/* Informations du mois (pour leaderboard mensuel) */}
          {leaderboardType === 'monthly' && currentLeaderboard.current_month && (
            <div className="month-info-simple">
              <Calendar size={14} />
              <span>Classement pour {currentLeaderboard.current_month.name}</span>
            </div>
          )}
        </div>



        {/* Section Recherche */}
        <div className="search-section">
          <div className="search-hero">
            <h2 className="search-title">Découvrez la Communauté</h2>
            <p className="search-subtitle">Cherchez des développeurs par nom, compétences, niveau ou ville.</p>
            <div className="search-bar-wrap">
              <Search className="search-icon-fixed" size={24} />
              <input
                className="search-input"
                type="text"
                placeholder="Rechercher un profil (ex: React, Expert, Casablanca...)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filtres actifs et Tri */}
          <div className="filters-toolbar">
            <div className="active-filters">
              {searchQuery && (
                <div className="filter-chip">
                  <Search size={14} />
                  <span>{searchQuery}</span>
                  <X size={14} onClick={() => setSearchQuery('')} />
                </div>
              )}
            </div>

            <div className="sort-control">
              <ArrowUpDown size={16} />
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="points">Trier par points</option>
                <option value="name">Trier par nom</option>
                <option value="newest">Nouveaux d'abord</option>
              </select>
            </div>
          </div>

          {/* Résumé des résultats */}
          <div className="results-summary">
            {filteredDevs.length > 0 ? (
              <span>{filteredDevs.length} développeur{filteredDevs.length > 1 ? 's' : ''} trouvé{filteredDevs.length > 1 ? 's' : ''}</span>
            ) : (
              <span className="no-results">Aucun développeur ne correspond à votre recherche</span>
            )}
          </div>
        </div>

        {/* Grille des Développeurs */}
        {filteredDevs.length > 0 ? (
          <>
            <div className="dev-grid">
              {visibleDevs.map(dev => (
                <div key={dev.id} className="dev-card">
                  <div className="dev-avatar">
                    <div className="avatar-placeholder">
                      {dev.name?.charAt(0).toUpperCase() || 'D'}
                    </div>
                    <div className="status-badge online">●</div>
                  </div>

                  <div className="dev-info">
                    <h3 className="dev-name">{dev.name}</h3>
                    <p className="dev-title">{dev.title || dev.profession || 'Développeur'}</p>
                    <div className="dev-location">
                      <MapPin size={14} />
                      <span>{dev.location || 'Non spécifié'}</span>
                    </div>

                    <div className="dev-skills">
                      {getSkills(dev.title || dev.profession || '').slice(0, 3).map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>

                    <div className="dev-level">
                      <span className={`level-badge ${getLevelColor(dev.level || 'Débutant')}`}>
                        {dev.level || 'Débutant'}
                      </span>
                    </div>

                    <div className="dev-points">
                      <Award size={14} />
                      <span>{dev.points || 0} points</span>
                    </div>
                  </div>

                  <div className="dev-actions">
                    <button
                      className={`action-btn follow-btn ${followed[dev.id] ? 'followed' : ''}`}
                      onClick={() => handleFollow(dev.id)}
                    >
                      {followed[dev.id] ? <UserCheck size={16} /> : <UserPlus size={16} />}
                      {followed[dev.id] ? 'Suivi' : 'Suivre'}
                    </button>

                    <a href={`/messages?user_id=${dev.id}`} className="action-btn message-btn">
                      <MessageSquare size={16} />
                      Message
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="load-more-container">
                <button 
                  className="load-more-btn"
                  onClick={() => setVisibleCount(v => v + 12)}
                >
                  Charger plus de développeurs
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">Aucun résultat</h3>
            <p className="empty-message">Essayez une autre recherche ou consultez tous les développeurs</p>
            <button 
              className="empty-action-btn"
              onClick={() => setSearchQuery('')}
            >
              Afficher tous les développeurs
            </button>
          </div>
        )}

        {/* Back to Top Button */}
        {showBackToTop && (
          <button 
            className="back-to-top-btn"
            onClick={scrollToTop}
            title="Retour en haut"
          >
            <ChevronUp size={20} />
          </button>
        )}

        <Toast toast={toast} onClose={() => setToast(null)}/>
      </div>
    </MainLayout>
  );
};

export default DevelopersPage;