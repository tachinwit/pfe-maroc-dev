import React, { useState } from 'react';
import { Mail, MapPin, Briefcase, Github, Twitter, Linkedin, Star, Award, MessageSquare, ChevronRight, Settings } from 'lucide-react';
import { Link, usePage, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';

/**
 * ProfilePage - Displays user profile information and credentials.
 * Handles both own profile view and other developers' profiles.
 */
const ProfilePage = () => {
  const { auth, profile: propProfile } = usePage().props;
  const profile = propProfile || auth?.user || {
    name: "Utilisateur",
    title: "Software Engineer",
    location: "Casablanca, Maroc",
    bio: "Passionné par le développement web et les nouvelles technologies.",
    points: 1250,
    rank: "Expert",
    skills: ["React", "Laravel", "PostgreSQL", "TailwindCSS"],
  };

  const isOwner = auth?.user?.id === profile.id;

  const socialLinks = [
    { icon: <Github size={20}/>,  href: '#' },
    { icon: <Twitter size={20}/>, href: '#' },
    { icon: <Linkedin size={20}/>, href: '#' },
  ];

  const badges = [
    { name: 'Top Contributor', color: '#00D9FF' },
    { name: 'Inertia Expert',  color: '#8B5CF6' },
    { name: 'Open Source',     color: '#CCFF00' },
  ];

  return (
    <div className="profile-page">
      <Head title={`${profile.name} - Profil DevMaroc`} />
      
      <div className="profile-container">
        <header className="profile-header">
          <div className="avatar-wrapper">
             <div className="avatar-container">
               {profile.name[0].toUpperCase()}
             </div>
             {isOwner && <div className="online-indicator" />}
          </div>
          
          <div className="profile-info-header">
            <div className="name-row">
              <h1>{profile.name}</h1>
              {isOwner && <button className="settings-btn"><Settings size={20}/></button>}
            </div>
            <p className="profile-tagline">{profile.title || 'Développeur'}</p>
            <div className="profile-meta-row">
               <span><MapPin size={16}/> {profile.location || 'Maroc'}</span>
               <span><Award size={16}/> {profile.rank || 'Membre'}</span>
               <span><Star size={16}/> {profile.points || 0} pts</span>
            </div>
            <div className="social-row">
               {socialLinks.map((s, i) => (
                 <a key={i} href={s.href} className="social-link">{s.icon}</a>
               ))}
               {!isOwner && (
                 <Link href={`/messages?user_id=${profile.id}`} className="btn btn-primary-sm">
                   <MessageSquare size={16}/> Contacter
                 </Link>
               )}
            </div>
          </div>
        </header>

        <div className="profile-grid">
           {/* Sidebar: Bio & Skills */}
           <div className="profile-sidebar">
              <section className="profile-section">
                <h3>Bio</h3>
                <p>{profile.bio || "Aucune biographie disponible."}</p>
              </section>

              <section className="profile-section">
                <h3>Compétences</h3>
                <div className="skills-wrap">
                  {(profile.skills || []).map(skill => (
                    <span key={skill} className="skill-badge">{skill}</span>
                  ))}
                </div>
              </section>

              <section className="profile-section">
                <h3>Badges</h3>
                <div className="badges-list">
                   {badges.map(b => (
                     <div key={b.name} className="badge-item" style={{borderColor: b.color, color: b.color}}>
                       {b.name}
                     </div>
                   ))}
                </div>
              </section>
           </div>

           {/* Main: Contributions */}
           <div className="profile-main">
              <section className="profile-section">
                <div className="section-header">
                  <h3>Contributions Récentes</h3>
                  <Link href="/forum" className="view-more">Tout voir <ChevronRight size={16}/></Link>
                </div>
                <div className="contribution-list">
                   <div className="contribution-card">
                      <h4>Comment optimiser Inertia.js avec Laravel ?</h4>
                      <p>Posté dans <strong>Backend</strong> • Il y a 2 jours</p>
                      <div className="card-stats">
                        <span>12 réponses</span>
                        <span>45 vues</span>
                      </div>
                   </div>
                   <div className="contribution-card">
                      <h4>Best practices pour TailwindCSS 4.0</h4>
                      <p>Posté dans <strong>Frontend</strong> • Il y a 5 jours</p>
                      <div className="card-stats">
                        <span>8 réponses</span>
                        <span>23 vues</span>
                      </div>
                   </div>
                </div>
              </section>

              <section className="profile-section">
                <h3>Statistiques Globales</h3>
                <div className="stats-mini-grid">
                   <div className="stat-mini-card">
                      <span>Projets</span>
                      <strong>12</strong>
                   </div>
                   <div className="stat-mini-card">
                      <span>Collaborations</span>
                      <strong>4</strong>
                   </div>
                   <div className="stat-mini-card">
                      <span>Questions</span>
                      <strong>32</strong>
                   </div>
                   <div className="stat-mini-card">
                      <span>Réponses</span>
                      <strong>87</strong>
                   </div>
                </div>
              </section>
           </div>
        </div>
      </div>
    </div>
  );
};

ProfilePage.layout = page => <MainLayout>{page}</MainLayout>;

export default ProfilePage;
