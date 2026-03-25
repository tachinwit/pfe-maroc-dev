import React, { useEffect, useRef } from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Code2, Users, Briefcase, Calendar, MessageSquare, Sparkles } from 'lucide-react';

/**
 * LandingPage - The main entry point for visitors.
 * Showcases the platform's features and community stats.
 */
const LandingPage = () => {
  const { auth, stats } = usePage().props;

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('animate-in'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: <Code2 className="w-8 h-8"/>,        title: "Collaboration Open-Source",  description: "Créez et contribuez à des projets avec la communauté marocaine" },
    { icon: <MessageSquare className="w-8 h-8"/>, title: "Forum d'Entraide",          description: "Posez vos questions et partagez vos connaissances techniques" },
    { icon: <Briefcase className="w-8 h-8"/>,    title: "Opportunités Pro",            description: "Découvrez des stages et missions freelance adaptés à vos compétences" },
    { icon: <Calendar className="w-8 h-8"/>,     title: "Événements Tech",             description: "Participez aux hackathons, meetups et workshops locaux" },
    { icon: <Users className="w-8 h-8"/>,        title: "Réseau Professionnel",        description: "Développez votre portfolio et connectez avec d'autres devs" },
    { icon: <Sparkles className="w-8 h-8"/>,     title: "Assistant IA",                description: "Bénéficiez d'aide intelligente pour votre code et vos projets" },
  ];

  const fmt = (n) => {
    if (!n && n !== 0) return '0+';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K+';
    return n + '+';
  };

  const statItems = [
    { value: fmt(stats?.developers || 240),   label: 'Développeurs' },
    { value: fmt(stats?.projects || 45),     label: 'Projets' },
    { value: fmt(stats?.opportunities || 12),label: 'Jobs' },
    { value: fmt(stats?.events || 8),       label: 'Events' },
  ];

  return (
    <div className="landing-page">
      <Head title="Bienvenue sur DevMaroc" />
      
      {/* Hero Section */}
      <section className="hero fade-up" style={{ padding: '8rem 0 6rem' }}>
        <div className="hero-badge">Plateforme Communautaire #1 au Maroc</div>
        <h1 className="section-title" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 1 }}>
          La Communauté des<br/>
          <span className="gradient-text">Développeurs Marocains</span>
        </h1>
        <p className="section-subtitle" style={{ marginTop: '1.5rem', marginBottom: '3rem' }}>
          Collaborez sur des projets open-source, trouvez des opportunités de carrière et restez à la pointe de la technologie avec l'IA.
        </p>
        
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {auth?.user ? (
            <Link href="/dashboard" className="btn-premium" style={{ minWidth: '200px' }}>Accéder au Dashboard</Link>
          ) : (
            <>
              <Link href="/register" className="btn-premium" style={{ minWidth: '200px' }}>Rejoindre la Communauté</Link>
              <Link href="/forum" className="btn-outline" style={{ padding: '1rem 2rem', borderRadius: '12px', fontWeight: 700 }}>Explorer le Forum</Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features fade-up" style={{ padding: '6rem 0' }}>
         <h2 className="section-title">Tout pour votre réussite</h2>
         <p className="section-subtitle">Une boîte à outils complète conçue spécifiquement pour l'écosystème tech marocain.</p>
         
         <div className="grid-features">
            {features.map((feature, index) => (
              <div key={index} className="card-premium fade-up">
                <div className="feature-icon" style={{ marginBottom: '1.5rem', color: 'var(--cyan)' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-dim)', lineHeight: 1.6 }}>{feature.description}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Stats Section */}
      <section className="stats fade-up" style={{ padding: '6rem 0', background: 'rgba(255,255,255,0.01)', borderRadius: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="section-title" style={{ fontSize: '2.5rem' }}>Impacter l'écosystème ensemble</h2>
        </div>
        
        <div className="stats-grid" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '3rem' }}>
          {statItems.map((s, i) => (
            <div key={i} className="stat-item" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--cyan)', marginBottom: '0.5rem' }}>{s.value}</div>
              <div style={{ color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      {!auth?.user && (
        <section className="cta-section fade-up" style={{ padding: '10rem 0', textAlign: 'center' }}>
            <div className="card-premium" style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, rgba(0,217,255,0.05) 0%, rgba(75,0,130,0.05) 100%)' }}>
                <h2 className="section-title" style={{ fontSize: '2.5rem' }}>Prêt à propulser votre carrière ?</h2>
                <p className="section-subtitle" style={{ marginBottom: '3rem' }}>Rejoignez des milliers de développeurs passionnés dès aujourd'hui.</p>
                <Link href="/register" className="btn-premium" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>Créer mon compte gratuit</Link>
            </div>
        </section>
      )}
    </div>
  );
};

LandingPage.layout = page => <MainLayout>{page}</MainLayout>;

export default LandingPage;
