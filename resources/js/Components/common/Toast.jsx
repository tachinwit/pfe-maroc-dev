import React, { useEffect, useState } from 'react';
import { Star, CheckCircle, X } from 'lucide-react';

/**
 * Utilisation dans n'importe quelle page :
 *
 * import Toast from '@/components/Toast';
 *
 * const [toast, setToast] = useState(null);
 *
 * // Après une action réussie (ex: post forum) :
 * setToast({ points: 10, message: 'Question publiée !' });
 *
 * <Toast toast={toast} onClose={() => setToast(null)} />
 */

const Toast = ({ toast, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!toast) return;

    setLeaving(false);
    setVisible(true);

    const timer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, 400);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  if (!visible || !toast) return null;

  return (
    <>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(30px) scale(.95); }
          to   { opacity: 1; transform: translateY(0)     scale(1); }
        }
        @keyframes toast-out {
          from { opacity: 1; transform: translateY(0)  scale(1); }
          to   { opacity: 0; transform: translateY(20px) scale(.95); }
        }
        @keyframes progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
        @keyframes pop {
          0%,100% { transform: scale(1); }
          40%     { transform: scale(1.3); }
        }

        .toast-wrapper {
          position: fixed;
          bottom: 2rem; right: 2rem;
          z-index: 9999;
          animation: toast-in .4s cubic-bezier(.34,1.56,.64,1) forwards;
        }
        .toast-wrapper.leaving {
          animation: toast-out .4s ease forwards;
        }

        .toast-card {
          display: flex; align-items: flex-start; gap: 1rem;
          padding: 1.1rem 1.4rem;
          background: rgba(15,32,39,.97);
          border: 1px solid rgba(204,255,0,.35);
          border-radius: 16px;
          box-shadow: 0 8px 40px rgba(0,0,0,.5), 0 0 0 1px rgba(204,255,0,.1);
          min-width: 260px; max-width: 340px;
          position: relative; overflow: hidden;
          backdrop-filter: blur(20px);
        }

        .toast-icon {
          width: 40px; height: 40px; flex-shrink: 0;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(204,255,0,.2), rgba(0,217,255,.15));
          border: 1px solid rgba(204,255,0,.3);
          display: flex; align-items: center; justify-content: center;
          animation: pop .5s ease .1s both;
        }

        .toast-body { flex: 1; min-width: 0; }

        .toast-title {
          font-weight: 700; font-size: .95rem;
          color: #fff; margin-bottom: .2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .toast-points {
          font-size: 1.1rem; font-weight: 800;
          background: linear-gradient(135deg, #CCFF00, #00D9FF);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .toast-sub {
          font-size: .82rem; color: rgba(255,255,255,.55);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .toast-close {
          background: none; border: none; color: rgba(255,255,255,.35);
          cursor: pointer; padding: .2rem; display: flex;
          transition: color .2s;
        }
        .toast-close:hover { color: rgba(255,255,255,.8); }

        .toast-progress {
          position: absolute; bottom: 0; left: 0; height: 3px;
          background: linear-gradient(90deg, #CCFF00, #00D9FF);
          border-radius: 0 0 16px 16px;
          animation: progress 3.5s linear forwards;
        }
      `}</style>

      <div className={`toast-wrapper ${leaving ? 'leaving' : ''}`}>
        <div className="toast-card">
          <div className="toast-icon">
            <Star size={20} color="#CCFF00" fill="#CCFF00" />
          </div>

          <div className="toast-body">
            <div className="toast-title">
              {toast.points
                ? <span className="toast-points">+{toast.points} points gagnés !</span>
                : <span style={{ color: '#10B981' }}>✓ {toast.message}</span>
              }
            </div>
            {toast.points && toast.message && (
              <div className="toast-sub">{toast.message}</div>
            )}
            {!toast.points && toast.sub && (
              <div className="toast-sub">{toast.sub}</div>
            )}
          </div>

          <button className="toast-close" onClick={() => { setLeaving(true); setTimeout(() => { setVisible(false); onClose?.(); }, 400); }}>
            <X size={16} />
          </button>

          <div className="toast-progress" />
        </div>
      </div>
    </>
  );
};

export default Toast;
