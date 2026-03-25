import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <MainLayout>
            <Head title="Paramètres du compte" />

            <div className="container-center fade-in" style={{ paddingTop: '4rem', paddingBottom: '6rem', maxWidth: '900px' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                   <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(139, 92, 246, 0.1)', color: '#A78BFA', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                     🛡️ CENTRE DE SÉCURITÉ
                   </div>
                   <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Paramètres <span className="gradient-text">du compte</span></h1>
                   <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Gérez vos informations de connexion, votre adresse e-mail et la sécurité de votre accès à la plateforme.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <div className="card-premium" style={{ borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', padding: '2.5rem' }}>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className=""
                        />
                    </div>

                    <div className="card-premium" style={{ borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', padding: '2.5rem' }}>
                        <UpdatePasswordForm className="" />
                    </div>

                    <div className="card-premium" style={{ borderRadius: '24px', border: '1px solid #ef444422', background: 'rgba(239, 68, 68, 0.02)', padding: '2.5rem' }}>
                        <DeleteUserForm className="" />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
