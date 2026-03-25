import React from 'react';

const SkeletonLoader = ({ type = 'text', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className="skeleton-text-container">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="skeleton-line" style={{ width: i === count - 1 && count > 1 ? '60%' : '100%' }} />
            ))}
          </div>
        );
      case 'avatar':
        return <div className="skeleton-avatar" />;
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-card-header" />
            <div className="skeleton-card-body">
              <div className="skeleton-line" style={{ width: '80%' }} />
              <div className="skeleton-line" style={{ width: '60%' }} />
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="skeleton-chat">
            <div className="skeleton-avatar-small" />
            <div className="skeleton-chat-content">
              <div className="skeleton-line" style={{ width: '90%' }} />
              <div className="skeleton-line" style={{ width: '70%' }} />
            </div>
          </div>
        );
      default:
        return <div className="skeleton-line" />;
    }
  };

  return (
    <>
      <style>{`
        .skeleton-line {
          height: 1rem;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 0.75rem;
        }

        .skeleton-text-container { width: 100%; }

        .skeleton-avatar {
          width: 60px; height: 60px;
          border-radius: 14px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-avatar-small {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          flex-shrink: 0;
        }

        .skeleton-card {
          padding: 1.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
        }

        .skeleton-card-header {
          height: 120px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          margin-bottom: 1rem;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-chat {
          display: flex; gap: 1rem; align-items: flex-start;
          padding: 1rem;
          background: rgba(255,255,255,0.02);
          border-radius: 12px;
        }
        .skeleton-chat-content { flex: 1; }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      {renderSkeleton()}
    </>
  );
};

export default SkeletonLoader;
