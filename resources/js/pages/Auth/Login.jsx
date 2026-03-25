import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';

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
        <h2>Bon retour !</h2>
        <p>Heureux de vous revoir parmi nous.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="form-group">
          <label className="form-label">Email Professionnel</label>
          <div className="input-container">
            <input 
              type="email" 
              className="auth-input"
              placeholder="test@example.com"
              value={data.email}
              onChange={e => setData('email', e.target.value)}
              required
            />
          </div>
          {errors.email && <span className="error-hint">{errors.email}</span>}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Mot de passe</label>
            <Link href="/forgot-password" style={{ fontSize: '0.85rem', color: '#00D9FF', textDecoration: 'none' }}>
              Oublié ?
            </Link>
          </div>
          <div className="input-container">
            <input 
              type="password" 
              className="auth-input"
              placeholder="••••••••••••"
              value={data.password}
              onChange={e => setData('password', e.target.value)}
              required
            />
          </div>
          {errors.password && <span className="error-hint">{errors.password}</span>}
        </div>

        {/* Remember Me */}
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <input 
            type="checkbox" 
            id="remember"
            checked={data.remember} 
            onChange={e => setData('remember', e.target.checked)}
            style={{ accentColor: '#00D9FF' }}
          />
          <label htmlFor="remember" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
            Se souvenir de moi
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-submit" disabled={processing}>
          {processing ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
