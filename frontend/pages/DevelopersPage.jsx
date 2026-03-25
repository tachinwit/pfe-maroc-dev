import React, { useState, useEffect } from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Search, MapPin, Award, MessageSquare, UserPlus, UserCheck } from 'lucide-react';
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

/**
 * DevelopersPage - Community directory.
 * Allows searching and filtering developers.
 */
const DevelopersPage = () => {
  const { developers } = usePage().props;
  const [searchQuery, setSearchQuery] = useState('');
  const [followed, setFollowed] = useState({});
  const [toast, setToast] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

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

  return (
    <div className="developers-page">
      <Head title="Découvrir la Communauté" />

      <div className="search-hero">
        <h1>Découvrez la Communauté</h1>
        <p>Cherchez des développeurs par nom, titre ou ville.</p>
        <div className="search-bar-wrap">
          <Search className="search-icon-fixed" size={24}/>
          <input 
            className="search-input" 
            type="text" 
            placeholder="Rechercher (ex: React, Casablanca...)" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="dev-grid">
        {devList.length === 0 ? (
          Array.from({length:6}).map((_,i) => <SkeletonLoader key={i} type="card" count={1}/>)
        ) : filteredDevs.length === 0 ? (
          <div className="empty-state">
            <p className="empty-emoji">🔍</p>
            <p>Aucun développeur trouvé.</p>
          </div>
        ) : (
          filteredDevs.slice(0, visibleCount).map(dev => (
            <div key={dev.id} className="dev-card-wrapper">
              <Link href={"/profile/" + dev.id} className="dev-card">
                <div className="card-top-content">
                  <div className="avatar-box">
                    <img src={"https://i.pravatar.cc/150?u=" + dev.id} alt={dev.name} />
                  </div>
                  <div className="dev-main-info">
                    <h3>{dev.name}</h3>
                    <p className="dev-job">{dev.title || dev.profession || 'Développeur'}</p>
                    <div className="dev-meta-tags">
                      <span className="meta-tag"><MapPin size={12}/> {dev.location || 'Maroc'}</span>
                      <span className="meta-tag points"><Award size={12}/> {dev.points || 0} pts</span>
                    </div>
                  </div>
                </div>
                
                <div className="dev-skills-row">
                  {getSkills(dev.title || dev.profession).slice(0,3).map(skill => (
                    <span key={skill} className="skill-pill">{skill}</span>
                  ))}
                </div>

                <div className="card-actions-row" onClick={e => e.preventDefault()}>
                  <button
                    className={"btn-action" + (followed[dev.id] ? " active" : "")}
                    onClick={e => { e.preventDefault(); e.stopPropagation(); handleFollow(dev.id); }}
                  >
                    {followed[dev.id] ? <><UserCheck size={16}/> Suivi</> : <><UserPlus size={16}/> Suivre</>}
                  </button>
                  <Link
                    href={"/messages?user_id=" + dev.id}
                    className="btn-action chat"
                    onClick={e => { e.stopPropagation(); }}
                  >
                    <MessageSquare size={16}/> Contacter
                  </Link>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      {filteredDevs.length > visibleCount && (
        <div className="load-more-container">
          <button className="btn-load-more" onClick={() => setVisibleCount(v => v+6)}>
            Afficher plus de développeurs
          </button>
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)}/>
    </div>
  );
};

DevelopersPage.layout = page => <MainLayout>{page}</MainLayout>;

export default DevelopersPage;
