import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Réinitialisation" type="login">
            <Head title="Réinitialiser le mot de passe" />

            <div className="form-header">
                <h2>Nouveau départ</h2>
                <p>Choisissez un mot de passe robuste pour protéger votre compte.</p>
            </div>

            <form onSubmit={submit}>
                <div className="form-group">
                    <label className="form-label">Email Professionnel</label>
                    <div className="input-container">
                        <input
                            type="email"
                            className="auth-input"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            readOnly
                        />
                    </div>
                    {errors.email && <span className="error-hint">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Nouveau mot de passe</label>
                    <div className="input-container">
                        <input
                            type="password"
                            className="auth-input"
                            placeholder="••••••••••••"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    {errors.password && <span className="error-hint">{errors.password}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Confirmer le mot de passe</label>
                    <div className="input-container">
                        <input
                            type="password"
                            className="auth-input"
                            placeholder="••••••••••••"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </div>
                    {errors.password_confirmation && <span className="error-hint">{errors.password_confirmation}</span>}
                </div>

                <button type="submit" className="btn-submit" disabled={processing} style={{ marginTop: '1rem' }}>
                    {processing ? 'Réinitialisation...' : 'Changer le mot de passe'}
                </button>
            </form>
        </AuthLayout>
    );
}

// In the code above I accidentally used <Layout> instead of <AuthLayout> at the end. 
// I will fix it in the final version of the tool call.
