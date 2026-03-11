import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Users, MessageSquare, Code, Calendar, Sparkles, Menu, X } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import ForumPage from './pages/ForumPage';
import AIAssistantPage from './pages/AIAssistantPage';
import EventsOpportunitiesPage from './pages/EventsOpportunitiesPage';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <Router>
      <div className="app">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@700&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: #0F2027;
            color: #ffffff;
          }

          .app {
            min-height: 100vh;
          }

          /* Navigation */
          .navbar {
            position: sticky;
            top: 0;
            z-index: 1000;
            background: rgba(15, 32, 39, 0.9);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .nav-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .logo {
            font-family: 'Space Mono', monospace;
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #00D9FF, #4B0082);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-decoration: none;
          }

          .nav-links {
            display: flex;
            gap: 0.5rem;
            align-items: center;
          }

          .nav-link {
            padding: 0.75rem 1.5rem;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .nav-link:hover {
            color: #00D9FF;
            background: rgba(0, 217, 255, 0.1);
          }

          .nav-link.active {
            color: #ffffff;
            background: rgba(75, 0, 130, 0.3);
          }

          .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            color: #ffffff;
            cursor: pointer;
            padding: 0.5rem;
          }

          .mobile-menu {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            max-width: 300px;
            height: 100vh;
            background: rgba(15, 32, 39, 0.98);
            backdrop-filter: blur(20px);
            padding: 2rem;
            transition: right 0.3s ease;
            z-index: 2000;
            border-left: 1px solid rgba(255, 255, 255, 0.1);
          }

          .mobile-menu.open {
            right: 0;
          }

          .mobile-menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .mobile-nav-links {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .mobile-nav-link {
            padding: 1rem;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .mobile-nav-link:hover,
          .mobile-nav-link.active {
            color: #ffffff;
            background: rgba(75, 0, 130, 0.3);
          }

          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1999;
            display: none;
          }

          .overlay.open {
            display: block;
          }

          @media (max-width: 768px) {
            .nav-links {
              display: none;
            }

            .mobile-menu-btn {
              display: block;
            }
          }
        `}</style>

        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="logo">DevMaroc</Link>
            
            {/* Desktop Navigation */}
            <div className="nav-links">
              <Link to="/" className="nav-link">
                <Home size={18} />
                Accueil
              </Link>
              <Link to="/profile" className="nav-link">
                <Users size={18} />
                Profil
              </Link>
              <Link to="/forum" className="nav-link">
                <MessageSquare size={18} />
                Forum
              </Link>
              <Link to="/events" className="nav-link">
                <Calendar size={18} />
                Événements
              </Link>
              <Link to="/ai-assistant" className="nav-link">
                <Sparkles size={18} />
                Assistant IA
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)} />
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-header">
            <span className="logo">DevMaroc</span>
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <div className="mobile-nav-links">
            <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <Home size={20} />
              Accueil
            </Link>
            <Link to="/profile" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <Users size={20} />
              Profil
            </Link>
            <Link to="/forum" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <MessageSquare size={20} />
              Forum
            </Link>
            <Link to="/events" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <Calendar size={20} />
              Événements
            </Link>
            <Link to="/ai-assistant" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <Sparkles size={20} />
              Assistant IA
            </Link>
          </div>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/events" element={<EventsOpportunitiesPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
