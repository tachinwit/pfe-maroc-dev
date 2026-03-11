import React, { useState } from 'react';
import { 
  Github, Linkedin, Mail, MapPin, Award, Code, Briefcase, 
  Calendar, Star, GitBranch, Users, Heart, MessageCircle,
  ExternalLink, ChevronDown, Plus
} from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('projects');

  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Plateforme complète de commerce électronique avec React et Laravel",
      tech: ["React", "Laravel", "MySQL", "Tailwind"],
      stars: 45,
      forks: 12,
      collaborators: 3,
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Application de gestion de tâches en temps réel avec notifications",
      tech: ["Vue.js", "Node.js", "MongoDB", "Socket.io"],
      stars: 32,
      forks: 8,
      collaborators: 2,
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "AI Chatbot",
      description: "Chatbot intelligent avec traitement du langage naturel",
      tech: ["Python", "TensorFlow", "Flask", "React"],
      stars: 67,
      forks: 21,
      collaborators: 5,
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=250&fit=crop"
    }
  ];

  const skills = [
    { name: "React", level: 90, category: "frontend" },
    { name: "Laravel", level: 85, category: "backend" },
    { name: "Vue.js", level: 80, category: "frontend" },
    { name: "Node.js", level: 75, category: "backend" },
    { name: "Python", level: 70, category: "backend" },
    { name: "TypeScript", level: 85, category: "frontend" },
    { name: "MySQL", level: 80, category: "database" },
    { name: "MongoDB", level: 75, category: "database" }
  ];

  const badges = [
    { name: "Top Contributor", icon: "🏆", color: "#FFD700" },
    { name: "Early Adopter", icon: "🚀", color: "#00D9FF" },
    { name: "Code Master", icon: "👨‍💻", color: "#4B0082" },
    { name: "Mentor", icon: "🎓", color: "#CCFF00" },
    { name: "Problem Solver", icon: "🧩", color: "#FF79C6" }
  ];

  const activities = [
    { type: "project", action: "Created new project", target: "Task Management App", time: "2h ago" },
    { type: "forum", action: "Answered question about", target: "React Hooks", time: "5h ago" },
    { type: "contribution", action: "Contributed to", target: "Open-Source CMS", time: "1d ago" },
    { type: "event", action: "Attended", target: "React Meetup Casablanca", time: "2d ago" }
  ];

  return (
    <div className="profile-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

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
        }

        body {
          font-family: 'Outfit', sans-serif;
          background: var(--midnight);
          color: #ffffff;
        }

        .profile-page {
          min-height: 100vh;
          background: 
            radial-gradient(circle at 10% 20%, rgba(75, 0, 130, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(0, 217, 255, 0.08) 0%, transparent 50%);
        }

        /* Header */
        .profile-header {
          background: linear-gradient(135deg, rgba(75, 0, 130, 0.2), rgba(15, 32, 39, 0.8));
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          padding: 2rem 0;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          gap: 3rem;
          align-items: flex-start;
        }

        .avatar-section {
          position: relative;
          flex-shrink: 0;
        }

        .avatar {
          width: 180px;
          height: 180px;
          border-radius: 24px;
          background: linear-gradient(135deg, var(--indigo), var(--cyan));
          padding: 4px;
          position: relative;
          animation: glow 3s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px rgba(75, 0, 130, 0.5); }
          50% { box-shadow: 0 0 50px rgba(0, 217, 255, 0.7); }
        }

        .avatar img {
          width: 100%;
          height: 100%;
          border-radius: 20px;
          object-fit: cover;
        }

        .status-badge {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: #10B981;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid var(--midnight);
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #ffffff, var(--cyan));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .profile-title {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .profile-meta {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.95rem;
        }

        .meta-item svg {
          width: 18px;
          height: 18px;
          color: var(--cyan);
        }

        .profile-bio {
          max-width: 700px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2rem;
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.75rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Outfit', sans-serif;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--indigo), #6B0FA6);
          color: #ffffff;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(75, 0, 130, 0.5);
        }

        .btn-outline {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .btn-outline:hover {
          border-color: var(--cyan);
          background: rgba(0, 217, 255, 0.1);
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px);
          border-color: var(--cyan);
        }

        /* Stats Bar */
        .stats-bar {
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem 0;
        }

        .stats-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 2rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--cyan), var(--lime));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
        }

        /* Main Content */
        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2rem;
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 3rem;
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }

        .tab {
          padding: 1rem 2rem;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
        }

        .tab.active {
          color: var(--cyan);
          border-bottom-color: var(--cyan);
        }

        .tab:hover:not(.active) {
          color: rgba(255, 255, 255, 0.9);
        }

        /* Projects Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .project-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .project-card:hover {
          transform: translateY(-8px);
          border-color: var(--cyan);
          box-shadow: 0 20px 60px rgba(0, 217, 255, 0.2);
        }

        .project-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          background: linear-gradient(135deg, var(--indigo), var(--steel));
        }

        .project-content {
          padding: 1.5rem;
        }

        .project-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #ffffff;
        }

        .project-description {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .project-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tech-tag {
          padding: 0.4rem 0.9rem;
          background: rgba(75, 0, 130, 0.3);
          border: 1px solid rgba(75, 0, 130, 0.5);
          border-radius: 20px;
          font-size: 0.8rem;
          color: var(--lime);
          font-family: 'JetBrains Mono', monospace;
        }

        .project-stats {
          display: flex;
          gap: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .project-stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
        }

        .project-stat svg {
          width: 16px;
          height: 16px;
          color: var(--cyan);
        }

        /* Sidebar */
        .sidebar {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .sidebar-section {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .sidebar-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sidebar-title svg {
          color: var(--cyan);
        }

        /* Skills */
        .skill-item {
          margin-bottom: 1.5rem;
        }

        .skill-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .skill-name {
          font-weight: 600;
          color: #ffffff;
        }

        .skill-level {
          color: var(--cyan);
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
        }

        .skill-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .skill-progress {
          height: 100%;
          background: linear-gradient(90deg, var(--indigo), var(--cyan));
          border-radius: 10px;
          transition: width 1s ease;
          box-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
        }

        /* Badges */
        .badges-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .badge-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .badge-item:hover {
          transform: scale(1.05);
          border-color: var(--cyan);
        }

        .badge-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .badge-name {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
        }

        /* Activity Feed */
        .activity-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--indigo), var(--cyan));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-text {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
        }

        .activity-target {
          color: var(--cyan);
          font-weight: 600;
        }

        .activity-time {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .profile-meta {
            justify-content: center;
          }

          .profile-actions {
            justify-content: center;
          }

          .stats-content {
            grid-template-columns: repeat(2, 1fr);
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .tabs {
            overflow-x: auto;
            white-space: nowrap;
          }
        }
      `}</style>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="header-content">
          <div className="avatar-section">
            <div className="avatar">
              <img src="https://i.pravatar.cc/200?img=33" alt="Profile" />
              <div className="status-badge"></div>
            </div>
          </div>

          <div className="profile-info">
            <h1 className="profile-name">Mohammed Alaoui</h1>
            <p className="profile-title">Full-Stack Developer | Laravel & React Specialist</p>
            
            <div className="profile-meta">
              <div className="meta-item">
                <MapPin />
                <span>Casablanca, Maroc</span>
              </div>
              <div className="meta-item">
                <Briefcase />
                <span>5 ans d'expérience</span>
              </div>
              <div className="meta-item">
                <Calendar />
                <span>Membre depuis Jan 2024</span>
              </div>
            </div>

            <p className="profile-bio">
              Développeur passionné spécialisé en développement web moderne. J'aime créer des applications 
              performantes et scalables. Contributeur actif à l'open-source et mentor pour les débutants.
            </p>

            <div className="profile-actions">
              <button className="btn btn-primary">
                <MessageCircle size={18} />
                Envoyer un Message
              </button>
              <button className="btn btn-outline">
                <Users size={18} />
                Suivre
              </button>
              <div className="social-links">
                <div className="social-link">
                  <Github size={20} />
                </div>
                <div className="social-link">
                  <Linkedin size={20} />
                </div>
                <div className="social-link">
                  <Mail size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stats-content">
          <div className="stat-item">
            <div className="stat-value">127</div>
            <div className="stat-label">Projets</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">2.4K</div>
            <div className="stat-label">Contributions</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">856</div>
            <div className="stat-label">Followers</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">4.8</div>
            <div className="stat-label">Note Moyenne</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">44870</div>
            <div className="stat-label">Points</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div>
          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projets
            </button>
            <button 
              className={`tab ${activeTab === 'contributions' ? 'active' : ''}`}
              onClick={() => setActiveTab('contributions')}
            >
              Contributions
            </button>
            <button 
              className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              Activité
            </button>
          </div>

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="projects-grid">
              {projects.map(project => (
                <div key={project.id} className="project-card">
                  <img src={project.image} alt={project.title} className="project-image" />
                  <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-tech">
                      {project.tech.map((tech, idx) => (
                        <span key={idx} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                    <div className="project-stats">
                      <div className="project-stat">
                        <Star size={16} />
                        <span>{project.stars}</span>
                      </div>
                      <div className="project-stat">
                        <GitBranch size={16} />
                        <span>{project.forks}</span>
                      </div>
                      <div className="project-stat">
                        <Users size={16} />
                        <span>{project.collaborators}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Skills */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <Code size={20} />
              Compétences Techniques
            </h3>
            {skills.slice(0, 5).map((skill, idx) => (
              <div key={idx} className="skill-item">
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <div 
                    className="skill-progress" 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <Award size={20} />
              Badges & Récompenses
            </h3>
            <div className="badges-grid">
              {badges.map((badge, idx) => (
                <div key={idx} className="badge-item">
                  <div className="badge-icon">{badge.icon}</div>
                  <div className="badge-name">{badge.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <Calendar size={20} />
              Activité Récente
            </h3>
            {activities.map((activity, idx) => (
              <div key={idx} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'project' && <Code size={18} />}
                  {activity.type === 'forum' && <MessageCircle size={18} />}
                  {activity.type === 'contribution' && <GitBranch size={18} />}
                  {activity.type === 'event' && <Calendar size={18} />}
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    {activity.action} <span className="activity-target">{activity.target}</span>
                  </p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
