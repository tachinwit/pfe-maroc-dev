import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Github, Code, FileText, Eye, EyeOff } from 'lucide-react';

/**
 * ProjectViewer - Visionneuse de projets GitHub intégrée
 *
 * Affiche le contenu des repos GitHub dans une modal/slide-over
 * sans quitter MarocDev
 */
const ProjectViewer = ({ project, isOpen, onClose }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('readme');
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    if (isOpen && project?.github_url) {
      loadProjectContent();
    }
  }, [isOpen, project]);

  const loadProjectContent = async () => {
    if (!project?.github_url) return;

    setLoading(true);
    setError(null);

    try {
      // Utiliser le backend pour charger les infos GitHub (avec token)
      const response = await fetch(`/api/github/repo-info?url=${encodeURIComponent(project.github_url)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Impossible de charger le projet');
      }

      const repoInfo = await response.json();

      // Parser l'URL pour owner/repo
      const urlMatch = project.github_url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      const [, owner, repo] = urlMatch || ['', '', ''];

      setContent({
        readme: repoInfo.readme || 'Pas de README disponible',
        repo: {
          stargazers_count: repoInfo.stars || 0,
          forks_count: repoInfo.forks || 0,
          updated_at: repoInfo.updated_at || new Date().toISOString(),
          description: repoInfo.description,
        },
        contents: [],
        owner,
        repo,
      });
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const renderReadme = () => {
    if (!content?.readme) return null;

    // Conversion basique Markdown vers HTML (simplifiée)
    const htmlContent = content.readme
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-medium mb-2 mt-4">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');

    return (
      <div className="prose prose-sm max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${htmlContent}</p>` }} />
      </div>
    );
  };

  const renderCodeView = () => {
    if (!content?.contents) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Structure du projet</h3>
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            {showRaw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showRaw ? 'Masquer' : 'Voir'} brut
          </button>
        </div>

        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          {content.contents.map((item, index) => (
            <div key={index} className="mb-1">
              {item.type === 'dir' ? (
                <span className="text-blue-400">📁 {item.name}/</span>
              ) : (
                <span className="text-gray-300">📄 {item.name}</span>
              )}
            </div>
          ))}
        </div>

        {showRaw && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Contenu brut (JSON)</h4>
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(content.contents, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal/Slide-over */}
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Github className="w-6 h-6 text-gray-700" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {project?.title || 'Projet GitHub'}
                </h2>
                <p className="text-sm text-gray-600">
                  {content?.repo?.description || 'Visionneuse intégrée'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={project?.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Voir sur GitHub
              </a>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Chargement du projet...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="text-red-500 mb-4">
                  <FileText className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Erreur de chargement
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={loadProjectContent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Réessayer
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('readme')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'readme'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    README
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'code'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Code className="w-4 h-4 inline mr-2" />
                    Structure
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === 'readme' && renderReadme()}
                  {activeTab === 'code' && renderCodeView()}
                </div>
              </div>
            )}
          </div>

          {/* Footer avec stats du repo */}
          {content?.repo && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span>⭐ {content.repo.stargazers_count} stars</span>
                  <span>🍴 {content.repo.forks_count} forks</span>
                  <span>📅 {new Date(content.repo.updated_at).toLocaleDateString()}</span>
                </div>
                <span className="text-xs">
                  Données fournies par l'API GitHub
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectViewer;