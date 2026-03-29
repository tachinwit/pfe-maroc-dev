import React, { useState } from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Search, MapPin, Award, MessageSquare, UserPlus, UserCheck, Trophy, TrendingUp, Calendar, Globe } from 'lucide-react';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Toast from '../components/common/Toast';

const SKILLS_MAP = {
  'React': ['React', 'TypeScript', 'Redux', 'TailwindCSS'],
  'Backend': ['Node.js', 'Laravel', 'PostgreSQL', 'Docker'],
  'DevOps': ['Docker', 'Kubernetes', 'GitHub Actions', 'AWS'],
  'Full Stack': ['React', 'Node.js', 'MongoDB', 'REST API'],
  'Security': ['Pentesting', 'OWASP', 'Burp Suite', 'Python'],
};

const getSkills = (title) => {
  for (const key of Object.keys(SKILLS_MAP)) {
    if (title && title.toLowerCase().includes(key.toLowerCase())) return SKILLS_MAP[key];
  }
  return ['JavaScript', 'Git', 'REST API', 'Agile'];
};

const DevelopersPage = () => {
  const { developers, leaderboard, auth } = usePage().props;
  const [searchQuery, setSearchQuery] = useState('');
  const [followed, setFollowed] = useState({});
  const [toast, setToast] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [leaderboardType, setLeaderboardType] = useState('monthly');

  const devList = Array.isArray(developers) ? developers : [];

  const filteredDevs = devList
    .filter(dev => {
      const q = searchQuery.toLowerCase();
      return (
        dev.name?.toLowerCase().includes(q) ||
        (dev.title || dev.profession || '').toLowerCase().includes(q) ||
        (dev.location || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  const handleFollow = (id) => {
    setFollowed(f => ({ ...f, [id]: !f[id] }));
    setToast({
      message: followed[id] ? 'Désabonnement réussi' : 'Abonnement réussi !',
      points: followed[id] ? null : 5
    });
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'Expert':   return 'text-yellow-400 bg-yellow-400/10';
      case 'Avancé':   return 'text-purple-400 bg-purple-400/10';
      case 'Confirmé': return 'text-blue-400 bg-blue-400/10';
      case 'Débutant': return 'text-green-400 bg-green-400/10';
      default:         return 'text-gray-400 bg-gray-400/10';
    }
  };

  const currentLeaderboard = leaderboard?.[leaderboardType] || {};
  const currentUserRank = currentLeaderboard.current_user_rank;

  return (
    <div className="developers-page">
      <Head title="Communauté & Classement" />

      {/* ── Leaderboard Section ── */}
      <div className="leaderboard-section">
        <div className="leaderboard-header">
          <h2 className="leaderboard-title">
            <Trophy className="trophy-icon" size={28} />
            Classement des Développeurs
          </h2>
          <div className="leaderboard-tabs">
            <button
              className={`tab-button ${leaderboardType === 'monthly' ? 'active' : ''}`}
              onClick={() => setLeaderboardType('monthly')}
            >
              <Calendar size={16} /> Mensuel
            </button>
            <button
              className={`tab-button ${leaderboardType === 'global' ? 'active' : ''}`}
              onClick={() => setLeaderboardType('global')}
            >
              <Globe size={16} /> Global
            </button>
          </div>
        </div>

        {currentLeaderboard.top_three?.length > 0 && (
          <div className="leaderboard-podium">
            {currentLeaderboard.top_three.map((entry, index) => (
              <div key={entry.user.id} className={`podium-position position-${index + 1}`}>
                <div className="podium-avatar">
                  <div className="podium-avatar-placeholder">{entry.user.name[0]}</div>
                  <div className="medal-overlay">{entry.medal}</div>
                </div>
                <div className="podium-info">
                  <h4>{entry.user.name}</h4>
                  <span className={`level-badge ${getLevelColor(entry.level)}`}>{entry.level}</span>
                  <div className="podium-points">
                    {leaderboardType === 'monthly' ? (
                      <>
                        <span className="points-earned">+{entry.points_earned} pts</span>
                        <span className="total-points">{entry.total_points} total</span>
                      </>
                    ) : (
                      <span className="total-points">{entry.total_points} points</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="leaderboard-full">
          <div className="leaderboard-table-header">
            <span>Rang</span>
            <span>Développeur</span>
            <span>Niveau</span>
            <span>Points</span>
          </div>
          {currentLeaderboard.leaderboard?.map((entry) => (
            <div key={entry.user.id} className={`leaderboard-row ${currentUserRank === entry.rank ? 'current-user' : ''}`}>
              <div className="rank-cell">
                <span className="rank-number">#{entry.rank}</span>
                {entry.rank <= 3 && (
                  <span className="rank-medal">
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                  </span>
                )}
              </div>
              <div className="user-cell">
                <Link href={`/profile/${entry.user.id}`} className="user-link">
                  <div className="user-avatar-small avatar-placeholder">{entry.user.name[0]}</div>
                  <div className="user-info">
                    <span className="user-name">{entry.user.name}</span>
                    <span className="user-title">{entry.user.title || 'Développeur'}</span>
                  </div>
                </Link>
              </div>
              <div className="level-cell">
                <span className={`level-badge ${getLevelColor(entry.level)}`}>{entry.level}</span>
              </div>
              <div className="points-cell">
                {leaderboardType === 'monthly' ? (
                  <div className="points-breakdown">
                    <span className="points-earned">+{entry.points_earned}</span>
                    <span className="total-points">{entry.total_points} total</span>
                  </div>
                ) : (
                  <span className="total-points">{entry.total_points}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {auth?.user && currentUserRank && (
          <div className="user-rank-card">
            <div className="user-rank-header">
              <TrendingUp size={20} />
              <span>Votre position</span>
            </div>
            <div className="user-rank-info">
              <span className="user-rank-number">#{currentUserRank}</span>
              <span className="user-rank-label">
                {leaderboardType === 'monthly' ? 'ce mois-ci' : 'au classement global'}
              </span>
            </div>
          </div>
        )}

        {currentLeaderboard.stats && (
          <div className="leaderboard-stats">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <span className="stat-value">{currentLeaderboard.stats.total_participants}</span>
                <span className="stat-label">Participants</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <span className="stat-value">{currentLeaderboard.stats.total_points_awarded || currentLeaderboard.stats.total_points_all_time}</span>
                <span className="stat-label">{leaderboardType === 'monthly' ? 'Points distribués' : 'Points totaux'}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-value">{currentLeaderboard.stats.average_points}</span>
                <span className="stat-label">Moyenne</span>
              </div>
            </div>
          </div>
        )}

        {leaderboardType === 'monthly' && currentLeaderboard.current_month && (
          <div className="month-info">
            <Calendar size={16} />
            <span>Classement pour {currentLeaderboard.current_month.name}</span>
          </div>
        )}
      </div>



      <Toast toast={toast} onClose={() => setToast(null)}/>
    </div>
  );
};

DevelopersPage.layout = page => <MainLayout>{page}</MainLayout>;

export default DevelopersPage;