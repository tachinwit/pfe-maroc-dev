import { User, Mail, Lock, UserPlus } from 'lucide-react';

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
        <h2 className="gradient-text">Créer un compte</h2>
        <p>Rejoignez la communauté tech #1 du Maroc</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="form-group">
          <label className="form-label">Nom Complet</label>
          <div className="input-container">
            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input 
              type="text" 
              className="auth-input"
              placeholder="Mohamed Alami"
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              required
              style={{ paddingLeft: '3rem' }}
            />
          </div>
          {errors.name && <span className="error-hint">{errors.name}</span>}
        </div>

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
          <label className="form-label">Mot de passe</label>
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

        {/* Confirm Password Field */}
        <div className="form-group">
          <label className="form-label">Confirmer le mot de passe</label>
          <div className="input-container">
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input 
              type="password" 
              className="auth-input"
              placeholder="••••••••••••"
              value={data.password_confirmation}
              onChange={e => setData('password_confirmation', e.target.value)}
              required
              style={{ paddingLeft: '3rem' }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-submit" disabled={processing} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          {processing ? 'Inscription...' : (
            <>
              Créer mon compte <UserPlus size={18} />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;
