import React, { createContext, useContext, useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
  Home, Users, MessageSquare, Calendar, Sparkles, 
  Menu, X, LayoutDashboard, LogOut, User, Bell 
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
  const [notifications] = useState([
    { id: 1, text: 'Bienvenue sur DevMaroc ! 🚀', time: '1m' },
    { id: 2, text: 'Mohamed a répondu à votre post.', time: '5m' }
  ]);

  const isGuest = !auth?.user;

  const logout = () => {
    router.post('/logout');
  };

  const links = [
    { href: '/',            icon: <Home size={18} />,        label: 'Accueil' },
    { href: '/developers',  icon: <Users size={18} />,       label: 'Développeurs' },
    { href: '/forum',       icon: <MessageSquare size={18}/>, label: 'Forum' },
    { href: '/events',      icon: <Calendar size={18} />,    label: 'Événements' },
  ];

  if (!isGuest) {
    links.splice(1, 0, { href: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' });
    links.splice(3, 0, { href: '/profile', icon: <User size={18} />, label: 'Profil' });
    links.push({ href: '/ai-assistant', icon: <Sparkles size={18} />, label: 'Assistant IA' });
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <nav className="navbar">
          <div className="nav-container">
            <Link href="/" className="logo">DevMaroc</Link>
            
            <div className="nav-links">
              {links.map(l => (
                <Link key={l.href} href={l.href} className="nav-link">
                  {l.icon}{l.label}
                </Link>
              ))}
            </div>

            <div className="nav-actions">
              {!isGuest ? (
                <>
                  <Link href="/messages" className="nav-link"><MessageSquare size={20} /></Link>
                  <button 
                    className="nav-link" 
                    style={{background:'none', border:'none', position:'relative'}} 
                    onClick={() => setShowNotifs(!showNotifs)}
                  >
                    <Bell size={20} />
                    {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
                  </button>
                  <span className="points-badge">⭐ {auth?.user?.points ?? 0} pts</span>
                  <button className="btn-logout" onClick={logout}><LogOut size={16} /> Déconnexion</button>
                </>
              ) : (
                <>
                  <Link href="/login" style={{color:'#fff', textDecoration:'none', fontWeight:600, fontSize:'0.9rem'}}>Se Connecter</Link>
                  <Link href="/register" style={{padding:'0.5rem 1.2rem', background:'linear-gradient(135deg,#00D9FF,#4B0082)', borderRadius:'8px', color:'#fff', textDecoration:'none', fontWeight:700, fontSize:'0.9rem'}}>S'inscrire</Link>
                </>
              )}
              <button className="mobile-btn" onClick={() => setOpen(true)}><Menu size={24}/></button>
            </div>
          </div>
        </nav>

        <main>{children}</main>

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
           </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
