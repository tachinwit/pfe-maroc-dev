import React from 'react';
import { useForm, Head, usePage } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';

export default function ForgotPassword({ status }) {
    const { flash } = usePage().props;
    const demo_link = flash?.demo_link;

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout title="Mot de passe oublié" type="login">
            <Head title="Mot de passe oublié" />

            <div className="form-header">
                <h2>Récupération</h2>
                <p>Pas de panique ! Entrez votre e-mail pour recevoir un lien de réinitialisation.</p>
            </div>

            {status && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: '#10B981', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>
                        {status}
                    </div>
                    {demo_link && (
                        <a 
                            href={demo_link} 
                            style={{ 
                                display: 'block', 
                                textAlign: 'center', 
                                padding: '1rem', 
                                background: 'linear-gradient(135deg, #00D9FF 0%, #1e1b4b 100%)', 
                                color: 'white', 
                                borderRadius: '12px', 
                                textDecoration: 'none', 
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                boxShadow: '0 4px 15px rgba(0, 217, 255, 0.3)'
                            }}
                        >
                            🚀 OUVRIR LE LIEN DE RÉCUPÉRATION (DÉMO)
                        </a>
                    )}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="form-group">
                    <label className="form-label">Email Professionnel</label>
                    <div className="input-container">
                        <input
                            type="email"
                            className="auth-input"
                            placeholder="votre@email.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    {errors.email && <span className="error-hint">{errors.email}</span>}
                </div>

                <button type="submit" className="btn-submit" disabled={processing} style={{ marginTop: '1rem' }}>
                    {processing ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                </button>
                
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <a href="/login" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
                        Retour à la <span style={{ color: '#00D9FF' }}>connexion</span>
                    </a>
                </div>
            </form>
        </AuthLayout>
    );
}
