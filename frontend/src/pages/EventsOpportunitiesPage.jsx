import React, { useState } from 'react';
import { 
  Calendar, MapPin, Users, Clock, Briefcase, DollarSign,
  ExternalLink, Heart, Share2, Filter, Search, Tag,
  TrendingUp, Award, Building, Zap, ChevronRight
} from 'lucide-react';

const EventsOpportunitiesPage = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const upcomingEvents = [
    {
      id: 1,
      title: "React Advanced Meetup",
      type: "Meetup",
      date: "15 Février 2025",
      time: "18:00 - 21:00",
      location: "Technopark Casablanca",
      attendees: 87,
      maxAttendees: 120,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop",
      tags: ["React", "JavaScript", "Frontend"],
      featured: true,
      organizer: {
        name: "React Morocco",
        avatar: "https://i.pravatar.cc/40?img=15"
      }
    },
    {
      id: 2,
      title: "Hackathon FinTech 2025",
      type: "Hackathon",
      date: "22-24 Février 2025",
      time: "48 heures",
      location: "ENSAM Rabat",
      attendees: 234,
      maxAttendees: 300,
      prize: "50,000 MAD",
      image: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=600&h=300&fit=crop",
      tags: ["Hackathon", "FinTech", "Innovation"],
      featured: true,
      organizer: {
        name: "ENSAM Coding Club",
        avatar: "https://i.pravatar.cc/40?img=28"
      }
    },
    {
      id: 3,
      title: "Laravel Workshop: API Development",
      type: "Workshop",
      date: "10 Février 2025",
      time: "14:00 - 18:00",
      location: "Online (Zoom)",
      attendees: 156,
      maxAttendees: 200,
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=300&fit=crop",
      tags: ["Laravel", "PHP", "Backend", "API"],
      featured: false,
      organizer: {
        name: "PHP Morocco",
        avatar: "https://i.pravatar.cc/40?img=42"
      }
    }
  ];

  const opportunities = [
    {
      id: 1,
      title: "Full-Stack Developer",
      company: "TechCorp Morocco",
      type: "CDI",
      location: "Casablanca",
      salary: "12,000 - 18,000 MAD",
      experience: "2-4 ans",
      posted: "il y a 2 jours",
      applicants: 24,
      tags: ["React", "Node.js", "MongoDB"],
      remote: true,
      featured: true,
      logo: "https://i.pravatar.cc/60?img=50"
    },
    {
      id: 2,
      title: "Stage Développeur Laravel",
      company: "Digital Agency Rabat",
      type: "Stage",
      location: "Rabat",
      salary: "3,000 - 4,000 MAD",
      experience: "Débutant",
      posted: "il y a 5 jours",
      applicants: 42,
      tags: ["Laravel", "MySQL", "Vue.js"],
      remote: false,
      featured: false,
      logo: "https://i.pravatar.cc/60?img=35"
    },
    {
      id: 3,
      title: "Freelance React Developer",
      company: "StartupHub",
      type: "Freelance",
      location: "Remote",
      salary: "200 - 400 MAD/h",
      experience: "3+ ans",
      posted: "il y a 1 jour",
      applicants: 18,
      tags: ["React", "TypeScript", "Tailwind"],
      remote: true,
      featured: true,
      logo: "https://i.pravatar.cc/60?img=22"
    },
    {
      id: 4,
      title: "Mobile Developer (Flutter)",
      company: "E-commerce Solutions",
      type: "CDD",
      location: "Marrakech",
      salary: "10,000 - 15,000 MAD",
      experience: "2+ ans",
      posted: "il y a 3 jours",
      applicants: 31,
      tags: ["Flutter", "Dart", "Firebase"],
      remote: false,
      featured: false,
      logo: "https://i.pravatar.cc/60?img=67"
    }
  ];

  const eventTypes = [
    { id: 'all', name: 'Tous', count: 24 },
    { id: 'hackathon', name: 'Hackathons', count: 8 },
    { id: 'meetup', name: 'Meetups', count: 12 },
    { id: 'workshop', name: 'Workshops', count: 15 },
    { id: 'conference', name: 'Conférences', count: 6 }
  ];

  return (
    <div className="events-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --midnight: #0F2027;
          --steel: #4A6070;
          --indigo: #4B0082;
          --cyan: #00D9FF;
          --lime: #CCFF00;
          --orange: #FF6B35;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: var(--midnight);
          color: #ffffff;
        }

        .events-page {
          min-height: 100vh;
          background: 
            radial-gradient(circle at 25% 25%, rgba(75, 0, 130, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 107, 53, 0.08) 0%, transparent 50%);
        }

        /* Hero Header */
        .hero-header {
          background: linear-gradient(135deg, rgba(75, 0, 130, 0.3), rgba(15, 32, 39, 0.9));
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(30px);
          padding: 4rem 0 3rem;
        }

        .hero-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          text-align: center;
        }

        .hero-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: rgba(255, 107, 53, 0.15);
          border: 1px solid rgba(255, 107, 53, 0.3);
          border-radius: 30px;
          color: var(--orange);
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          letter-spacing: 0.05em;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #ffffff, var(--cyan), var(--orange));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 700px;
          margin: 0 auto 2.5rem;
        }

        /* Tabs */
        .tabs-container {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .tab {
          padding: 0.9rem 2.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .tab.active {
          background: linear-gradient(135deg, var(--indigo), #6B0FA6);
          border-color: transparent;
          color: #ffffff;
          box-shadow: 0 8px 25px rgba(75, 0, 130, 0.4);
        }

        .tab:hover:not(.active) {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--cyan);
        }

        /* Filters Bar */
        .filters-bar {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem 0;
        }

        .filters-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .filter-chips {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .filter-chip {
          padding: 0.6rem 1.3rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .filter-chip.active {
          background: rgba(0, 217, 255, 0.15);
          border-color: var(--cyan);
          color: var(--cyan);
        }

        .filter-chip:hover:not(.active) {
          background: rgba(255, 255, 255, 0.08);
        }

        .search-filter {
          display: flex;
          gap: 0.75rem;
        }

        .search-box {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
        }

        .search-input {
          padding: 0.75rem 1rem 0.75rem 3rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.95rem;
          font-family: 'Inter', sans-serif;
          width: 300px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--cyan);
          background: rgba(255, 255, 255, 0.08);
        }

        .filter-btn {
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--cyan);
        }

        /* Main Content */
        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        /* Events Grid */
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 2rem;
        }

        .event-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }

        .event-card.featured::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--orange), var(--cyan));
        }

        .event-card:hover {
          transform: translateY(-8px);
          border-color: rgba(0, 217, 255, 0.3);
          box-shadow: 0 20px 60px rgba(0, 217, 255, 0.15);
        }

        .event-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          position: relative;
        }

        .event-type-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.5rem 1rem;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          color: var(--orange);
          font-size: 0.8rem;
          font-weight: 700;
        }

        .event-content {
          padding: 1.5rem;
        }

        .event-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .event-meta {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .meta-row svg {
          width: 18px;
          height: 18px;
          color: var(--cyan);
          flex-shrink: 0;
        }

        .event-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .event-tag {
          padding: 0.35rem 0.8rem;
          background: rgba(75, 0, 130, 0.2);
          border: 1px solid rgba(75, 0, 130, 0.4);
          border-radius: 15px;
          color: var(--lime);
          font-size: 0.75rem;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
        }

        .event-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .event-organizer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .organizer-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 2px solid var(--cyan);
        }

        .organizer-name {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
        }

        .event-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: rgba(255, 255, 255, 0.6);
        }

        .action-icon:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--cyan);
          color: var(--cyan);
        }

        /* Opportunities List */
        .opportunities-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .opportunity-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          gap: 2rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }

        .opportunity-card.featured::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, var(--orange), var(--cyan));
        }

        .opportunity-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(0, 217, 255, 0.3);
          transform: translateX(8px);
        }

        .opportunity-logo {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          object-fit: cover;
          flex-shrink: 0;
          background: linear-gradient(135deg, var(--indigo), var(--steel));
        }

        .opportunity-content {
          flex: 1;
        }

        .opportunity-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .opportunity-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .opportunity-company {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.95rem;
        }

        .opportunity-type {
          padding: 0.5rem 1.2rem;
          background: linear-gradient(135deg, var(--indigo), #6B0FA6);
          border-radius: 20px;
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .opportunity-details {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .detail-item svg {
          width: 16px;
          height: 16px;
          color: var(--cyan);
        }

        .detail-item strong {
          color: #ffffff;
          font-weight: 600;
        }

        .opportunity-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .opportunity-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .opportunity-meta {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
        }

        .apply-btn {
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, var(--orange), #FF8C5A);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Inter', sans-serif;
        }

        .apply-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .events-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .filters-content {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-chips {
            overflow-x: auto;
            flex-wrap: nowrap;
          }

          .search-filter {
            flex-direction: column;
          }

          .search-input {
            width: 100%;
          }

          .opportunity-card {
            flex-direction: column;
          }

          .opportunity-header {
            flex-direction: column;
            gap: 1rem;
          }

          .tabs-container {
            flex-direction: column;
          }

          .tab {
            width: 100%;
          }
        }
      `}</style>

      {/* Hero Header */}
      <div className="hero-header">
        <div className="hero-content">
          <div className="hero-badge">🎯 NOUVELLES OPPORTUNITÉS CHAQUE JOUR</div>
          <h1 className="hero-title">Événements & Opportunités</h1>
          <p className="hero-subtitle">
            Participez aux événements tech et découvrez les meilleures opportunités professionnelles au Maroc
          </p>
          <div className="tabs-container">
            <button 
              className={`tab ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <Calendar size={20} />
              Événements
            </button>
            <button 
              className={`tab ${activeTab === 'opportunities' ? 'active' : ''}`}
              onClick={() => setActiveTab('opportunities')}
            >
              <Briefcase size={20} />
              Opportunités
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filters-content">
          <div className="filter-chips">
            {eventTypes.map(type => (
              <div
                key={type.id}
                className={`filter-chip ${selectedFilter === type.id ? 'active' : ''}`}
                onClick={() => setSelectedFilter(type.id)}
              >
                {type.name} ({type.count})
              </div>
            ))}
          </div>
          <div className="search-filter">
            <div className="search-box">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                placeholder={activeTab === 'events' ? "Rechercher un événement..." : "Rechercher une opportunité..."}
                className="search-input"
              />
            </div>
            <button className="filter-btn">
              <Filter size={18} />
              Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'events' ? (
          <div className="events-grid">
            {upcomingEvents.map(event => (
              <div key={event.id} className={`event-card ${event.featured ? 'featured' : ''}`}>
                <div style={{ position: 'relative' }}>
                  <img src={event.image} alt={event.title} className="event-image" />
                  <div className="event-type-badge">{event.type}</div>
                </div>
                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-meta">
                    <div className="meta-row">
                      <Calendar size={18} />
                      <span>{event.date}</span>
                    </div>
                    <div className="meta-row">
                      <Clock size={18} />
                      <span>{event.time}</span>
                    </div>
                    <div className="meta-row">
                      <MapPin size={18} />
                      <span>{event.location}</span>
                    </div>
                    <div className="meta-row">
                      <Users size={18} />
                      <span>{event.attendees}/{event.maxAttendees} participants</span>
                    </div>
                    {event.prize && (
                      <div className="meta-row">
                        <Award size={18} />
                        <span style={{ color: 'var(--lime)', fontWeight: '700' }}>{event.prize}</span>
                      </div>
                    )}
                  </div>
                  <div className="event-tags">
                    {event.tags.map((tag, idx) => (
                      <span key={idx} className="event-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="event-footer">
                    <div className="event-organizer">
                      <img src={event.organizer.avatar} alt="" className="organizer-avatar" />
                      <span className="organizer-name">{event.organizer.name}</span>
                    </div>
                    <div className="event-actions">
                      <div className="action-icon">
                        <Heart size={16} />
                      </div>
                      <div className="action-icon">
                        <Share2 size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="opportunities-list">
            {opportunities.map(opp => (
              <div key={opp.id} className={`opportunity-card ${opp.featured ? 'featured' : ''}`}>
                <img src={opp.logo} alt={opp.company} className="opportunity-logo" />
                <div className="opportunity-content">
                  <div className="opportunity-header">
                    <div>
                      <h3 className="opportunity-title">{opp.title}</h3>
                      <div className="opportunity-company">
                        <Building size={16} />
                        {opp.company}
                      </div>
                    </div>
                    <div className="opportunity-type">{opp.type}</div>
                  </div>
                  <div className="opportunity-details">
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{opp.location} {opp.remote && '• Remote'}</span>
                    </div>
                    <div className="detail-item">
                      <DollarSign size={16} />
                      <strong>{opp.salary}</strong>
                    </div>
                    <div className="detail-item">
                      <Clock size={16} />
                      <span>{opp.experience}</span>
                    </div>
                  </div>
                  <div className="opportunity-footer">
                    <div className="opportunity-tags">
                      {opp.tags.map((tag, idx) => (
                        <span key={idx} className="event-tag">{tag}</span>
                      ))}
                    </div>
                    <div className="opportunity-meta">
                      <span>{opp.applicants} candidatures</span>
                      <span>•</span>
                      <span>{opp.posted}</span>
                    </div>
                  </div>
                </div>
                <button className="apply-btn">
                  Postuler
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsOpportunitiesPage;
