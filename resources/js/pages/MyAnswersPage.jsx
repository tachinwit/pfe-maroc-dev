import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { MessageSquare, ArrowLeft, Lightbulb } from 'lucide-react';
import MainLayout from '../Layouts/MainLayout';

export default function MyAnswersPage({ answers }) {
    return (
        <MainLayout>
            <Head title="Mes Réponses" />
            
            <div className="container-center fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '900px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <Link href="/dashboard" className="btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MessageSquare color="var(--cyan)" size={32} />
                        Mes Réponses
                    </h1>
                </div>

                <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
                    {answers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-dim)' }}>
                            <Lightbulb size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                            <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '0.5rem' }}>Vous n'avez pas encore répondu à des questions</h3>
                            <p style={{ marginBottom: '1.5rem' }}>Partagez votre expertise et aidez la communauté !</p>
                            <Link href="/forum" className="btn-premium" style={{ padding: '0.8rem 1.5rem' }}>Explorer la Communauté</Link>
                        </div>
                    ) : (
                        answers.map(ans => (
                            <Link key={ans.id} href={`/forum/${ans.post?.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', transition: '0.2s' }} className="hover-bright">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ color: 'var(--cyan)', fontSize: '0.9rem', fontWeight: 600 }}>En réponse à : {ans.post?.title || 'Publication supprimée'}</span>
                                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{ans.created_at}</span>
                                    </div>
                                    <div style={{ color: 'white', lineHeight: 1.5, padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '3px solid var(--cyan)' }}>
                                        {ans.content}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
