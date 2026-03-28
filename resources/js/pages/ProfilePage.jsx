import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Briefcase, Github, Twitter, Linkedin, Star, Award, MessageSquare, ChevronRight, Settings, Plus, Edit3, X, Link as LinkIcon, Download, FileText, Trash2, ExternalLink } from 'lucide-react';
import { Link, usePage, Head, router } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import Toast from '../Components/common/Toast';
import GithubPreviewModal from '../Components/common/GithubPreviewModal';
import { SKILLS_LIST, ALL_SKILLS } from '../Constants/skills';

const ProfilePage = () => {
  const { auth, profileUser, projectsList, contributionsList } = usePage().props;
  const profile = profileUser || auth?.user || {
    id: 1,
    name: "Utilisateur",
    title: "Software Engineer",
    location: "Casablanca, Maroc",
    bio: "Passionné par le développement web et les nouvelles technologies.",
    points: 0,
    level: "Novice",
    skills: ["React", "Laravel"],
  };

  const projects = projectsList || [];
  const contributions = contributionsList || [];

  const isOwner = auth?.user?.id === profile.id;
  const [toast, setToast] = useState(null);

  // Modals state
  const [editMode, setEditMode] = useState(false);
  const [addProjectMode, setAddProjectMode] = useState(false);
  const [githubPreviewUrl, setGithubPreviewUrl] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [addType, setAddType] = useState('manual'); // 'manual' or 'github'
  const [isImporting, setIsImporting] = useState(false);
  
  // Forms state
  const [editForm, setEditForm] = useState({ 
    title: profile.title || '', 
    location: profile.location || '', 
    bio: profile.bio || '',
    skills: profile.skills || [],
    github_url: profile.github_url || '',
    linkedin_url: profile.linkedin_url || ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', link: '', type: 'Project', date: '' });

  useEffect(() => {
    setEditForm({
      title: profile.title || '',
      location: profile.location || '',
      bio: profile.bio || '',
      skills: profile.skills || [],
      github_url: profile.github_url || '',
      linkedin_url: profile.linkedin_url || ''
    });
  }, [profile.title, profile.location, profile.bio, profile.skills, profile.github_url, profile.linkedin_url]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    router.post('/my-profile', {
      title: editForm.title,
      location: editForm.location,
      bio: editForm.bio,
      skills: editForm.skills,
      cv: editForm.cv,
      github_url: editForm.github_url,
      linkedin_url: editForm.linkedin_url
    }, {
      forceFormData: true,
      onSuccess: () => {
        setEditMode(false);
        setToast({ message: 'Profil mis à jour avec succès.', points: null });
      }
    });
  };

  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !editForm.skills.includes(s)) {
      if (editForm.skills.length >= 5) {
        setToast({ message: 'Limite de 5 compétences atteinte.', points: null });
        return;
      }
      setEditForm({ ...editForm, skills: [...editForm.skills, s] });
    }
    setSkillInput('');
    setShowSuggestions(false);
  };

  const removeSkill = (skillToRemove) => {
    setEditForm({ ...editForm, skills: editForm.skills.filter(s => s !== skillToRemove) });
  };

  const handleProjectSave = (e) => {
    e.preventDefault();
    router.post('/projects/manual', {
      title: projectForm.title,
      description: projectForm.description,
      url: projectForm.link,
      type: projectForm.type === 'Project' ? 'github' : 'article',
      project_date: projectForm.date
    }, {
      onSuccess: () => {
        setAddProjectMode(false);
        setProjectForm({ title: '', description: '', link: '', type: 'Project', date: '' });
        setToast({ message: 'Ajouté avec succès !', points: null });
      }
    });
  };

  const handleGithubImport = (e) => {
    e.preventDefault();
    if (!projectForm.link.includes('github.com')) {
        setToast({ message: "Veuillez entrer une URL GitHub valide.", points: null });
        return;
    }
    setIsImporting(true);
    router.post('/projects/github', {
        url: projectForm.link
    }, {
        onSuccess: () => {
            setIsImporting(false);
            setAddProjectMode(false);
            setProjectForm({ title: '', description: '', link: '', type: 'Project', date: '' });
            setToast({ message: 'Projet importé avec succès depuis GitHub !', points: null });
        },
        onError: () => {
            setIsImporting(false);
            setToast({ message: "Échec de l'importation. Vérifiez l'URL.", points: null });
        }
    });
  };

  const handleDeleteProject = () => {
    if (!projectToDelete) return;
    router.delete(`/projects/${projectToDelete}`, {
        onSuccess: () => {
            setProjectToDelete(null);
            setToast({ message: 'Projet supprimé avec succès.', points: null });
        }
    });
  };

  const openGithubPreview = (e, url) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    setGithubPreviewUrl(url);
  };

  return (
    <div className="container-center" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '1200px' }}>
      <Head title={`${profile.name} - Profil Expert DevMaroc`} />

      {/* Profile Edit Modal */}
      {editMode && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(15px)', padding: '1rem' }}>
          <div className="card-premium fade-up" style={{ width: '100%', maxWidth: '600px', border: '1px solid rgba(255,255,255,0.1)', padding: 0, background: 'rgba(23, 23, 23, 0.95)' }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Édition du <span className="gradient-text">Profil</span></h2>
              <button onClick={() => setEditMode(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleProfileSave} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>Titre Professionnel</label>
                    <input required className="u-input" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>Ville / Pays</label>
                    <input required className="u-input" value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white' }} />
                  </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>Bio Expert</label>
                <textarea required className="u-input" value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} style={{ width: '100%', minHeight: '120px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white', resize: 'vertical', lineHeight: 1.6 }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>Stack Technique (Compétences)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {editForm.skills.map(skill => (
                    <span key={skill} style={{ background: 'rgba(0, 217, 255, 0.1)', color: 'var(--cyan)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(0, 217, 255, 0.2)' }}>
                      {skill}
                      <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill)} />
                    </span>
                  ))}
                  {editForm.skills.length === 0 && <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Aucune compétence ajoutée</span>}
                </div>
                
                <div style={{ position: 'relative' }}>
                  <input 
                    placeholder="Ajouter une compétence (ex: React, Docker...)" 
                    className="u-input" 
                    value={skillInput} 
                    onChange={e => { setSkillInput(e.target.value); setShowSuggestions(true); }}
                    onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                    onFocus={() => setShowSuggestions(true)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white' }} 
                  />
                  {showSuggestions && skillInput.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', marginTop: '0.5rem', zIndex: 10, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                      {ALL_SKILLS.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !editForm.skills.includes(s)).slice(0, 10).map(s => (
                        <div key={s} onClick={() => addSkill(s)} style={{ padding: '0.8rem 1rem', cursor: 'pointer', transition: '0.2s' }} className="hover-bright">
                          {s}
                        </div>
                      ))}
                      <div onClick={() => addSkill(skillInput)} style={{ padding: '0.8rem 1rem', cursor: 'pointer', color: 'var(--cyan)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        Ajouter "{skillInput}" (personnalisé)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>URL GitHub</label>
                    <input className="u-input" placeholder="https://github.com/..." value={editForm.github_url} onChange={e => setEditForm({...editForm, github_url: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>URL LinkedIn</label>
                    <input className="u-input" placeholder="https://linkedin.com/in/..." value={editForm.linkedin_url} onChange={e => setEditForm({...editForm, linkedin_url: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white' }} />
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', border: '1px dashed rgba(239, 68, 68, 0.3)' }}>
                <label style={{ display: 'block', marginBottom: '1rem', fontSize: '1rem', color: 'white', fontWeight: 700 }}>Curriculum Vitae (PDF)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label className="btn-tab hover-scale" style={{ 
                        padding: '1rem', 
                        borderRadius: '12px', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        background: 'rgba(255,255,255,0.03)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '0.8rem',
                        cursor: 'pointer',
                        color: 'white',
                        fontWeight: 600,
                        transition: 'all 0.3s ease'
                    }}>
                        <Plus size={20} color="#ef4444" />
                        {editForm.cv ? editForm.cv.name : "Sélectionner mon CV (PDF)"}
                        <input 
                            type="file" 
                            accept=".pdf" 
                            onChange={e => setEditForm({...editForm, cv: e.target.files[0]})}
                            style={{ display: 'none' }} 
                        />
                    </label>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                        {profile.cv_path ? "Un CV est déjà en ligne. Le nouveau le remplacera." : "Format PDF suggéré, max 5 Mo."}
                    </p>
                </div>
              </div>

              <button className="btn-premium hover-scale" type="submit" style={{ padding: '1.2rem', marginTop: '1rem', fontSize: '1.1rem', fontWeight: 800, width: '100%', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
                SAUVEGARDER LES MODIFICATIONS
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Project/Contribution Modal */}
      {addProjectMode && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(15px)', padding: '1rem' }}>
          <div className="card-premium fade-up" style={{ width: '100%', maxWidth: '600px', border: '1px solid rgba(255,255,255,0.1)', padding: 0, background: 'rgba(23, 23, 23, 0.95)' }}>
             <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Propulser une <span className="gradient-text">Réalisation</span></h2>
                <button onClick={() => setAddProjectMode(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20}/></button>
            </div>
            
            <div style={{ padding: '1rem 2rem', display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <button 
                    onClick={() => setAddType('manual')} 
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: 'none', background: addType === 'manual' ? 'var(--cyan)' : 'rgba(255,255,255,0.05)', color: addType === 'manual' ? 'black' : 'white', fontWeight: 700, cursor: 'pointer', transition: '0.3s' }}
                >
                    Saisie Manuelle
                </button>
                <button 
                    onClick={() => setAddType('github')} 
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: 'none', background: addType === 'github' ? 'var(--cyan)' : 'rgba(255,255,255,0.05)', color: addType === 'github' ? 'black' : 'white', fontWeight: 700, cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    <Github size={18}/> Import GitHub
                </button>
            </div>

            {addType === 'manual' ? (
                <form onSubmit={handleProjectSave} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>Type de réalisation</label>
                        <select value={projectForm.type} onChange={e => setProjectForm({...projectForm, type: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white' }}>
                            <option value="Project" style={{color:'black'}}>Projet Technique</option>
                            <option value="Contribution" style={{color:'black'}}>Article / Contribution</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>Date de réalisation</label>
                        <input type="text" placeholder="Jan 2024" value={projectForm.date} onChange={e => setProjectForm({...projectForm, date: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white' }} />
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>Nom du Projet / Titre</label>
                    <input required placeholder="Ex: DevMaroc Platform V2" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>Description de l'impact</label>
                    <textarea required placeholder="Détaillez les défis techniques relevés..." value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} style={{ width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white', resize: 'vertical' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>Lien (GitHub, Démo, Article)</label>
                    <div style={{ position: 'relative' }}>
                    <LinkIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyan)' }}/>
                    <input type="url" placeholder="https://github.com/mohssinebaraou/..." value={projectForm.link} onChange={e => setProjectForm({...projectForm, link: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', color: 'white' }} />
                    </div>
                </div>
                <button className="btn-premium" type="submit" style={{ padding: '1.2rem', marginTop: '1rem', fontWeight: 800, fontSize: '1rem' }}>Publier sur mon Profil</button>
                </form>
            ) : (
                <form onSubmit={handleGithubImport} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <Github size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-dim)' }}>Entrez l'URL du dépôt pour importer automatiquement toutes les informations.</p>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>URL du Dépôt GitHub</label>
                        <div style={{ position: 'relative' }}>
                            <Github size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyan)' }}/>
                            <input required type="url" placeholder="https://github.com/mohssinebaraou/mon-projet" value={projectForm.link} onChange={e => setProjectForm({...projectForm, link: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', color: 'white' }} />
                        </div>
                    </div>
                    <button disabled={isImporting} className="btn-premium" type="submit" style={{ padding: '1.2rem', fontWeight: 800, fontSize: '1rem', opacity: isImporting ? 0.7 : 1 }}>
                        {isImporting ? 'Importation en cours...' : 'Lancer l\'importation automatique'}
                    </button>
                </form>
            )}
          </div>
        </div>
      )}

      {/* GitHub Preview Modal */}
      <GithubPreviewModal url={githubPreviewUrl} onClose={() => setGithubPreviewUrl(null)} />

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', padding: '1rem' }}>
            <div className="card-premium fade-up" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
                <div style={{ color: '#ef4444', marginBottom: '1.5rem' }}>
                    <Trash2 size={48} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Supprimer le projet ?</h3>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Cette action est irréversible. Voulez-vous vraiment continuer ?</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setProjectToDelete(null)} className="btn-tab" style={{ flex: 1, padding: '1rem' }}>Annuler</button>
                    <button onClick={handleDeleteProject} className="btn-premium" style={{ flex: 1, padding: '1rem', background: 'linear-gradient(135deg, #ef4444, #991b1b)' }}>Supprimer</button>
                </div>
            </div>
        </div>
      )}

      {/* Header Profile Advanced Design */}
      <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '3rem', borderRadius: '24px', position: 'relative' }}>
        {/* Cover Background with dynamic patterns */}
        <div style={{ height: '220px', background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', blur: '40px' }}></div>
        </div>
        
        {/* Profile Content */}
        <div style={{ padding: '0 3rem 2.5rem 3rem', position: 'relative' }}>
           {/* Avatar / Photo with Premium Glow */}
           <div style={{ width: '160px', height: '160px', borderRadius: '40px', background: 'var(--midnight)', padding: '8px', position: 'absolute', top: '-80px', left: '3rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', transform: 'rotate(-3deg)' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '32px', background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4.5rem', fontWeight: 900, color: 'white', textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                 {profile.name[0].toUpperCase()}
              </div>
              <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: '#CCFF00', color: 'black', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', transform: 'rotate(10deg)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>PRO</div>
           </div>

           {/* Actions / Meta Top */}
           <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1.5rem', minHeight: '80px', gap: '1rem' }}>
              {isOwner ? (
                <>
                    <Link href="/settings" className="btn-outline hover-scale" style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
                        <Settings size={18} style={{ marginRight: '0.5rem' }}/> Paramètres
                    </Link>
                    <button onClick={() => setEditMode(true)} className="btn-premium" style={{ borderRadius: '16px', padding: '0.8rem 1.5rem', fontWeight: 700 }}>
                        <Edit3 size={18} style={{ marginRight: '0.5rem' }}/> Éditer le Profil
                    </button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href={`/messages?user_id=${profile.id}`} className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', borderRadius: '16px', fontWeight: 700 }}>
                        <MessageSquare size={18}/> Message Privé
                    </Link>
                </div>
              )}
           </div>

           <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '0.5rem' }}>{profile.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ height: '2px', width: '30px', background: 'var(--cyan)' }}></div>
                    <p style={{ color: 'var(--cyan)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{profile.title}</p>
                </div>
                
                <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', color: 'var(--text-dim)', fontSize: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '12px' }}><MapPin size={18} color="#06B6D4" /> {profile.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(204, 255, 0, 0.05)', padding: '0.5rem 1rem', borderRadius: '12px', color: '#CCFF00', fontWeight: 700 }}><Star size={18} /> {profile.points} pts</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(139, 92, 246, 0.05)', padding: '0.5rem 1rem', borderRadius: '12px', color: '#A78BFA', fontWeight: 700 }}><Award size={18} /> Rang : {profile.level || 'Expert Tier'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button onClick={(e) => openGithubPreview(e, profile.github_url || 'https://github.com/mohssinebaraou')} className="hover-scale" style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}><Github size={22}/></button>
                  <a href={profile.linkedin_url || "#"} target={profile.linkedin_url ? "_blank" : "_self"} className="hover-scale" style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A66C2', border: '1px solid rgba(255,255,255,0.1)' }}><Linkedin size={22}/></a>
              </div>
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem' }} className="profile-responsive-layout">
         
         {/* Main Activity Area */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Bio with Modern Typography */}
            <section className="card-premium" style={{ borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, padding: '2rem', opacity: 0.03 }}><User size={120} /></div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                Manifeste <span className="gradient-text">Technique</span>
              </h2>
              <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>{profile.bio}</p>
            </section>

            {/* Projects & Contributions Re-Designed */}
            <section>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                 <h2 style={{ fontSize: '1.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                   Réalisations <span style={{ fontSize: '1rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.8rem', borderRadius: '10px' }}>{projects.length + contributions.length}</span>
                 </h2>
                 {isOwner && (
                   <button onClick={() => setAddProjectMode(true)} className="btn-premium hover-scale" style={{ padding: '0.7rem 1.5rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.6rem', borderRadius: '14px' }}>
                     <Plus size={18}/> Nouvelle Réalisation
                   </button>
                 )}
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 {(projects.length === 0 && contributions.length === 0) ? (
                   <div className="card-premium" style={{ textAlign: 'center', padding: '4rem 2rem', borderDash: '2px solid rgba(255,255,255,0.1)' }}>
                      <Briefcase size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                      <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Pas encore de projets partagés. C'est le moment de briller !</p>
                   </div>
                 ) : (
                   <>
                    {projects.map(p => (
                      <div key={p.id} className="card-premium hover-scale" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', transition: 'all 0.3s' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                 <span style={{ fontSize: '0.7rem', color: '#06B6D4', background: 'rgba(6, 182, 212, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '8px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>PROJET TECH</span>
                                 {p.project_date && <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>• {p.project_date}</span>}
                              </div>
                              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.8rem', color: 'white' }}>{p.name || p.title}</h3>
                              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{p.description}</p>
                              
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                {(p.github_url || p.link) && (
                                    <button onClick={(e) => openGithubPreview(e, p.github_url || p.link)} className="btn-outline hover-bright" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1.2rem', borderRadius: '12px', fontSize: '0.9rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <Github size={16}/> Voir Source
                                    </button>
                                )}
                                <a href="#" style={{ color: 'var(--text-dim)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                                    <MessageSquare size={16}/> {Math.floor(Math.random() * 10)} commentaires
                                </a>
                                
                                {isOwner && (
                                    <button 
                                       onClick={() => setProjectToDelete(p.id)} 
                                       style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(239, 68, 68, 0.5)', cursor: 'pointer', transition: '0.2s' }} 
                                       title="Supprimer ce projet"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                              </div>
                            </div>
                            <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Star size={32} color="#CCFF00" opacity={0.5} />
                            </div>
                         </div>
                      </div>
                    ))}

                    {contributions.map(c => (
                      <div key={c.id} className="card-premium hover-scale" style={{ padding: '2rem', background: 'rgba(139, 92, 246, 0.03)', border: '1px solid rgba(139, 92, 246, 0.1)', borderRadius: '20px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.7rem', color: '#A78BFA', background: 'rgba(167, 139, 250, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '8px', textTransform: 'uppercase', fontWeight: 800 }}>COMMUNAUTÉ</span>
                            {c.category && <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>• {c.category}</span>}
                         </div>
                         <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.8rem' }}>{c.name || c.title}</h3>
                         <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginBottom: '1.5rem' }}>{c.description || 'Contribution active aux échanges communautaires.'}</p>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {(c.github_url || c.link) && (
                               <button onClick={(e) => openGithubPreview(e, c.github_url || c.link)} style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                                   <LinkIcon size={16}/> Consulter la publication
                               </button>
                            )}
                            {isOwner && (
                               <button 
                                  onClick={() => setProjectToDelete(c.id)} 
                                  style={{ background: 'none', border: 'none', color: 'rgba(239, 68, 68, 0.5)', cursor: 'pointer' }}
                                  title="Supprimer cette contribution"
                               >
                                   <Trash2 size={18} />
                               </button>
                            )}
                         </div>
                      </div>
                    ))}
                   </>
                 )}
               </div>
            </section>
         </div>

         {/* Sidebar with Advanced Widgets */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* Skills Matrix */}
            <section className="card-premium" style={{ borderRadius: '24px' }}>
               <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 800 }}>Compétences <span className="gradient-text">Mastery</span></h3>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                 {(profile.skills || []).length > 0 ? (profile.skills || []).map((skill, index) => (
                   <span key={index} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem 1.2rem', borderRadius: '14px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', transition: '0.2s' }} className="hover-bright">
                     {skill}
                   </span>
                 )) : <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>En attente de stack technique...</span>}
               </div>
            </section>

            {/* CV Widget (New) */}
            <section className="card-premium" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), transparent)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
               <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <LinkIcon size={20} color="#ef4444" /> Curriculum Vitae
               </h3>
               {profile.cv_path ? (
                 <a href={`/storage/${profile.cv_path}`} target="_blank" rel="noreferrer" className="btn-premium" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#ef4444', border: 'none' }}>
                    Télécharger le CV (PDF)
                 </a>
               ) : (
                 <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>Aucun CV disponible pour ce profil.</p>
                    {isOwner && <button onClick={() => setEditMode(true)} style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Ajouter mon CV</button>}
                 </div>
               )}
            </section>

            {/* User Statistics Card */}
            <section className="card-premium" style={{ borderRadius: '24px', background: 'rgba(255,255,255,0.01)' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 800 }}>Performance</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Projets Validés</span>
                        <span style={{ color: 'white', fontWeight: 900 }}>{projects.length}</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                        <div style={{ width: `${Math.min(projects.length * 20, 100)}%`, height: '100%', background: 'var(--cyan)', borderRadius: '2px', boxShadow: '0 0 10px var(--cyan)' }}></div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Score Communauté</span>
                        <span style={{ color: '#CCFF00', fontWeight: 900 }}>{profile.points}</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                        <div style={{ width: `${Math.min(profile.points / 10, 100)}%`, height: '100%', background: '#CCFF00', borderRadius: '2px', boxShadow: '0 0 10px #CCFF00' }}></div>
                    </div>
                </div>
            </section>

            {/* Achievements Snippet */}
            <section className="card-premium" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent)' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 800 }}>Badges</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div title="Pionnier" style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(0,217,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)' }}><Star size={24}/></div>
                    <div title="Contributeur Or" style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(204,255,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CCFF00' }}><Award size={24}/></div>
                    <div title="Top Développeur" style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA' }}><Briefcase size={24}/></div>
                </div>
            </section>
         </div>
         
      </div>

      <style>{`
        .hover-scale { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .hover-scale:hover { transform: scale(1.02); }
        .hover-bright:hover { filter: brightness(1.2); cursor: pointer; }
        
        @media (max-width: 992px) {
          .profile-responsive-layout {
            grid-template-columns: 1fr !important;
          }
        }
        
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease-out forwards; }
      `}</style>
      <Toast toast={toast} onClose={() => setToast(null)}/>
    </div>
  );
};

ProfilePage.layout = page => <MainLayout>{page}</MainLayout>;

export default ProfilePage;
