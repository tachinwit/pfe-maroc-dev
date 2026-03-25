import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';

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
    <AuthLayout title="Inscription" type="register">
      <div className="form-header">
        <h2>Rejoindre DevMaroc</h2>
        <p>Commencez votre aventure technique dès aujourd'hui.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="form-group">
          <label className="form-label">Nom Complet</label>
          <div className="input-container">
            <input 
              type="text" 
              className="auth-input"
              placeholder="Mohamed Alami"
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              required
            />
          </div>
          {errors.name && <span className="error-hint">{errors.name}</span>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label className="form-label">Email Professionnel</label>
          <div className="input-container">
            <input 
              type="email" 
              className="auth-input"
              placeholder="votre@email.com"
              value={data.email}
              onChange={e => setData('email', e.target.value)}
              required
            />
          </div>
          {errors.email && <span className="error-hint">{errors.email}</span>}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label className="form-label">Mot de passe</label>
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

        {/* Confirm Password Field */}
        <div className="form-group">
          <label className="form-label">Confirmer le mot de passe</label>
          <div className="input-container">
            <input 
              type="password" 
              className="auth-input"
              placeholder="••••••••••••"
              value={data.password_confirmation}
              onChange={e => setData('password_confirmation', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-submit" disabled={processing}>
          {processing ? 'Inscription...' : "S'inscrire"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;
