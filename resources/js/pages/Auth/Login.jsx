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
