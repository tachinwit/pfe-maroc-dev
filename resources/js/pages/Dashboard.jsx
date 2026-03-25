import React from 'react';
import { LayoutDashboard, Users, MessageSquare, Briefcase, Calendar, Star, TrendingUp, Bell } from 'lucide-react';
import { Link, usePage, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';

/**
 * Dashboard - User's personal overview.
 * Displays personal stats, recent activity, and notifications.
 */
const Dashboard = () => {
  const { auth, stats, activities, notifications, discussionsCount, answersCount } = usePage().props;
  const user = auth?.user || { name: 'Utilisateur', points: 0, level: 'Novice' };

  const statCards = [
    { label: 'Mes Points',   value: user.points,   icon: <Star color="#CCFF00" /> },
    { label: 'Discussions',  value: discussionsCount || 0, icon: <MessageSquare color="#00D9FF" />, link: '/messages' },
    { label: 'Réponses',     value: answersCount || 0, icon: <TrendingUp color="#8B5CF6" />, link: '/my-answers' },
    { label: 'Classement',   value: user.level || 'Novice',     icon: <Users color="#FF6B35" /> },
  ];

  return (
    <div className="container-center" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Head title="Mon Dashboard" />
      
      {/* Header */}
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title" style={{ textAlign: 'left', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Bonjour, <span className="gradient-text">{user.name}</span> 👋
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Voici ce qui s'est passé depuis votre dernière visite.</p>
        </div>
        <div>
          <Link href="/my-profile" className="btn-outline" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 600 }}>Voir mon profil</Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid-features" style={{ marginTop: '0', marginBottom: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {statCards.map((stat, i) => {
          const content = (
          <div key={i} className={`card-premium ${stat.link ? 'hover-bright' : ''}`} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: stat.link ? 'pointer' : 'default', transition: '0.2s', height: '100%' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '16px' }}>
                {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '0.3rem', fontWeight: 600 }}>{stat.label}</div>
            </div>
          </div>
          );

          return stat.link ? (
            <Link key={i} href={stat.link} style={{textDecoration: 'none', display: 'block'}}>{content}</Link>
          ) : content;
        })}
      </div>

      {/* Main Content Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Activity Column (Takes 2 columns space on wide screens) */}
        <div style={{ gridColumn: '1 / -1' }} className="activity-wrapper">
          <section className="card-premium">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Activité Récente</h2>
              <Link href="/forum" style={{ color: 'var(--cyan)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>Tout voir</Link>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activities?.length > 0 ? (
                activities.map(act => (
                  <Link href={act.link} key={act.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none', color: 'inherit' }} className="hover-bright">
                     <div style={{ color: 'var(--indigo)' }}>
                        {act.type === 'post' ? <MessageSquare size={20}/> : <TrendingUp size={20}/>}
                     </div>
                     <div>
                       <p style={{ fontWeight: 500, marginBottom: '0.2rem' }}>{act.content}</p>
                       <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{act.time}</span>
                     </div>
                  </Link>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    <MessageSquare size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>Aucune activité récente.</p>
                    <Link href="/forum" className="btn-premium" style={{ marginTop: '1.5rem', padding: '0.8rem 1.5rem', fontSize: '0.9rem' }}>Participer au forum</Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      
      <style>{`
        @media (min-width: 992px) {
            .activity-wrapper { grid-column: span 2 !important; }
        }
      `}</style>
      
      {/* Bottom section matching 2/3 / 1/3 layout conceptually */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
         <section className="card-premium">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Notifications</h2>
               <Bell size={18} color="var(--text-dim)"/>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifications?.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <p style={{ fontSize: '0.95rem', marginBottom: '0.3rem' }}>{n.text}</p>
                      <span style={{ fontSize: '0.8rem', color: 'var(--cyan)' }}>{n.time}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Pas de nouvelles notifications.</p>
                )}
             </div>
          </section>

          <section className="card-premium" style={{ background: 'linear-gradient(135deg, rgba(0,217,255,0.1), rgba(75,0,130,0.1))', borderColor: 'var(--cyan)' }}>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Projets DevMaroc</h3>
             <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Rejoignez un projet open-source et gagnez des points communautaires !</p>
             <Link href="/events" className="btn-premium" style={{ width: '100%', display: 'block' }}>Découvrir les projets</Link>
          </section>
      </div>

    </div>
  );
};

Dashboard.layout = page => <MainLayout>{page}</MainLayout>;

export default Dashboard;

