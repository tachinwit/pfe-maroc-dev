import React, { createContext, useContext, useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
  Home, Users, MessageSquare, Calendar, Sparkles, 
  Menu, X, LayoutDashboard, LogOut, User, Bell, ChevronDown, Settings 
} from 'lucide-react';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleLang = () => setLang(prev => prev === 'fr' ? 'ar' : 'fr');

  return (
    <ThemeContext.Provider value={{ theme: 'dark', lang, toggleLang }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * MainLayout - Centralized layout for the DevMaroc application.
 * Provides navigation, theme, and shared UI elements.
 */
export default function MainLayout({ children }) {
  const { auth } = usePage().props;
  const [open, setOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifications = auth?.notifications || [];
  const unreadCount = auth?.unread_notifications_count || 0;

  const isGuest = !auth?.user;

  const logout = () => {
    router.post('/logout');
  };

  // Simplified and consolidated links
  const links = [
    { href: '/',            icon: <Home size={18} />,        label: 'Accueil' },
    { href: '/forum',       icon: <MessageSquare size={18}/>, label: 'Communauté' },
    { href: '/events',      icon: <Calendar size={18} />,    label: 'Événements' },
    { href: '/developers',  icon: <Users size={18} />,       label: 'Développeurs' },
  ];

  if (!isGuest) {
    links.splice(1, 0, { href: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' });
    // Profil and AI are in actions or secondary menu
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen" style={{ background: 'var(--midnight)', color: 'var(--text-main)' }}>
        <nav className="navbar">
          <div className="nav-container container-center">
            <Link href="/" className="logo">DevMaroc</Link>
            
            <div className="nav-links">
              {links.map(l => (
                <Link key={l.href} href={l.href} className="nav-link">
                  {l.icon}<span>{l.label}</span>
                </Link>
              ))}
            </div>

            <div className="nav-actions">
              {!isGuest ? (
                <>
                  <Link href="/ai" title="Assistant IA" className="nav-link"><Sparkles size={20} /></Link>
                  <div style={{ position: 'relative' }}>
                    <button 
                      className="nav-link" 
                      style={{background:'none', border:'none', position:'relative', cursor: 'pointer'}} 
                      onClick={() => {
                        const nextState = !showNotifs;
                        setShowNotifs(nextState);
                        if (nextState && unreadCount > 0) {
                          router.post('/notifications/read-all', {}, { preserveScroll: true, preserveState: true });
                        }
                      }}
                    >
                      <Bell size={20} />
                      {unreadCount > 0 && <span className="notif-badge" style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, boxShadow: '0 0 0 2px #0f172a', zIndex: 10 }}>{unreadCount}</span>}
                    </button>

                    {showNotifs && (
                      <>
                        <div className="dropdown-overlay" onClick={() => setShowNotifs(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
                        <div className="card-premium dropdown-menu fade-up animate-in" style={{ position: 'absolute', top: 'calc(100% + 15px)', right: 0, zIndex: 100, width: '320px', padding: '0', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', border: '1px solid rgba(0, 217, 255, 0.2)', background: '#0f172a', borderRadius: '12px', overflow: 'hidden' }}>
                          <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Notifications</h3>
                            {unreadCount > 0 && (
                              <span style={{ fontSize: '0.8rem', color: 'var(--cyan)' }}>{unreadCount} nouvelle(s)</span>
                            )}
                          </div>
                          <div style={{ maxHeight: '350px', overflowY: 'auto' }} className="hide-scroll">
                            {notifications.length === 0 ? (
                              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                                <Bell size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
                                <p>Aucune notification</p>
                              </div>
                            ) : (
                              notifications.map(notif => {
                                const isUnread = notif.read_at === null;
                                return (
                                <div key={notif.id} style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem', transition: '0.2s', background: isUnread ? 'rgba(0, 217, 255, 0.05)' : 'transparent' }} className="hover:bg-opacity-10">
                                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), var(--indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, color: 'white' }}>
                                    {notif.data.user_name ? notif.data.user_name[0].toUpperCase() : 'U'}
                                  </div>
                                  <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '0.3rem', lineHeight: 1.3, color: isUnread ? 'white' : 'var(--text-dim)' }}>{notif.data.message}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Link href={notif.data.link} className="hover-bright" style={{ fontSize: '0.8rem', color: 'var(--cyan)', textDecoration: 'none' }} onClick={() => setShowNotifs(false)}>Voir</Link>
                                    </div>
                                  </div>
                                </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <span className="points-badge">{auth?.user?.points ?? 0} pts</span>
                  
                  <div style={{ position:'relative' }}>
                     <button 
                       className={`profile-dropdown-btn ${showProfileMenu ? 'active' : ''}`}
                       onClick={() => setShowProfileMenu(!showProfileMenu)}
                       style={{ display: 'flex', alignItems: 'center', gap: '10px', background: showProfileMenu ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)', padding: '6px 14px 6px 6px', borderRadius: '30px', border: `1px solid ${showProfileMenu ? 'var(--cyan)' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', color: 'white', transition: 'all 0.3s' }}
                     >
                       <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), var(--indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 0 10px rgba(0,217,255,0.3)' }}>
                         {auth?.user?.name ? auth.user.name[0].toUpperCase() : 'U'}
                       </div>
                       <span style={{ fontSize: '0.9rem', fontWeight: 600 }} className="sm-show">{auth?.user?.name?.split(' ')[0] || 'User'}</span>
                       <ChevronDown size={14} style={{ color: showProfileMenu ? 'var(--cyan)' : 'var(--text-dim)', transform: showProfileMenu ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                     </button>

                     {showProfileMenu && (
                       <>
                         <div className="dropdown-overlay" onClick={() => setShowProfileMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
                         <div className="card-premium dropdown-menu fade-up animate-in" style={{ position: 'absolute', top: 'calc(100% + 15px)', right: 0, zIndex: 100, minWidth: '260px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', border: '1px solid rgba(0, 217, 255, 0.2)', background: '#0f172a' }}>
                           
                           {/* Dropdown Header */}
                           <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                             <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), var(--indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.2rem', flexShrink: 0 }}>
                               {auth?.user?.name ? auth.user.name[0].toUpperCase() : 'U'}
                             </div>
                             <div style={{ overflow: 'hidden' }}>
                               <div style={{ fontSize: '1rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{auth?.user?.name || 'Utilisateur'}</div>
                               <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{auth?.user?.email || 'email@example.com'}</div>
                             </div>
                           </div>

                           <Link href="/my-profile" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                             <div className="dropdown-icon-bg"><User size={16} /></div> Mon Profil
                           </Link>
                           <Link href="/dashboard" className="dropdown-item sm-hide" onClick={() => setShowProfileMenu(false)}>
                             <div className="dropdown-icon-bg"><LayoutDashboard size={16} /></div> Dashboard
                           </Link>
                           <Link href="/settings" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                             <div className="dropdown-icon-bg"><Settings size={16} /></div> Paramètres
                           </Link>
                           <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0.5rem 0' }}/>
                           <button onClick={logout} className="dropdown-item text-danger" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
                             <div className="dropdown-icon-bg danger-bg"><LogOut size={16} color="#ff4d4d" /></div> Déconnexion
                           </button>
                         </div>
                       </>
                     )}
                  </div>
                </>
              ) : (
                <div style={{ display:'flex', gap:'1.5rem', alignItems:'center' }}>
                  <Link href="/login" style={{color:'rgba(255,255,255,0.7)', textDecoration:'none', fontWeight:600, fontSize:'0.9rem', transition:'0.3s'}} className="hover-bright">Connexion</Link>
                  <Link href="/register" className="btn-premium" style={{ padding:'0.6rem 1.5rem', fontSize:'0.85rem' }}>Rejoindre</Link>
                </div>
              )}
              <button className="mobile-btn" style={{ marginLeft:'1rem' }} onClick={() => setOpen(true)}><Menu size={24}/></button>
            </div>
          </div>
        </nav>

        <main className="container-center" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          {children}
        </main>

        <footer className="footer container-center" style={{ borderTop:'1px solid var(--border)', padding:'4rem 2rem', textAlign:'center' }}>
            <div className="logo" style={{ marginBottom:'1rem', display:'block' }}>DevMaroc</div>
            <p style={{ color:'var(--text-dim)', fontSize:'0.9rem' }}>© 2025 DevMaroc - La première communauté tech au Maroc.</p>
        </footer>

        {/* Mobile Menu Overlay */}
        <div className={`overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)}/>
        <div className={`mobile-menu ${open ? 'open' : ''}`}>
           <div style={{display:'flex', justifyContent:'space-between', marginBottom:'2rem'}}>
              <span className="logo">DevMaroc</span>
              <X onClick={() => setOpen(false)} style={{cursor:'pointer'}}/>
           </div>
           <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
              {links.map(l => (
                  <Link key={l.href} href={l.href} className="nav-link" style={{fontSize:'1.1rem'}} onClick={() => setOpen(false)}>
                    {l.icon}{l.label}
                  </Link>
              ))}
              {!isGuest && (
                <>
                  <Link href="/my-profile" className="nav-link" style={{fontSize:'1.1rem'}} onClick={() => setOpen(false)}><User size={18}/> Mon Profil</Link>
                  <Link href="/settings" className="nav-link" style={{fontSize:'1.1rem'}} onClick={() => setOpen(false)}><Settings size={18}/> Paramètres</Link>
                  <Link href="/ai" className="nav-link" style={{fontSize:'1.1rem'}} onClick={() => setOpen(false)}><Sparkles size={18}/> Assistant IA</Link>
                  <button onClick={() => {logout(); setOpen(false);}} className="nav-link" style={{fontSize:'1.1rem', background:'none', border:'none', color:'#ef4444', textAlign:'left', padding:'0.8rem 1rem'}}><LogOut size={18}/> Déconnexion</button>
                </>
              )}
           </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
