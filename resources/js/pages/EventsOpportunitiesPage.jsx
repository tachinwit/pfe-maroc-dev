import React, { useState } from 'react';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Calendar, Briefcase, MapPin, Clock, Users, User, Tag, Search, ExternalLink, PlusCircle, CheckCircle, ArrowRight, ChevronRight, Trash2, FileText, Download } from 'lucide-react';
import Toast from '../Components/common/Toast';

/**
 * EventsOpportunitiesPage - Displays upcoming events and job opportunities.
 * Features tab switching and client-side filtering.
 */
const EventsOpportunitiesPage = () => {
  const { events, events_db, opportunities, opportunities_db, applied_opp_ids, flash, auth } = usePage().props;
  const [activeTab, setActiveTab] = useState('events');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localToast, setLocalToast] = useState(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const isAdmin = auth?.user?.is_admin || auth?.user?.is_admin === 1 || auth?.user?.is_admin === "1";

  const { data, setData, post, processing, reset: resetForm, errors } = useForm({
      title: '', type: 'Conférence', date: '', location: ''
  });

  const [showCreateOppModal, setShowCreateOppModal] = useState(false);
  const { data: oppData, setData: setOppData, post: postOpp, processing: oppProcessing, reset: resetOppForm, errors: oppErrors } = useForm({
      title: '', company: '', location: '', type: 'CDI', description: '', salary: ''
  });

  const allEvents = [
    ...(Array.isArray(events_db) ? events_db : []),
    ...(Array.isArray(events) ? events : [])
  ];

  const eventTypes = [
    { id: 'all',        name: 'Tous' },
    { id: 'Hackathon',  name: 'Hackathons' },
    { id: 'Meetup',     name: 'Meetups' },
    { id: 'Workshop',   name: 'Workshops' },
    { id: 'Conférence', name: 'Conférences' },
  ];

  const filteredEvents = (allEvents || []).filter(e => 
    (selectedFilter === 'all' || e.type === selectedFilter) &&
    (!searchQuery || (e.title && e.title.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const oppsList = Array.isArray(opportunities_db) ? opportunities_db : (Array.isArray(opportunities) ? opportunities : []);
  const filteredOpps = oppsList.filter(o =>
    !searchQuery || 
    (o.title && o.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (o.company && o.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleParticipate = (eventId) => {
      // Allow participating even in mock events natively
      const idToSubmit = eventId.toString().replace('db_', '');
      router.post('/events/participate', { event_id: idToSubmit }, {
          preserveScroll: true,
          onSuccess: (page) => {
              if (page.props.flash?.success) {
                  setLocalToast({ message: page.props.flash.success, points: '+20 pts' });
              } else if (page.props.flash?.info) {
                  setLocalToast({ message: page.props.flash.info, points: null });
              }
          }
      });
  };

  const handleCreateEvent = (e) => {
      e.preventDefault();
      post('/events/create', {
          preserveScroll: true,
          onSuccess: () => {
              setShowCreateModal(false);
              resetForm();
              setLocalToast({ message: 'Événement créé avec succès !', points: null });
          },
          onError: (errors) => {
              console.error("Erreur création événement:", errors);
              setLocalToast({ message: 'Erreur lors de la création de l\'événement.', points: null });
          }
      });
  }

  const handleDeleteEvent = (eventId) => {
    setEventToDelete(eventId);
  };

  const confirmDelete = () => {
    if (!eventToDelete) return;
    const id = eventToDelete.toString().replace('db_', '');
    router.delete(`/events/${id}`, {
        onSuccess: () => {
            setEventToDelete(null);
            setLocalToast({ message: 'Événement supprimé !', points: null });
        },
        onError: () => {
            setLocalToast({ message: 'Erreur lors de la suppression.', points: null });
        }
    });
  };

  const handleCreateOpp = (e) => {
      e.preventDefault();
      postOpp('/opportunities/create', {
          preserveScroll: true,
          onSuccess: () => {
              setShowCreateOppModal(false);
              resetOppForm();
              setLocalToast({ message: 'Opportunité créée avec succès !', points: null });
          },
          onError: (errors) => {
              console.error("Erreur création opportunité:", errors);
              setLocalToast({ message: 'Erreur lors de la publication.', points: null });
          }
      });
  };

  const handleApplyOpp = (oppId, companyName) => {
      router.post(`/opportunities/${oppId}/apply`, {}, {
          preserveScroll: true,
          onSuccess: (page) => {
              if (page.props.flash?.success) {
                  setLocalToast({ message: page.props.flash.success, points: '+10 pts' });
              }
          }
      });
  };

  return (
    <div className="container-center" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Head title="Événements & Opportunités" />
      <Toast toast={localToast} onClose={() => setLocalToast(null)} />
      
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(0, 217, 255, 0.1)', color: 'var(--cyan)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid rgba(0, 217, 255, 0.2)' }}>
          🎯 NOUVELLES OPPORTUNITÉS CHAQUE JOUR
        </div>
        <h1 className="section-title" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Événements & <span className="gradient-text">Opportunités</span>
        </h1>
        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          Participez aux événements tech, rencontrez la communauté et découvrez les meilleures opportunités de carrière au Maroc et à l'international.
        </p>

        {/* Tabs Control */}
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <button 
            className="btn-tab"
            style={{ 
              background: activeTab === 'events' ? 'linear-gradient(135deg, rgba(88, 28, 135, 0.8), rgba(59, 130, 246, 0.8))' : 'transparent',
              color: activeTab === 'events' ? 'white' : 'var(--text-dim)',
              padding: '0.8rem 2rem',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }} 
            onClick={() => setActiveTab('events')}
          >
            <Calendar size={20}/> Événements
          </button>
          <button 
            className="btn-tab"
            style={{ 
              background: activeTab === 'opportunities' ? 'linear-gradient(135deg, rgba(88, 28, 135, 0.8), rgba(59, 130, 246, 0.8))' : 'transparent',
              color: activeTab === 'opportunities' ? 'white' : 'var(--text-dim)',
              padding: '0.8rem 2rem',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }} 
            onClick={() => setActiveTab('opportunities')}
          >
            <Briefcase size={20}/> Opportunités
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {activeTab === 'events' ? (
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="hide-scroll">
              {eventTypes.map(t => (
                <button 
                  key={t.id} 
                  onClick={()=>setSelectedFilter(t.id)}
                  style={{ 
                    background: selectedFilter === t.id ? 'rgba(0, 217, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: selectedFilter === t.id ? 'var(--cyan)' : 'var(--text-dim)',
                    border: `1px solid ${selectedFilter === t.id ? 'var(--cyan)' : 'rgba(255,255,255,0.1)'}`,
                    padding: '0.5rem 1.2rem',
                    borderRadius: '20px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          ) : (
             <div style={{ flex: 1 }}></div> // Spacer for opportunities tab
          )}
          
          <div style={{ position: 'relative', minWidth: '300px' }}>
            <Search size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder={activeTab==='events' ? "Rechercher un événement..." : "Rechercher une opportunité..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1rem' }}
            />
          </div>
        </div>
      </div>

      {isAdmin && activeTab === 'events' && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <button onClick={() => setShowCreateModal(true)} className="btn-premium hover-scale" style={{ padding: '0.8rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PlusCircle size={20} /> Créer un Événement
              </button>
          </div>
      )}

      {isAdmin && activeTab === 'opportunities' && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <button onClick={() => setShowCreateOppModal(true)} className="btn-premium hover-scale" style={{ padding: '0.8rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.8), rgba(59, 130, 246, 0.8))' }}>
                  <Briefcase size={20} /> Créer une Opportunité
              </button>
          </div>
      )}

      {/* Détails de l'événement Modal */}
      {selectedEvent && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(10px)' }}>
              <div className="card-premium fade-in" style={{ width: '100%', maxWidth: '700px', background: 'var(--bg-card)', position: 'relative', padding: 0, overflow: 'hidden' }}>
                  <button onClick={() => setSelectedEvent(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>X</button>
                  
                  <div style={{ height: '250px', position: 'relative' }}>
                    {selectedEvent.image ? (
                        <img src={selectedEvent.image} alt={selectedEvent.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--indigo), var(--cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Calendar size={64} color="white" opacity={0.3} />
                        </div>
                    )}
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem' }}>
                        <span style={{ background: 'var(--cyan)', color: 'black', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>{selectedEvent.type}</span>
                    </div>
                  </div>

                  <div style={{ padding: '2rem' }}>
                      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>{selectedEvent.title}</h2>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                              <div style={{ background: 'rgba(0,217,255,0.1)', padding: '0.8rem', borderRadius: '12px' }}><Calendar size={20} color="var(--cyan)"/></div>
                              <div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Date</div>
                                  <div style={{ fontWeight: 600 }}>{selectedEvent.date}</div>
                              </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                              <div style={{ background: 'rgba(139,92,246,0.1)', padding: '0.8rem', borderRadius: '12px' }}><MapPin size={20} color="var(--indigo)"/></div>
                              <div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Lieu</div>
                                  <div style={{ fontWeight: 600 }}>{selectedEvent.location}</div>
                              </div>
                          </div>
                      </div>

                      <div style={{ marginBottom: '2rem' }}>
                          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>À propos de cet événement</h3>
                          <p style={{ color: 'var(--text-dim)', lineHeight: 1.6 }}>{selectedEvent.description || "Rejoignez-nous pour cet événement exceptionnel organisé par la communauté DevMaroc. Une occasion unique de réseauter et d'apprendre."}</p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                             <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>
                                {selectedEvent.organizer?.name?.[0].toUpperCase() || 'O'}
                             </div>
                             <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Organisé par</div>
                                <div style={{ fontWeight: 700 }}>{selectedEvent.organizer?.name || 'Organisateur'}</div>
                             </div>
                          </div>
                          
                          {!isAdmin && (
                              <button onClick={() => { handleParticipate(selectedEvent.id); setSelectedEvent(null); }} className="btn-premium" style={{ padding: '0.8rem 2rem' }}>S'inscrire</button>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Modal de Confirmation de Suppression */}
      {eventToDelete && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(5px)' }}>
              <div className="card-premium fade-in" style={{ width: '100%', maxWidth: '400px', background: 'var(--bg-card)', padding: '2rem', textAlign: 'center' }}>
                  <div style={{ color: '#ff4d4d', marginBottom: '1.5rem' }}>
                      <Trash2 size={48} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Supprimer l'événement ?</h3>
                  <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
                      Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cet événement ?
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button 
                        onClick={() => setEventToDelete(null)} 
                        className="btn-tab" 
                        style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', flex: 1 }}
                      >
                          Annuler
                      </button>
                      <button 
                        onClick={confirmDelete} 
                        className="btn-premium" 
                        style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', flex: 1, background: 'linear-gradient(135deg, #ef4444, #991b1b)' }}
                      >
                          Supprimer
                      </button>
                  </div>
              </div>
          </div>
      )}

      {showCreateModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <div className="card-premium fade-in" style={{ width: '100%', maxWidth: '500px', background: 'var(--bg-card)', position: 'relative' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Nouvel Événement</h3>
                  <button onClick={() => setShowCreateModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>X</button>
                  
                  <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Titre</label>
                          <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="u-input" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: errors.title ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', color: 'white' }} />
                          {errors.title && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.title}</div>}
                      </div>
                      <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Type</label>
                          <select value={data.type} onChange={e => setData('type', e.target.value)} className="u-input" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: errors.type ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', color: 'white' }}>
                              <option value="Conférence" style={{ color: 'black' }}>Conférence</option>
                              <option value="Meetup" style={{ color: 'black' }}>Meetup</option>
                              <option value="Webinar" style={{ color: 'black' }}>Webinar</option>
                              <option value="Hackathon" style={{ color: 'black' }}>Hackathon</option>
                          </select>
                          {errors.type && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.type}</div>}
                      </div>
                      <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Date de l'événement</label>
                          <input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            max={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]}
                            value={data.date} 
                            onChange={e => setData('date', e.target.value)} 
                            className="u-input" 
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: errors.date ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', color: 'white' }} 
                          />
                          {errors.date && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.date}</div>}
                      </div>
                      <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Lieu</label>
                          <input type="text" value={data.location} onChange={e => setData('location', e.target.value)} className="u-input" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: errors.location ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', color: 'white' }} />
                          {errors.location && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.location}</div>}
                      </div>
                      <button type="submit" disabled={processing} className="btn-premium" style={{ marginTop: '1rem', padding: '1rem' }}>
                          {processing ? 'Création...' : 'Créer l\'événement'}
                      </button>
                  </form>
              </div>
          </div>
      )}

      {showCreateOppModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <div className="card-premium fade-in" style={{ width: '100%', maxWidth: '500px', background: 'var(--bg-card)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Nouvelle Opportunité</h3>
                  <button onClick={() => setShowCreateOppModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>X</button>
                  
                  <form onSubmit={handleCreateOpp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Titre du poste</label>
                          <input type="text" value={oppData.title} onChange={e => setOppData('title', e.target.value)} className="u-input" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: oppErrors.title ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', color: 'white' }} />
                          {oppErrors.title && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>{oppErrors.title}</div>}
                      </div>
                      <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Entreprise</label>
                          <input type="text" value={oppData.company} onChange={e => setOppData('company', e.target.value)} className="u-input" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: oppErrors.company ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', color: 'white' }} />
                          {oppErrors.company && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>{oppErrors.company}</div>}
                      </div>
                      <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Type</label>
                          <select value={oppData.type} onChange={e => setOppData('type', e.target.value)} className="u-input" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: oppErrors.type ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', color: 'white' }}>
                              <option value="CDI" style={{ color: 'black' }}>CDI</option>
                              <option value="CDD" style={{ color: 'black' }}>CDD</option>
                              <option value="Stage" style={{ color: 'black' }}>Stage</option>
                              <option value="Freelance" style={{ color: 'black' }}>Freelance</option>
                          </select>
                          {oppErrors.type && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>{oppErrors.type}</div>}
                      </div>
                      <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Lieu (ex: Casablanca, Remote)</label>
                          <input type="text" value={oppData.location} onChange={e => setOppData('location', e.target.value)} className="u-input" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: oppErrors.location ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', color: 'white' }} />
                          {oppErrors.location && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>{oppErrors.location}</div>}
                      </div>
                      <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Description</label>
                          <textarea value={oppData.description} onChange={e => setOppData('description', e.target.value)} className="u-input" style={{ width: '100%', minHeight: '80px', background: 'rgba(255,255,255,0.05)', border: oppErrors.description ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', color: 'white' }}></textarea>
                          {oppErrors.description && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>{oppErrors.description}</div>}
                      </div>
                      <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Salaire (Optionnel)</label>
                          <input type="text" value={oppData.salary} onChange={e => setOppData('salary', e.target.value)} className="u-input" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: oppErrors.salary ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', color: 'white' }} />
                          {oppErrors.salary && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>{oppErrors.salary}</div>}
                      </div>
                      <button type="submit" disabled={oppProcessing} className="btn-premium" style={{ marginTop: '1rem', padding: '1rem' }}>
                          {oppProcessing ? 'Création...' : 'Publier l\'opportunité'}
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* Main Content Area */}
      <div>
        {activeTab === 'events' ? (
          (!Array.isArray(allEvents) || allEvents.length === 0) ? (
            <div className="card-premium" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
               <Calendar size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-dim)', opacity: 0.5 }} />
               <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Aucun événement disponible</h3>
               <p style={{ color: 'var(--text-dim)' }}>Revenez plus tard pour de nouveaux événements !</p>
            </div>
          ) : (
            <div className="grid-features" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
              {filteredEvents.map(event => (
                <div key={event.id} className="card-premium hover-scale flex flex-col h-full" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: '180px', background: 'rgba(255,255,255,0.05)' }}>
                    {event.image ? (
                      <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(45deg, rgba(88,28,135,0.3), rgba(59,130,246,0.3))' }}>
                        <Calendar size={48} opacity={0.2} color="white" />
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--indigo)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      {event.type}
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.4 }}>{event.title}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} color="var(--indigo)"/><span>{event.date}</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} color="var(--cyan)"/><span>{event.location}</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={16} color="#F59E0B"/><span>{event.attendees_count ?? 0} participants</span></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setSelectedEvent(event)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>Détails</button>
                        
                        {(usePage().props.participated_events || []).includes(event.id.toString().replace('db_', '')) && (
                          <a 
                            href={`/events/${event.id.toString().replace('db_', '')}/receipt`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              background: 'rgba(0, 217, 255, 0.1)', 
                              border: '1px solid rgba(0, 217, 255, 0.2)', 
                              color: 'var(--secondary)', 
                              padding: '0.5rem 1rem', 
                              borderRadius: '8px', 
                              fontSize: '0.85rem', 
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              fontWeight: 600 
                            }}
                          >
                            <Download size={14} /> Reçu
                          </a>
                        )}
                      </div>
                      
                      {!isAdmin ? (
                        <button onClick={() => handleParticipate(event.id)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                           {(usePage().props.participated_events || []).includes(event.id.toString().replace('db_', '')) ? (
                             <CheckCircle size={24} style={{ color: '#10B981' }} />
                           ) : (
                             <PlusCircle size={24} style={{ transition: 'color 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.color='var(--cyan)'} onMouseOut={(e)=>e.currentTarget.style.color='var(--text-main)'}/>
                           )}
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                          <button 
                            onClick={() => router.get(`/events/${event.id.toString().replace('db_', '')}/participants`)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="Voir les participants"
                          >
                             <Users size={20} />
                          </button>
                          <button onClick={() => handleDeleteEvent(event.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Trash2 size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          filteredOpps.length === 0 ? (
            <div className="card-premium" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
               <Briefcase size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-dim)', opacity: 0.5 }} />
               <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Aucune opportunité disponible</h3>
               <p style={{ color: 'var(--text-dim)' }}>Revenez plus tard pour de nouvelles opportunités !</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredOpps.map(opp => (
                <div key={opp.id} className="card-premium hover-scale" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                  
                  <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: opp.logo ? 'white' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: opp.logo ? '0' : '1.5rem' }}>
                    {opp.logo ? <img src={opp.logo} alt={opp.company} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Briefcase size={32} color="var(--text-dim)" />}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                       <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{opp.title}</h3>
                       <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(0, 217, 255, 0.1)', color: 'var(--cyan)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{opp.type}</span>
                    </div>
                    <p style={{ color: 'var(--text-dim)', fontWeight: 600, marginBottom: '0.8rem', fontSize: '1rem' }}>{opp.company}</p>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-dim)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14}/> {opp.location}</span>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14}/> {opp.experience || 'Tous types'}</span>
                       {opp.salary && <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981' }}><Tag size={14}/> {opp.salary}</span>}
                    </div>
                  </div>
                  
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
                     {applied_opp_ids?.includes(opp.id) ? (
                        <button disabled style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', fontWeight: 600 }}>
                           <CheckCircle size={16}/> Déjà postulé
                        </button>
                     ) : !isAdmin ? (
                        <button onClick={() => handleApplyOpp(opp.id, opp.company)} className="btn-premium hover-scale" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem' }}>Postuler <ArrowRight size={16}/></button>
                     ) : null}

                     {auth?.user?.is_admin && (
                        <button 
                            onClick={() => router.get(`/opportunities/${opp.id}/applicants`)}
                            className="btn-tab" 
                            style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            title="Voir les candidats"
                        >
                            <Users size={20}/>
                        </button>
                     )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

EventsOpportunitiesPage.layout = page => <MainLayout>{page}</MainLayout>;

export default EventsOpportunitiesPage;

