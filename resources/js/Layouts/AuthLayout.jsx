import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { Zap } from 'lucide-react';
import '../../css/auth.css';

const AuthLayout = ({ children, title, type = 'login' }) => {
  return (
    <div className="auth-layout">
      <Head title={title} />
      
      {/* Left Column - Brand Showcase */}
      <div className="auth-side-brand">
        <div className="brand-badge" style={{ animation: 'float 6s infinite ease-in-out' }}>
          <Zap size={14} fill="currentColor" />
          <span>Communauté Tech #1 au Maroc</span>
        </div>
        
        <div className="brand-logo">
          <span className="logo-icon">&lt;/&gt;</span>
          <span>DevMaroc</span>
        </div>
        
        <h1 className="brand-title">
          Propulsez votre <br /> <span className="gradient-text">Avenir Tech.</span>
        </h1>
        
        <div className="brand-description-card">
          <p style={{ color: 'white', opacity: 0.8, fontSize: '1.15rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            Rejoignez l'élite des développeurs marocains, accédez à des opportunités exclusives et collaborez avec une communauté passionnée par l'innovation.
          </p>
        </div>
      </div>
      
      {/* Right Column - Form Area */}
      <div className="auth-side-form">
        <div className="form-wrapper">
          {/* Toggle Buttons */}
          <div className="auth-toggle">
            <Link 
              href="/login" 
              className={`toggle-btn ${type === 'login' ? 'active' : ''}`}
            >
              Connexion
            </Link>
            <Link 
              href="/register" 
              className={`toggle-btn ${type === 'register' ? 'active' : ''}`}
            >
              Inscription
            </Link>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
