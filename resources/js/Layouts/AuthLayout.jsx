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
        <div className="brand-badge">
          <Zap size={14} fill="currentColor" />
          <span>Communauté Tech #1 au Maroc</span>
        </div>
        
        <div className="brand-logo">
          <span className="logo-icon">&lt;&gt;</span>
          <span>DevMaroc</span>
        </div>
        
        <h1 className="brand-title">
          Propulsez votre <br /> Carrière Tech.
        </h1>
        
        <p className="brand-description">
          Connectez-vous avec les meilleurs talents, accédez à des ressources exclusives et utilisez l'IA pour coder plus vite.
        </p>
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
