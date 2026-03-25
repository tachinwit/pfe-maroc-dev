import React from 'react';
import { Link, useForm, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Mail, Lock, LogIn, Github, Chrome } from 'lucide-react';

/**
 * Login - Authentication page.
 * Handles user login via Inertia useForm.
 */
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
    <div className="auth-page">
      <Head title="Connexion" />
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Bienvenue sur DevMaroc</h2>
            <p>Connectez-vous pour continuer</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label><Mail size={16}/> Email</label>
              <input 
                type="email" 
                className={`u-input ${errors.email ? 'error' : ''}`} 
                placeholder="votre@email.com"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                required
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label><Lock size={16}/> Mot de passe</label>
              <input 
                type="password" 
                className={`u-input ${errors.password ? 'error' : ''}`} 
                placeholder="••••••••"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
                required
              />
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            <div className="form-utils">
              <label className="checkbox-wrap">
                <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} />
                <span>Se souvenir de moi</span>
              </label>
              <Link href="/forgot-password" style={{color:'var(--cyan)', fontSize:'0.85rem', textDecoration:'none'}}>Mot de passe oublié ?</Link>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={processing}>
              <LogIn size={18}/> {processing ? 'Connexion...' : 'Se Connecter'}
            </button>
          </form>

          <div className="auth-divider">
            <span>OU</span>
          </div>

          <div className="social-auth">
             <button className="btn btn-social"><Github size={18}/> GitHub</button>
             <button className="btn btn-social"><Chrome size={18}/> Google</button>
          </div>

          <p className="auth-footer">
            Nouveau ici ? <Link href="/register">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

Login.layout = page => <MainLayout>{page}</MainLayout>;

export default Login;
