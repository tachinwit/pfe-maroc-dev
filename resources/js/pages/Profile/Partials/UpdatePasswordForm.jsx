import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    SÉCURITÉ <span className="gradient-text">Accès</span>
                </h2>

                <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
                    Assurez-vous que votre compte utilise un mot de passe robuste pour prévenir tout accès non autorisé.
                </p>
            </header>

            <form onSubmit={updatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label htmlFor="current_password" style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Mot de passe actuel</label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="u-input"
                        autoComplete="current-password"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white', fontSize: '1rem' }}
                    />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Nouveau mot de passe</label>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="u-input"
                        autoComplete="new-password"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white', fontSize: '1rem' }}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password_confirmation" style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Confirmer le nouveau mot de passe</label>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="u-input"
                        autoComplete="new-password"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white', fontSize: '1rem' }}
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <button className="btn-premium" disabled={processing} style={{ padding: '1rem 2rem', border: 'none', borderRadius: '12px', fontWeight: 700 }}>Actionner la mise à jour</button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm" style={{ color: '#4ade80', fontWeight: 600 }}>
                            Modification enregistrée. Un e-mail de confirmation vous a été envoyé.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
