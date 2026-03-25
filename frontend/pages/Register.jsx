import React from 'react';
import { Link, useForm, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

/**
 * Register - New user account creation.
 * Handles registration via Inertia useForm.
 */
const Register = () => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/register');
  };

  return (
    <div className="auth-page">
      <Head title="Rejoindre DevMaroc" />
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Rejoindre DevMaroc</h2>
            <p>Commencez votre aventure technique dès aujourd'hui</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label><User size={16}/> Prénom & Nom</label>
              <input 
                className={`u-input ${errors.name ? 'error' : ''}`} 
                placeholder="Mohamed Dev"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                required
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label><Mail size={16}/> Email professionnel</label>
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
                placeholder="Minimum 8 caractères"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
                required
              />
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label><Lock size={16}/> Confirmer le mot de passe</label>
              <input 
                type="password" 
                className="u-input" 
                placeholder="••••••••"
                value={data.password_confirmation}
                onChange={e => setData('password_confirmation', e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={processing}>
              <UserPlus size={18}/> {processing ? 'Création en cours...' : "S'inscrire"}
            </button>
          </form>

          <p className="auth-footer">
            Déjà membre ? <Link href="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

Register.layout = page => <MainLayout>{page}</MainLayout>;

export default Register;
