import React from 'react';
import { LayoutDashboard, Users, MessageSquare, Briefcase, Calendar, Star, TrendingUp, Bell } from 'lucide-react';
import { Link, usePage, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';

/**
 * Dashboard - User's personal overview.
 * Displays personal stats, recent activity, and notifications.
 */
const Dashboard = () => {
  const { auth, stats, activities, notifications } = usePage().props;
  const user = auth?.user || { name: 'Utilisateur', points: 0, rank: 'Débutant' };

  const statCards = [
    { label: 'Mes Points',   value: user.points,   icon: <Star color="#CCFF00" /> },
    { label: 'Discussions',  value: stats?.posts || 0, icon: <MessageSquare color="#00D9FF" /> },
    { label: 'Réponses',     value: stats?.replies || 0, icon: <TrendingUp color="#8B5CF6" /> },
    { label: 'Classement',   value: user.rank,     icon: <Users color="#FF6B35" /> },
  ];

  return (
    <div className="dashboard-page">
      <Head title="Mon Dashboard" />
      
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="welcome-section">
            <h1>Bonjour, {user.name} ! 👋</h1>
            <p>Ravi de vous revoir. Voici ce qui s'est passé depuis votre dernière visite.</p>
          </div>
          <div className="header-actions">
            <Link href="/profile" className="btn btn-outline">Voir mon profil</Link>
          </div>
        </header>

        <div className="stats-grid-dashboard">
          {statCards.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon-box">{stat.icon}</div>
              <div className="stat-info-box">
                <span className="stat-label-text">{stat.label}</span>
                <span className="stat-value-text">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-main-columns">
          {/* Main Activity Column */}
          <div className="activity-column">
            <section className="dashboard-section">
              <div className="section-header">
                <h2>Activité Récente</h2>
                <Link href="/forum" className="view-all">Tout voir</Link>
              </div>
              <div className="activity-list">
                {activities?.length > 0 ? (
                  activities.map(act => (
                    <div key={act.id} className="activity-item">
                       <div className="activity-type-icon">{act.type === 'post' ? <MessageSquare size={16}/> : <TrendingUp size={16}/>}</div>
                       <div className="activity-content-text">
                         <p><strong>{act.content}</strong></p>
                         <span>{act.time}</span>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state-dashboard">Aucune activité récente.</div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Info Column */}
          <div className="sidebar-column">
            <section className="dashboard-section">
               <div className="section-header">
                 <h2>Notifications</h2>
                 <Bell size={18} className="icon-dim"/>
               </div>
               <div className="notif-list-dashboard">
                  {notifications?.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className="notif-item-dashboard">
                        <p>{n.text}</p>
                        <span>{n.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state-dashboard">Pas de nouvelles notifications.</div>
                  )}
               </div>
            </section>

            <section className="dashboard-section promo-card">
               <h3>Projets DevMaroc</h3>
               <p>Rejoignez un projet open-source et gagnez des points communautaires !</p>
               <button className="btn btn-primary-sm">Découvrir les projets</button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.layout = page => <MainLayout>{page}</MainLayout>;

export default Dashboard;
