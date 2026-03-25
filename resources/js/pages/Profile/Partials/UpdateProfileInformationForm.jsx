import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Informations du <span className="gradient-text">Compte</span>
                </h2>

                <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
                    Gérez vos identifiants de base et votre adresse e-mail de contact.
                </p>
            </header>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Nom complet</label>
                    <input
                        id="name"
                        className="u-input"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white', fontSize: '1rem' }}
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Adresse E-mail</label>
                    <input
                        id="email"
                        type="email"
                        className="u-input"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white', fontSize: '1rem' }}
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm" style={{ color: 'var(--text-dim)' }}>
                            Votre adresse e-mail n'est pas vérifiée.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                style={{ color: 'var(--cyan)', textDecoration: 'underline', marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Cliquez ici pour renvoyer l'e-mail de vérification.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium" style={{ color: '#4ade80' }}>
                                Un nouveau lien de vérification a été envoyé à votre adresse e-mail.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button className="btn-premium" disabled={processing} style={{ padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px' }}>Enregistrer</button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm" style={{ color: '#4ade80' }}>
                            Enregistré.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
