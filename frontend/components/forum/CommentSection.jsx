import React, { useState } from 'react';
import { useForm, usePage } from '../inertia-shim';
import {
  MessageSquare, Send, ThumbsUp, CheckCircle,
  ChevronDown, ChevronUp, Award
} from 'lucide-react';
import Toast from './toast';

/**
 * Utilisation dans ForumPage ou une page de détail de post :
 *
 * import CommentSection from '@/components/CommentSection';
 *
 * <CommentSection post={post} />
 *
 * Le composant attend :
 *   post.id          — id du post
 *   post.answers     — tableau de réponses (depuis le backend)
 *   post.user        — auteur du post
 */

const CommentSection = ({ post }) => {
  const { auth } = usePage().props;
  const [expanded, setExpanded]   = useState(true);
  const [toast, setToast]         = useState(null);

  const answers = post?.answers ?? [];

  // ── Formulaire Inertia ────────────────────────────────────────────────────
  const { data, setData, post: submitAnswer, processing, errors, reset } = useForm({
    content: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    submitAnswer(`/forum/posts/${post.id}/answers`, {
      onSuccess: () => {
        reset();
        setToast({ points: 5, message: 'Réponse publiée !' });
      },
    });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Fira+Code:wght@400&display=swap');

        .comment-section {
          font-family: 'Manrope', sans-serif;
          margin-top: 2rem;
        }

        /* ── Header ── */
        .cs-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.2rem 1.5rem;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 14px 14px 0 0;
          cursor: pointer; transition: background .2s;
        }
        .cs-header:hover { background: rgba(255,255,255,.06); }

        .cs-header-left {
          display: flex; align-items: center; gap: .75rem;
          color: #fff; font-weight: 700; font-size: 1rem;
        }
        .cs-count {
          padding: .25rem .7rem;
          background: rgba(0,217,255,.15);
          border: 1px solid rgba(0,217,255,.3);
          border-radius: 20px;
          color: #00D9FF; font-size: .8rem; font-weight: 700;
        }

        /* ── Body ── */
        .cs-body {
          border: 1px solid rgba(255,255,255,.1);
          border-top: none;
          border-radius: 0 0 14px 14px;
          overflow: hidden;
        }

        /* ── Answer list ── */
        .answer-item {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,.07);
          transition: background .2s;
          position: relative;
        }
        .answer-item:last-of-type { border-bottom: none; }
        .answer-item:hover { background: rgba(255,255,255,.02); }

        .answer-item.accepted {
          background: rgba(16,185,129,.05);
          border-left: 3px solid #10B981;
        }

        .accepted-badge {
          display: inline-flex; align-items: center; gap: .4rem;
          padding: .3rem .8rem;
          background: rgba(16,185,129,.15);
          border: 1px solid rgba(16,185,129,.3);
          border-radius: 20px;
          color: #10B981; font-size: .78rem; font-weight: 700;
          margin-bottom: .75rem;
        }

        .answer-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: .75rem;
        }

        .answer-author {
          display: flex; align-items: center; gap: .75rem;
        }

        .author-avatar {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #4B0082, #00D9FF);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: .9rem; color: #fff; flex-shrink: 0;
        }

        .author-name  { font-weight: 600; color: #fff; font-size: .9rem; }
        .answer-time  { font-size: .78rem; color: rgba(255,255,255,.4); margin-top: .1rem; }

        .answer-points {
          font-size: .82rem; font-weight: 700;
          color: #CCFF00;
        }

        .answer-content {
          color: rgba(255,255,255,.82);
          line-height: 1.75; font-size: .95rem;
          margin-bottom: 1rem;
        }

        .answer-actions {
          display: flex; gap: .75rem;
        }

        .action-btn {
          display: flex; align-items: center; gap: .4rem;
          padding: .4rem .9rem;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 8px;
          color: rgba(255,255,255,.6); font-size: .82rem; font-weight: 600;
          cursor: pointer; font-family: 'Manrope', sans-serif;
          transition: all .2s;
        }
        .action-btn:hover { background: rgba(255,255,255,.09); border-color: #00D9FF; color: #00D9FF; }

        /* ── Empty state ── */
        .cs-empty {
          padding: 3rem 2rem; text-align: center;
          color: rgba(255,255,255,.4); font-size: .95rem;
        }
        .cs-empty-icon { font-size: 2.5rem; margin-bottom: .75rem; }

        /* ── Form ── */
        .cs-form-wrapper {
          padding: 1.5rem;
          background: rgba(255,255,255,.03);
          border-top: 1px solid rgba(255,255,255,.08);
        }

        .cs-form-title {
          font-weight: 700; font-size: .95rem; color: rgba(255,255,255,.8);
          margin-bottom: 1rem;
          display: flex; align-items: center; gap: .5rem;
        }

        .cs-textarea {
          width: 100%;
          padding: 1rem 1.2rem;
          background: rgba(255,255,255,.06);
          border: 2px solid rgba(255,255,255,.1);
          border-radius: 12px;
          color: #fff; font-size: .95rem;
          font-family: 'Manrope', sans-serif;
          line-height: 1.6; resize: vertical; min-height: 110px;
          outline: none; transition: all .3s;
        }
        .cs-textarea:focus {
          border-color: #00D9FF;
          background: rgba(255,255,255,.08);
          box-shadow: 0 0 0 4px rgba(0,217,255,.08);
        }
        .cs-textarea::placeholder { color: rgba(255,255,255,.3); }
        .cs-textarea.error { border-color: #EF4444; }

        .field-error {
          color: #EF4444; font-size: .82rem; margin-top: .4rem;
        }

        .cs-form-footer {
          display: flex; justify-content: space-between;
          align-items: center; margin-top: .85rem;
        }

        .cs-hint { font-size: .8rem; color: rgba(255,255,255,.35); }
        .cs-hint strong { color: #CCFF00; }

        .submit-btn {
          display: flex; align-items: center; gap: .5rem;
          padding: .75rem 1.8rem;
          background: linear-gradient(135deg, #4B0082, #6B0FA6);
          border: none; border-radius: 10px;
          color: #fff; font-weight: 700; font-size: .9rem;
          cursor: pointer; font-family: 'Manrope', sans-serif;
          transition: all .3s;
          box-shadow: 0 4px 20px rgba(75,0,130,.4);
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(75,0,130,.55); }
        .submit-btn:disabled { opacity: .55; cursor: not-allowed; }

        /* ── Login prompt ── */
        .login-prompt {
          padding: 1.5rem; text-align: center;
          background: rgba(255,255,255,.03);
          border-top: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.55); font-size: .9rem;
        }
        .login-prompt a { color: #00D9FF; font-weight: 600; text-decoration: none; }
        .login-prompt a:hover { text-decoration: underline; }
      `}</style>

      <div className="comment-section">

        {/* ── En-tête cliquable ── */}
        <div className="cs-header" onClick={() => setExpanded(v => !v)}>
          <div className="cs-header-left">
            <MessageSquare size={20} color="#00D9FF" />
            Réponses
            <span className="cs-count">{answers.length}</span>
          </div>
          {expanded ? <ChevronUp size={20} color="rgba(255,255,255,.5)" /> : <ChevronDown size={20} color="rgba(255,255,255,.5)" />}
        </div>

        {expanded && (
          <div className="cs-body">

            {/* ── Liste des réponses ── */}
            {answers.length === 0 ? (
              <div className="cs-empty">
                <div className="cs-empty-icon">💬</div>
                <p>Aucune réponse pour l'instant.</p>
                <p style={{ marginTop: '.4rem', fontSize: '.85rem' }}>Soyez le premier à répondre !</p>
              </div>
            ) : (
              answers.map((answer, idx) => (
                <div key={answer.id ?? idx} className={`answer-item ${answer.is_accepted ? 'accepted' : ''}`}>
                  {answer.is_accepted && (
                    <div className="accepted-badge">
                      <CheckCircle size={14} /> Meilleure réponse
                    </div>
                  )}

                  <div className="answer-header">
                    <div className="answer-author">
                      <div className="author-avatar">
                        {(answer.user?.name?.[0] ?? 'U').toUpperCase()}
                      </div>
                      <div>
                        <div className="author-name">{answer.user?.name ?? 'Anonyme'}</div>
                        <div className="answer-time">{answer.created_at_human ?? answer.created_at}</div>
                      </div>
                    </div>
                    <span className="answer-points">⭐ {answer.user?.points ?? 0} pts</span>
                  </div>

                  <div className="answer-content">{answer.content}</div>

                  <div className="answer-actions">
                    <button className="action-btn">
                      <ThumbsUp size={14} /> Utile ({answer.votes_count ?? 0})
                    </button>
                    {auth?.user?.id === post?.user_id && !answer.is_accepted && (
                      <button className="action-btn" style={{ color: '#10B981', borderColor: 'rgba(16,185,129,.3)' }}>
                        <CheckCircle size={14} /> Marquer comme solution
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* ── Formulaire de réponse ── */}
            {auth?.user ? (
              <div className="cs-form-wrapper">
                <div className="cs-form-title">
                  <MessageSquare size={16} color="#00D9FF" />
                  Votre réponse
                </div>
                <form onSubmit={handleSubmit}>
                  <textarea
                    className={`cs-textarea ${errors.content ? 'error' : ''}`}
                    placeholder="Partagez votre solution ou votre point de vue..."
                    value={data.content}
                    onChange={e => setData('content', e.target.value)}
                  />
                  {errors.content && <p className="field-error">{errors.content}</p>}

                  <div className="cs-form-footer">
                    <span className="cs-hint">Bonne réponse = <strong>+5 pts</strong></span>
                    <button className="submit-btn" type="submit" disabled={processing || !data.content.trim()}>
                      <Send size={16} />
                      {processing ? 'Envoi...' : 'Publier la réponse'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="login-prompt">
                <a href="/login">Connectez-vous</a> pour répondre à cette question.
              </div>
            )}
          </div>
        )}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
};

export default CommentSection;
