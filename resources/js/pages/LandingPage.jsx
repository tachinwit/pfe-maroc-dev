import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Users, Briefcase, Calendar, MessageSquare, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const heroRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Collaboration Open-Source",
      description: "Créez et contribuez à des projets avec la communauté marocaine"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Forum d'Entraide",
      description: "Posez vos questions et partagez vos connaissances techniques"
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Opportunités Pro",
      description: "Découvrez des stages et missions freelance adaptés à vos compétences"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Événements Tech",
      description: "Participez aux hackathons, meetups et workshops locaux"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Réseau Professionnel",
      description: "Développez votre portfolio et connectez avec d'autres devs"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Assistant IA",
      description: "Bénéficiez d'aide intelligente pour votre code et vos projets"
    }
  ];

  return (
    <div className="landing-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --midnight: #0F2027;
          --steel: #4A6070;
          --indigo: #4B0082;
          --accent-cyan: #00D9FF;
          --accent-lime: #CCFF00;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--midnight);
          color: #ffffff;
          overflow-x: hidden;
        }

        .landing-page {
          position: relative;
          min-height: 100vh;
        }

        /* Animated Background */
        .landing-page::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 50%, rgba(75, 0, 130, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 217, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(74, 96, 112, 0.1) 0%, transparent 40%);
          z-index: 0;
          animation: bgShift 20s ease-in-out infinite alternate;
        }

        @keyframes bgShift {
          0% { opacity: 0.8; transform: scale(1) rotate(0deg); }
          100% { opacity: 1; transform: scale(1.1) rotate(5deg); }
        }

        /* Navigation */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(15, 32, 39, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem 2rem;
        }

        .nav-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-family: 'Space Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--accent-cyan), var(--indigo));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }

        .nav-buttons {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          display: inline-block;
        }

        .btn-outline {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .btn-outline:hover {
          border-color: var(--accent-cyan);
          background: rgba(0, 217, 255, 0.1);
          transform: translateY(-2px);
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--indigo), #6B0FA6);
          color: #ffffff;
          box-shadow: 0 8px 32px rgba(75, 0, 130, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(75, 0, 130, 0.6);
        }

        /* Hero Section */
        .hero {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          padding: 8rem 2rem 6rem;
          text-align: center;
          z-index: 1;
        }

        .hero-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: rgba(0, 217, 255, 0.1);
          border: 1px solid rgba(0, 217, 255, 0.3);
          border-radius: 50px;
          color: var(--accent-cyan);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 2rem;
          letter-spacing: 0.05em;
          animation: fadeInUp 0.8s ease-out;
        }

        .hero h1 {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.8s ease-out 0.2s backwards;
          letter-spacing: -0.03em;
        }

        .gradient-text {
          background: linear-gradient(135deg, #ffffff, var(--accent-cyan), var(--indigo));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: gradientShift 3s ease infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .hero p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 700px;
          margin: 0 auto 3rem;
          line-height: 1.7;
          animation: fadeInUp 0.8s ease-out 0.4s backwards;
        }

        .hero-cta {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          animation: fadeInUp 0.8s ease-out 0.6s backwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Code Preview Decoration */
        .code-preview {
          position: absolute;
          right: 10%;
          top: 50%;
          transform: translateY(-50%);
          width: 400px;
          height: 300px;
          background: rgba(15, 32, 39, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.85rem;
          overflow: hidden;
          animation: float 6s ease-in-out infinite;
          display: none;
        }

        @media (min-width: 1400px) {
          .code-preview {
            display: block;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(-50%) translateX(0); }
          50% { transform: translateY(-50%) translateX(-20px); }
        }

        .code-line {
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.8;
        }

        .code-keyword { color: var(--accent-cyan); }
        .code-string { color: var(--accent-lime); }
        .code-function { color: #FF79C6; }

        /* Features Section */
        .features {
          position: relative;
          max-width: 1400px;
          margin: 8rem auto 4rem;
          padding: 0 2rem;
          z-index: 1;
        }

        .features-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        .features-header h2 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .features-header p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.6);
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2.5rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent-cyan), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .feature-card:hover::before {
          transform: translateX(100%);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(0, 217, 255, 0.3);
          box-shadow: 0 20px 60px rgba(0, 217, 255, 0.2);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--indigo), rgba(75, 0, 130, 0.5));
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: var(--accent-cyan);
          transition: transform 0.4s ease;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .feature-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .feature-card p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          font-size: 1rem;
        }

        /* Stats Section */
        .stats {
          max-width: 1400px;
          margin: 8rem auto;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, rgba(75, 0, 130, 0.2), rgba(0, 217, 255, 0.1));
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 3rem;
          margin-top: 3rem;
        }

        .stat-item h4 {
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--accent-cyan), #ffffff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .stat-item p {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.7);
        }

        /* CTA Section */
        .cta-section {
          max-width: 1000px;
          margin: 8rem auto 4rem;
          padding: 5rem 2rem;
          text-align: center;
          background: linear-gradient(135deg, var(--indigo), #2D0A4E);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(0, 217, 255, 0.1) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .cta-section h2 {
          position: relative;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          margin-bottom: 1.5rem;
          z-index: 1;
        }

        .cta-section p {
          position: relative;
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2.5rem;
          z-index: 1;
        }

        .cta-button {
          position: relative;
          z-index: 1;
        }

        /* Footer */
        .footer {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2rem;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.5);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero {
            padding: 5rem 1.5rem 4rem;
          }

          .hero-cta {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 300px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        /* Fade up animation for scroll */
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }

        .fade-up.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-badge">🇲🇦 Plateforme 100% Marocaine</div>
        <h1>
          La Communauté des<br />
          <span className="gradient-text">Développeurs Marocains</span>
        </h1>
        <p>
          Collaborez, apprenez et grandissez avec la plus grande communauté tech du Maroc. 
          Partagez vos projets, trouvez des opportunités et développez votre réseau professionnel.
        </p>
        <div className="hero-cta">
          <button className="btn btn-primary" onClick={() => navigate('/profile')}>Rejoindre la Communauté</button>
          <button className="btn btn-outline" onClick={() => navigate('/forum')}>Découvrir la Plateforme</button>
        </div>

        <div className="code-preview">
          <div className="code-line"><span className="code-keyword">const</span> developer = {'{'};</div>
          <div className="code-line">  <span className="code-keyword">name:</span> <span className="code-string">"Mohammed"</span>,</div>
          <div className="code-line">  <span className="code-keyword">skills:</span> [<span className="code-string">"React"</span>, <span className="code-string">"Laravel"</span>],</div>
          <div className="code-line">  <span className="code-function">collaborate</span>() {'{'}</div>
          <div className="code-line">    <span className="code-keyword">return</span> <span className="code-string">"Building amazing things"</span>;</div>
          <div className="code-line">  {'}'}</div>
          <div className="code-line">{'}'};</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features fade-up">
        <div className="features-header">
          <h2>Tout ce dont vous avez besoin</h2>
          <p>Une plateforme complète pour booster votre carrière de développeur</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats fade-up">
        <h2>Une communauté en pleine croissance</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <h4>5K+</h4>
            <p>Développeurs Actifs</p>
          </div>
          <div className="stat-item">
            <h4>1.2K+</h4>
            <p>Projets Open-Source</p>
          </div>
          <div className="stat-item">
            <h4>500+</h4>
            <p>Opportunités Publiées</p>
          </div>
          <div className="stat-item">
            <h4>50+</h4>
            <p>Événements par Mois</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section fade-up">
        <h2>Prêt à rejoindre la communauté ?</h2>
        <p>
          Créez votre profil gratuitement et commencez à collaborer avec les meilleurs développeurs du Maroc
        </p>
        <button className="btn btn-primary cta-button" onClick={() => navigate('/profile')}>
          Commencer Maintenant
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 DevMaroc - Plateforme Communautaire pour Développeurs Marocains</p>
      </footer>
    </div>
  );
};

export default LandingPage;
