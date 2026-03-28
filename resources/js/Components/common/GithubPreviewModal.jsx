import React, { useState, useEffect } from 'react';
import { Github, X, ExternalLink, Star, GitFork, MapPin, Users, BookOpen, Code, Loader2 } from 'lucide-react';
import axios from 'axios';

const GithubPreviewModal = ({ url, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (url) {
      fetchPreviewData();
    } else {
      setData(null);
      setError(null);
    }
  }, [url]);

  const fetchPreviewData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/projects/preview?url=${encodeURIComponent(url)}`);
      setData(response.data);
    } catch (err) {
      console.error("GitHub Preview Error:", err);
      setError(err.response?.data?.error || "Impossible de charger l'aperçu.");
    } finally {
      setLoading(false);
    }
  };

  if (!url) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', padding: '1.5rem' }}>
      <div className="card-premium fade-up" style={{ width: '100%', height: '100%', maxWidth: '1000px', maxHeight: '800px', border: '1px solid rgba(255,255,255,0.1)', padding: 0, display: 'flex', flexDirection: 'column', background: '#0d1117', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        
        {/* Header */}
        <div style={{ padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#161b22' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
            <Github size={24} color="white" />
            <span style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', opacity: 0.7 }}>{url}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <a href={url} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <ExternalLink size={16}/> Voir sur GitHub
            </a>
            <button onClick={onClose} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20}/></button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-dim)' }}>
                <Loader2 size={40} className="spin" style={{ color: 'var(--cyan)' }} />
                <p>Synchronisation avec GitHub en cours...</p>
            </div>
          ) : error ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1.5rem' }}>
                <div style={{ padding: '2rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '50%' }}>
                    <Github size={60} style={{ opacity: 0.2 }} />
                </div>
                <div>
                    <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem' }}>Oups ! {error}</h3>
                    <p style={{ color: 'var(--text-dim)', maxWidth: '400px' }}>Le dépôt est peut-être privé ou l'URL est incorrecte. GitHub ne nous autorise pas à l'afficher dans un cadre direct.</p>
                </div>
                <a href={url} target="_blank" rel="noreferrer" className="btn-premium" style={{ padding: '1rem 2rem', borderRadius: '12px' }}>Ouvrir le lien externe</a>
            </div>
          ) : data ? (
            <div className="fade-in">
              {data.type === 'repo' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Repo Header */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cyan)', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                            <BookOpen size={16}/> Dépôt Public
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>{data.data.name}</h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '2rem' }}>{data.data.description || "Aucune description fournie."}</p>
                        
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffd700', background: 'rgba(255, 215, 0, 0.05)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 215, 0, 0.1)' }}>
                                <Star size={18}/> <strong>{data.data.stars}</strong> stars
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <GitFork size={18}/> <strong>{data.data.forks}</strong> forks
                            </div>
                            {data.data.language && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cyan)', background: 'rgba(0, 217, 255, 0.05)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(0, 217, 255, 0.1)' }}>
                                    <Code size={18}/> <strong>{data.data.language}</strong>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Readme Preview */}
                    <div style={{ marginTop: '1rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={20}/> README.md (Aperçu)
                        </h3>
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto', fontFamily: 'monospace' }}>
                            {data.data.readme || "Le README n'est pas disponible pour ce dépôt."}
                        </div>
                    </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {/* User Header */}
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                        <img src={data.data.avatar_url} style={{ width: '120px', height: '120px', borderRadius: '24px', border: '4px solid rgba(255,255,255,0.05)' }} alt="GitHub Avatar" />
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>{data.data.name}</h2>
                            <p style={{ fontSize: '1.2rem', color: 'var(--cyan)', marginBottom: '1rem', fontWeight: 600 }}>@{data.data.login}</p>
                            <p style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{data.data.bio || "Developpeur passionné sur GitHub."}</p>
                            
                            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={16}/> <strong>{data.data.followers}</strong> followers</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16}/> {data.data.location || 'Monde'}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><BookOpen size={16}/> <strong>{data.data.public_repos}</strong> repos</span>
                            </div>
                        </div>
                    </div>

                    {/* Popular Repos */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '1.2rem' }}>Dépôts populaires</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {data.data.recent_repos?.map(repo => (
                                <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                    <div className="hover-scale" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.2rem', transition: '0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4 style={{ color: 'white', fontWeight: 700, margin: 0 }}>{repo.name}</h4>
                                            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.3rem' }}>{repo.description || "Pas de description."}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Star size={14}/> {repo.stargazers_count}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Code size={14}/> {repo.language}</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div style={{ padding: '1.5rem 2rem', background: '#161b22', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center' }}>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', margin: 0, opacity: 0.5 }}>Données récupérées en temps réel via l'API GitHub v3</p>
        </div>
      </div>
    </div>
  );
};

export default GithubPreviewModal;
