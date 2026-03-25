import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    ZONE <span style={{ color: 'white' }}>Critique</span>
                </h2>

                <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
                    La suppression de votre compte est une action définitive. Toutes vos données seront effacées de nos serveurs sans possibilité de récupération.
                </p>
            </header>

            <button onClick={confirmUserDeletion} className="btn-outline" style={{ padding: '1rem 2rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', background: 'rgba(239, 68, 68, 0.05)' }}>
                Désactivation Définitive du Compte
            </button>

            {confirmingUserDeletion && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', padding: '1rem' }}>
                    <div className="card-premium fade-up" style={{ width: '100%', maxWidth: '500px', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '2.5rem', background: '#110c0c' }}>
                        <form onSubmit={deleteUser}>
                            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>
                                Confirmation de <span style={{ color: '#ef4444' }}>Suppression</span>
                            </h2>

                            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', textAlign: 'center', lineHeight: 1.6 }}>
                                Cette opération est irréversible. Pour valider la suppression de votre identité sur DevMaroc, veuillez saisir votre mot de passe actuel.
                            </p>

                            <div className="mt-6">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="u-input"
                                    placeholder="Mot de passe de confirmation"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white' }}
                                    autoFocus
                                />
                                {errors.password && <div style={{ color: '#ef4444', marginTop: '0.5rem', fontSize: '0.875rem' }}>{errors.password}</div>}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                                <button type="button" onClick={closeModal} className="btn-tab" style={{ flex: 1, padding: '1rem', borderRadius: '12px', fontWeight: 700 }}>
                                    Annuler
                                </button>

                                <button type="submit" disabled={processing} className="btn-premium" style={{ flex: 1, padding: '1rem', background: 'linear-gradient(135deg, #ef4444, #991b1b)', borderRadius: '12px', fontWeight: 800 }}>
                                    {processing ? 'Exécution...' : 'Confirmer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
