import React, { useState, useEffect } from 'react';
import { Link, usePage, Head, router } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Search, MapPin, Award, MessageSquare, UserPlus, UserCheck, Filter, X, Sliders, ChevronDown } from 'lucide-react';
import SkeletonLoader from '../Components/common/SkeletonLoader';
import Toast from '../Components/common/Toast';
import { SKILLS_LIST, ALL_SKILLS } from '../Constants/skills';

  const DevelopersPage = () => {
  const { auth, developers } = usePage().props;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSkill, setActiveSkill] = useState('Tous');
  const [toast, setToast] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [filterConfig, setFilterConfig] = useState({
    minPoints: 0,
    topN: 0, // 0 means all
    sortBy: 'desc',
    minLevel: 'Tous'
  });

  const levels = ['Tous', 'Novice', 'Débutant', 'Confirmé', 'Avancé', 'Expert'];

  const followingIds = auth?.following_ids || [];
  const devList = Array.isArray(developers) ? developers : [];

  // Categorized skills for filtering
  const skillCategories = ['Tous', ...Object.keys(SKILLS_LIST)];
  const [activeCategory, setActiveCategory] = useState('Tous');
  
  const skillsToDisplay = activeCategory === 'Tous' 
    ? ['Tous', 'JavaScript', 'Python', 'React', 'Laravel', 'PHP', 'Docker', 'AI / ML'] 
    : ['Tous', ...SKILLS_LIST[activeCategory]];

  const filteredDevs = devList
    .filter(dev => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = dev.name?.toLowerCase().includes(q) ||
        (dev.title || '').toLowerCase().includes(q) ||
        (dev.location || '').toLowerCase().includes(q);
      
      const matchesSkill = activeSkill === 'Tous' || (dev.skills && dev.skills.includes(activeSkill));
      const matchesPoints = (dev.points || 0) >= filterConfig.minPoints;
      const matchesLevel = filterConfig.minLevel === 'Tous' || (dev.level === filterConfig.minLevel);

      return matchesSearch && matchesSkill && matchesPoints && matchesLevel;
    })
    .sort((a, b) => {
      const order = filterConfig.sortBy === 'desc' ? -1 : 1;
      return ((a.points || 0) - (b.points || 0)) * order;
    });

  const finalDevs = filterConfig.topN > 0 ? filteredDevs.slice(0, filterConfig.topN) : filteredDevs;

  const handleFollow = (id) => {
    if (!auth?.user) {
      window.location.href = '/login';
      return;
    }
    router.post(`/user/${id}/follow`, {}, {
      preserveScroll: true,
      onSuccess: (page) => {
        if (page.props.flash?.success) {
          setToast({ message: page.props.flash.success, points: null });
        } else if (page.props.flash?.info) {
          setToast({ message: page.props.flash.info, points: null });
        } else if (page.props.flash?.message) {
          setToast({ message: page.props.flash.message, points: null });
        }
      }
    });
  };

  return (
    <div className="container-center fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '1200px' }}>
      <Head title="Découvrir la Communauté" />

      {/* Hero Section */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Découvrez la <span className="gradient-text">Communauté</span>
        </h1>
        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '2rem' }}>
          Cherchez des développeurs par nom, rôle ou ville pour collaborer sur vos prochains projets.
        </p>
        
        {/* Search Bar */}
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <Search size={22} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input 
            type="text" 
            placeholder="Rechercher (ex: React, Casablanca...)" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '1.2rem 1.2rem 1.2rem 3.5rem', 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '20px', 
              color: 'white', 
              fontSize: '1.05rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              marginBottom: '1.5rem'
            }}
          />
        </div>

        {/* Skill Category Tabs */}
        <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem', justifyContent: 'center', scrollbarWidth: 'none' }}>
          {skillCategories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setActiveSkill('Tous'); }}
              style={{
                background: activeCategory === cat ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeCategory === cat ? 'white' : 'var(--text-dim)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Specific Skills Filter */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1000px', margin: '0 auto', marginBottom: '2rem' }}>
          {skillsToDisplay.map(skill => (
            <button
              key={skill}
              onClick={() => setActiveSkill(skill)}
              style={{
                background: activeSkill === skill ? 'rgba(0, 217, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                color: activeSkill === skill ? 'var(--cyan)' : 'var(--text-dim)',
                border: `1px solid ${activeSkill === skill ? 'var(--cyan)' : 'rgba(255,255,255,0.1)'}`,
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {skill}
            </button>
          ))}
          
          <button
            onClick={() => setIsFilterModalOpen(true)}
            style={{
              background: filterConfig.minPoints > 0 || filterConfig.topN > 0 || filterConfig.minLevel !== 'Tous' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.03)',
              color: filterConfig.minPoints > 0 || filterConfig.topN > 0 || filterConfig.minLevel !== 'Tous' ? '#A78BFA' : 'var(--text-dim)',
              border: `1px solid ${filterConfig.minPoints > 0 || filterConfig.topN > 0 || filterConfig.minLevel !== 'Tous' ? '#A78BFA' : 'rgba(255,255,255,0.1)'}`,
              padding: '0.4rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Sliders size={14} /> Filtres Avancés
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid-features" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {devList.length === 0 ? (
          Array.from({length:6}).map((_,i) => <SkeletonLoader key={i} type="card" count={1}/>)
        ) : finalDevs.length === 0 ? (
           <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
             <Search size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-dim)', opacity: 0.5 }} />
             <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Aucun développeur trouvé</h3>
             <p style={{ color: 'var(--text-dim)' }}>Essayez de modifier vos critères de recherche.</p>
           </div>
        ) : (
          finalDevs.slice(0, visibleCount).map(dev => (
            <Link key={dev.id} href={`/user/${dev.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-premium hover-scale" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                
                {/* Header Profile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), var(--indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 }}>
                    {dev.name ? dev.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.2rem' }}>{dev.name}</h3>
                    <p style={{ color: 'var(--cyan)', fontSize: '0.9rem', fontWeight: 600 }}>{dev.title || dev.profession || 'Développeur'}</p>
                  </div>
                </div>
                
                {/* Meta */}
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-dim)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14}/> {dev.location || 'Maroc'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#CCFF00' }}><Award size={14}/> {dev.points || 0} pts</span>
                </div>

                {/* Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(dev.skills || ['Nouveau']).slice(0, 4).map(skill => (
                    <span key={skill} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {skill}
                    </span>
                  ))}
                  {dev.skills && dev.skills.length > 4 && (
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', alignSelf: 'center' }}>+{dev.skills.length - 4}</span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button
                    className="btn-outline"
                    style={{ padding: '0.6rem', fontSize: '0.9rem', background: followingIds.includes(dev.id) ? 'rgba(0, 217, 255, 0.1)' : 'transparent', color: followingIds.includes(dev.id) ? 'var(--cyan)' : 'inherit', borderColor: followingIds.includes(dev.id) ? 'var(--cyan)' : 'rgba(255,255,255,0.2)' }}
                    onClick={e => { e.preventDefault(); e.stopPropagation(); handleFollow(dev.id); }}
                  >
                    {followingIds.includes(dev.id) ? 'Suivi' : 'Suivre'}
                  </button>
                  <button
                    className="btn-premium"
                    style={{ padding: '0.6rem', fontSize: '0.9rem' }}
                    onClick={e => { e.preventDefault(); e.stopPropagation(); window.location.href = `/messages?user_id=${dev.id}`; }}
                  >
                    Contacter
                  </button>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {finalDevs.length > visibleCount && (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn-outline" onClick={() => setVisibleCount(v => v+6)} style={{ padding: '0.8rem 2rem', borderRadius: '30px' }}>
            Afficher plus de développeurs
          </button>
        </div>
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card-premium fade-in" style={{ maxWidth: '450px', width: '100%', padding: '2rem', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={() => setIsFilterModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
              <X size={24} />
            </button>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Filtrer par <span className="gradient-text">Classement</span></h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', fontSize: '0.9rem' }}>Affinez la liste des développeurs selon leurs performances.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {/* Level Filter */}
               <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.8rem', color: 'var(--text-main)' }}>Filtrer par Niveau (Rang)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {levels.map(level => (
                    <button 
                      key={level}
                      onClick={() => setFilterConfig({...filterConfig, minLevel: level})}
                      style={{
                        padding: '0.5rem 0.8rem',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: filterConfig.minLevel === level ? 'var(--cyan)' : 'rgba(255,255,255,0.1)',
                        background: filterConfig.minLevel === level ? 'rgba(0, 217, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                        color: filterConfig.minLevel === level ? 'white' : 'var(--text-dim)',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Points */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.8rem', color: 'var(--text-main)' }}>Seuil de Points Minimum</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <input 
                    type="range" 
                    min="0" 
                    max="5000" 
                    step="100"
                    value={filterConfig.minPoints}
                    onChange={e => setFilterConfig({...filterConfig, minPoints: parseInt(e.target.value)})}
                    style={{ flex: 1, accentColor: 'var(--cyan)' }}
                   />
                   <span style={{ minWidth: '60px', padding: '0.4rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'center', fontWeight: 700, color: 'var(--cyan)' }}>
                    {filterConfig.minPoints}
                   </span>
                </div>
              </div>

               <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.8rem', color: 'var(--text-main)' }}>Sélection du Classement</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {[0, 3, 10, 50].map(val => (
                    <button 
                      key={val}
                      onClick={() => setFilterConfig({...filterConfig, topN: val})}
                      style={{
                        padding: '0.6rem',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: filterConfig.topN === val ? 'var(--cyan)' : 'rgba(255,255,255,0.1)',
                        background: filterConfig.topN === val ? 'rgba(0, 217, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                        color: filterConfig.topN === val ? 'white' : 'var(--text-dim)',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      {val === 0 ? 'Tous' : `Top ${val}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.8rem', color: 'var(--text-main)' }}>Ordre des Points</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <button 
                    onClick={() => setFilterConfig({...filterConfig, sortBy: 'desc'})}
                    style={{
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: filterConfig.sortBy === 'desc' ? 'var(--cyan)' : 'rgba(255,255,255,0.1)',
                      background: filterConfig.sortBy === 'desc' ? 'rgba(0, 217, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                      color: filterConfig.sortBy === 'desc' ? 'white' : 'var(--text-dim)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      transition: '0.2s'
                    }}
                  >
                    <ChevronDown size={18} /> Décroissant
                  </button>
                  <button 
                    onClick={() => setFilterConfig({...filterConfig, sortBy: 'asc'})}
                    style={{
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: filterConfig.sortBy === 'asc' ? 'var(--cyan)' : 'rgba(255,255,255,0.1)',
                      background: filterConfig.sortBy === 'asc' ? 'rgba(0, 217, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                      color: filterConfig.sortBy === 'asc' ? 'white' : 'var(--text-dim)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      transition: '0.2s'
                    }}
                  >
                    <ChevronDown size={18} style={{ transform: 'rotate(180deg)' }} /> Croissant
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  onClick={() => setFilterConfig({ minPoints: 0, topN: 0, sortBy: 'desc' })}
                  className="btn-outline"
                  style={{ padding: '0.8rem' }}
                >
                  Réinitialiser
                </button>
                <button 
                  onClick={() => setIsFilterModalOpen(false)}
                  className="btn-premium"
                  style={{ padding: '0.8rem' }}
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)}/>
    </div>
  );
};

DevelopersPage.layout = page => <MainLayout>{page}</MainLayout>;

export default DevelopersPage;
