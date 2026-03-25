import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Users, Mail, MapPin, Briefcase, ChevronLeft, ExternalLink } from 'lucide-react';

const OpportunityApplicantsPage = ({ opportunity }) => {
    return (
        <div className="container-center" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <Head title={`Candidats - ${opportunity.title}`} />
            
            <Link href="/events" className="flex items-center gap-2 text-dim hover:text-white transition-colors mb-8 inline-flex">
                <ChevronLeft size={20} /> Retour aux opportunités
            </Link>

            <div className="mb-10">
                <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textAlign: 'left' }}>
                    Candidats pour <span className="gradient-text">{opportunity.title}</span>
                </h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>
                    {opportunity.company} • {opportunity.applications.length} candidatures reçues
                </p>
            </div>

            {opportunity.applications.length === 0 ? (
                <div className="card-premium" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <Users size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-dim)', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Aucun candidat pour le moment</h3>
                    <p style={{ color: 'var(--text-dim)' }}>Les nouvelles candidatures apparaîtront ici.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {opportunity.applications.map(app => (
                        <div key={app.id} className="card-premium hover-scale" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
                                {app.user.name.charAt(0)}
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.2rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{app.user.name}</h3>
                                    <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: 'var(--text-dim)' }}>
                                        {app.user.points} pts
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                    <span className="flex items-center gap-1"><Mail size={14}/> {app.user.email}</span>
                                    {app.user.location && <span className="flex items-center gap-1"><MapPin size={14}/> {app.user.location}</span>}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                {app.user.cv_path && (
                                    <a href={`/storage/${app.user.cv_path}`} target="_blank" rel="noreferrer" className="btn-tab" style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        CV <ExternalLink size={14}/>
                                    </a>
                                )}
                                <Link href={`/user/${app.user.id}`} className="btn-tab" style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Profil <ExternalLink size={14}/>
                                </Link>
                                <Link href={`/messages?user_id=${app.user.id}`} className="btn-premium" style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                                    Contacter
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

OpportunityApplicantsPage.layout = page => <MainLayout>{page}</MainLayout>;

export default OpportunityApplicantsPage;
