import React, { useState } from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Calendar, Briefcase, MapPin, Clock, Users, Tag, Search, ExternalLink, PlusCircle, CheckCircle2, ArrowRight, Code } from 'lucide-react';

/**
 * EventsOpportunitiesPage - Displays upcoming events and job opportunities.
 * Features tab switching and client-side filtering.
 */
const EventsOpportunitiesPage = () => {
  const { events_db, opportunities_db } = usePage().props;
  const [activeTab, setActiveTab] = useState('events');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const eventTypes = [
    { id: 'all',        name: 'Tous' },
    { id: 'Hackathon',  name: 'Hackathons' },
    { id: 'Meetup',     name: 'Meetups' },
    { id: 'Workshop',   name: 'Workshops' },
    { id: 'Conférence', name: 'Conférences' },
  ];

  const filteredEvents = (events_db ?? []).filter(e => {
    const matchType = selectedFilter === 'all' || e.type === selectedFilter;
    const matchSearch = !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const filteredOpps = (opportunities_db ?? []).filter(o =>
    !searchQuery || o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="events-opportunities-page">
      <Head title="Événements & Opportunités" />
      
      <div className="hero-header">
        <div className="hero-content">
          <div className="hero-badge">🎯 NOUVELLES OPPORTUNITÉS CHAQUE JOUR</div>
          <h1>Événements & Opportunités</h1>
          <p className="hero-subtitle">
            Participez aux événements tech et découvrez les meilleures opportunités au Maroc
          </p>
          <div className="tabs-container">
            <button className={`tab ${activeTab==='events'?'active':''}`} onClick={() => setActiveTab('events')}>
              <Calendar size={20}/> Événements
            </button>
            <button className={`tab ${activeTab==='opportunities'?'active':''}`} onClick={() => setActiveTab('opportunities')}>
              <Briefcase size={20}/> Opportunités
            </button>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filters-content">
          {activeTab === 'events' && (
            <div className="filter-chips">
              {eventTypes.map(t => (
                <button key={t.id} className={`filter-chip ${selectedFilter===t.id?'active':''}`} onClick={()=>setSelectedFilter(t.id)}>
                  {t.name}
                </button>
              ))}
            </div>
          )}
          <div className="search-box">
            <Search className="search-icon-pos" size={18}/>
            <input
              type="text"
              className="search-input"
              placeholder={activeTab==='events' ? "Rechercher un événement..." : "Rechercher une opportunité..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="main-content">
        {activeTab === 'events' ? (
          filteredEvents.length === 0 ? (
            <div className="empty-state">Aucun événement disponible pour l'instant.</div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map(event => (
                <div key={event.id} className={`event-card ${event.featured?'featured':''}`}>
                  <div className="h-48 bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center rounded-t-lg relative">
                    <Code size={64} className="text-white" />
                    <div className="event-type-badge">{event.type}</div>
                  </div>
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <div className="event-meta">
                      <div className="meta-row"><Calendar size={18}/><span>{event.date}</span></div>
                      <div className="meta-row"><MapPin size={18}/><span>{event.location}</span></div>
                      <div className="meta-row"><Users size={18}/><span>{event.attendees_count ?? 0} participants</span></div>
                    </div>
                    <div className="event-footer">
                      <span className="organizer-name">{event.organizer?.name || 'Organisateur'}</span>
                      <button className="btn-icon"><PlusCircle size={16}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          filteredOpps.length === 0 ? (
            <div className="empty-state">Aucune opportunité disponible pour l'instant.</div>
          ) : (
            <div className="opportunities-list">
              {filteredOpps.map(opp => (
                <div key={opp.id} className={`opportunity-card ${opp.featured?'featured':''}`}>
                  <div className="opportunity-logo-box">
                    {opp.logo ? <img src={opp.logo} alt={opp.company} /> : <div className="logo-placeholder" />}
                  </div>
                  <div className="opportunity-content">
                    <div className="opp-header">
                       <h3>{opp.title}</h3>
                       <span className="opp-type-badge">{opp.type}</span>
                    </div>
                    <p className="opp-company">{opp.company}</p>
                    <div className="opp-details">
                       <span><MapPin size={14}/> {opp.location}</span>
                       <span><Clock size={14}/> {opp.experience || 'Tous types'}</span>
                       {opp.salary && <span><Tag size={14}/> {opp.salary}</span>}
                    </div>
                  </div>
                  <button className="btn btn-primary-sm">Postuler <ArrowRight size={16}/></button>
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
