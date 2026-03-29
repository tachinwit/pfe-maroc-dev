import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import { Mail, Lock, ArrowRight, LogIn } from 'lucide-react';

const Login = () => {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <AuthLayout title="Connexion" type="login">
      <div className="form-header">
        <h2 className="gradient-text">Content de vous revoir</h2>
        <p>Connectez-vous à votre espace membre</p>
      </div>

      {/* Google OAuth Button */}
      <a 
        href="/auth/google" 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          width: '100%',
          padding: '1.1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '800',
          cursor: 'pointer',
          transition: 'all 0.3s',
          textDecoration: 'none',
          marginBottom: '1.5rem',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          e.target.style.borderColor = 'rgba(0, 217, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.05)';
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Se connecter avec Google
      </a>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '1rem' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>OU</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
      </div>

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="form-group">
          <label className="form-label">Email Professionnel</label>
          <div className="input-container">
            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input 
              type="email" 
              className="auth-input"
              placeholder="votre@email.com"
              value={data.email}
              onChange={e => setData('email', e.target.value)}
              required
              style={{ paddingLeft: '3rem' }}
            />
          </div>
          {errors.email && <span className="error-hint">{errors.email}</span>}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Mot de passe</label>
            <Link href="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--cyan)', textDecoration: 'none', fontWeight: 600 }}>
              Oublié ?
            </Link>
          </div>
          <div className="input-container">
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input 
              type="password" 
              className="auth-input"
              placeholder="••••••••••••"
              value={data.password}
              onChange={e => setData('password', e.target.value)}
              required
              style={{ paddingLeft: '3rem' }}
            />
          </div>
          {errors.password && <span className="error-hint">{errors.password}</span>}
        </div>

        {/* Remember Me */}
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
          <input 
            type="checkbox" 
            id="remember"
            checked={data.remember} 
            onChange={e => setData('remember', e.target.checked)}
            style={{ accentColor: 'var(--cyan)', width: '16px', height: '16px' }}
          />
          <label htmlFor="remember" style={{ fontSize: '0.85rem', color: 'var(--text-dim)', cursor: 'pointer', fontWeight: 500 }}>
            Session persistante
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-submit" disabled={processing} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          {processing ? 'Chargement...' : (
            <>
              Connecter mon compte <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
