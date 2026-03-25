import React, { useEffect, useRef } from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Code2, Users, Briefcase, Calendar, MessageSquare, Sparkles } from 'lucide-react';

/**
 * LandingPage - The main entry point for visitors.
 * Showcases the platform's features and community stats.
 */
const LandingPage = () => {
  const heroRef = useRef(null);
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
    if (!n && n !== 0) return '...';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K+';
    return n + '+';
  };

  const statItems = [
    { value: fmt(stats?.developers),   label: 'Développeurs Actifs' },
    { value: fmt(stats?.projects),     label: 'Projets Open-Source' },
    { value: fmt(stats?.opportunities),label: 'Opportunités Publiées' },
    { value: fmt(stats?.events),       label: 'Événements par Mois' },
  ];

  return (
    <div className="landing-page">
      <Head title="Bienvenue sur DevMaroc" />
      
      <section className="hero" ref={heroRef}>
        <div className="hero-badge">Plateforme 100% Marocaine</div>
        <h1>La Communauté des<br/><span className="gradient-text">Développeurs Marocains</span></h1>
        <p>Collaborez, apprenez et grandissez avec la plus grande communauté tech du Maroc. Partagez vos projets, trouvez des opportunités et développez votre réseau.</p>
        <div className="hero-cta">
          {auth?.user ? (
            <Link href="/dashboard" className="btn btn-primary">Mon Dashboard</Link>
          ) : (
            <>
              <Link href="/register" className="btn btn-primary">Rejoindre la Communauté</Link>
              <Link href="/forum" className="btn btn-outline">Découvrir la Plateforme</Link>
            </>
          )}
        </div>
      </section>

      <section className="features fade-up">
        <div className="features-header">
          <h2>Tout ce dont vous avez besoin</h2>
          <p>Une plateforme complète pour booster votre carrière de développeur</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card fade-up">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="stats fade-up">
        <h2>Une communauté en pleine croissance</h2>
        <div className="stats-grid">
          {statItems.map((s, i) => (
            <div key={i} className="stat-item">
              <h4>{s.value}</h4>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section fade-up">
        <h2>Prêt à rejoindre la communauté ?</h2>
        <p>Créez votre profil gratuitement et commencez à collaborer avec les meilleurs développeurs du Maroc</p>
        <Link href="/register" className="btn btn-primary" style={{position:'relative',zIndex:1}}>Commencer Maintenant</Link>
      </section>

      <footer className="footer">
        <p>© 2025 DevMaroc - Plateforme Communautaire pour Développeurs Marocains</p>
      </footer>
    </div>
  );
};

LandingPage.layout = page => <MainLayout>{page}</MainLayout>;

export default LandingPage;
