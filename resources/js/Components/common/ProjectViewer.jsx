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
        repoDetails: {
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

    // Conversion basique Markdown vers HTML avec styles thème sombre
    const htmlContent = content.readme
      .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mb-6 text-cyan-400">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold mb-4 mt-8 text-cyan-300">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-medium mb-3 mt-6 text-indigo-400">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="text-gray-300 italic">$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-gray-900 px-2 py-1 rounded text-sm font-mono text-lime-400">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-300">')
      .replace(/\n/g, '<br>');

    return (
      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<p class="mb-4 text-gray-300">${htmlContent}</p>` }} />
      </div>
    );
  };

  const renderCodeView = () => {
    if (!content?.contents) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Structure du projet</h3>
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30 rounded transition-all"
          >
            {showRaw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showRaw ? 'Masquer' : 'Voir'} brut
          </button>
        </div>

        <div className="bg-gray-950 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-700/50">
          {content.contents.map((item, index) => (
            <div key={index} className="mb-1">
              {item.type === 'dir' ? (
                <span className="text-blue-300">📁 {item.name}/</span>
              ) : (
                <span className="text-gray-400">📄 {item.name}</span>
              )}
            </div>
          ))}
        </div>

        {showRaw && (
          <div className="bg-gray-900/50 border border-gray-700/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-gray-300">Contenu brut (JSON)</h4>
            <pre className="text-xs overflow-x-auto text-gray-400">
              {JSON.stringify(content.contents, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal/Slide-over - Centré */}
      <div className="relative z-[10000] w-full max-w-4xl h-full max-h-[90vh] mx-auto bg-gradient-to-br from-blue-950/40 to-indigo-950/40 backdrop-blur-xl border border-cyan-500/20 shadow-2xl rounded-xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-cyan-900/40 bg-gradient-to-r from-blue-950/50 to-indigo-950/50 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Github className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {project?.title || 'Projet GitHub'}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {content?.repo?.description || 'Visionneuse intégrée'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={project?.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/30 rounded-lg transition-all duration-300"
              >
                <ExternalLink className="w-4 h-4" />
                GitHub
              </a>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700/40 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500/30 border-t-cyan-400"></div>
                <span className="ml-3 text-gray-400">Chargement du projet...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="text-red-500/60 mb-4">
                  <FileText className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  Erreur de chargement
                </h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <button
                  onClick={loadProjectContent}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
                >
                  Réessayer
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-cyan-900/30 bg-blue-950/20 backdrop-blur px-6">
                  <button
                    onClick={() => setActiveTab('readme')}
                    className={`px-4 py-3 font-medium text-sm border-b-2 transition-all duration-300 flex items-center gap-2 ${
                      activeTab === 'readme'
                        ? 'border-cyan-500 text-cyan-400'
                        : 'border-transparent text-gray-500 hover:text-gray-400'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    README
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-4 py-3 font-medium text-sm border-b-2 transition-all duration-300 flex items-center gap-2 ${
                      activeTab === 'code'
                        ? 'border-cyan-500 text-cyan-400'
                        : 'border-transparent text-gray-500 hover:text-gray-400'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    Structure
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {activeTab === 'readme' && renderReadme()}
                  {activeTab === 'code' && renderCodeView()}
                </div>
              </div>
            )}
          </div>

          {/* Footer avec stats du repo */}
          {content?.repoDetails && (
            <div className="border-t border-cyan-900/40 p-4 bg-blue-950/30 backdrop-blur">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2"><span className="text-yellow-500">⭐</span> {content.repoDetails.stargazers_count} stars</span>
                  <span className="flex items-center gap-2"><span className="text-purple-400">🍴</span> {content.repoDetails.forks_count} forks</span>
                  <span className="flex items-center gap-2"><span className="text-cyan-400">📅</span> {new Date(content.repoDetails.updated_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <span className="text-xs text-gray-500">
                  API GitHub
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