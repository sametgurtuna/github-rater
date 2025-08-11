import { GitHubRepo } from '../types/github';
import { StarIcon, EyeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';

interface RepositoriesListProps {
  repos: GitHubRepo[];
}

export default function RepositoriesList({ repos }: RepositoriesListProps) {
  const { t, language } = useLanguage();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language: string | null) => {
    if (!language) return 'bg-gray-500';
    
    const colors: { [key: string]: string } = {
      'JavaScript': 'bg-yellow-400',
      'TypeScript': 'bg-blue-600',
      'Python': 'bg-blue-500',
      'Java': 'bg-orange-500',
      'C++': 'bg-pink-600',
      'C#': 'bg-purple-600',
      'Go': 'bg-cyan-500',
      'Rust': 'bg-orange-600',
      'PHP': 'bg-purple-500',
      'Ruby': 'bg-red-500',
      'Swift': 'bg-orange-400',
      'Kotlin': 'bg-purple-400',
      'Dart': 'bg-blue-400',
      'R': 'bg-blue-700',
      'Scala': 'bg-red-600',
      'Elixir': 'bg-purple-700',
      'Clojure': 'bg-green-600',
      'Haskell': 'bg-purple-800',
      'Erlang': 'bg-red-700',
      'F#': 'bg-blue-800',
    };
    
    return colors[language] || 'bg-gray-500';
  };

  if (repos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        {t('repositories.noRepos')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {repos.map((repo) => (
        <div
          key={repo.id}
          className="bg-gray-700/30 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-lg font-semibold text-white truncate">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    {repo.name}
                  </a>
                </h4>
                {repo.fork && (
                  <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
                    {t('repositories.fork')}
                  </span>
                )}
                {repo.archived && (
                  <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded-full border border-yellow-600/30">
                    {t('repositories.archived')}
                  </span>
                )}
              </div>

              {repo.description && (
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {repo.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {repo.language && (
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`} />
                    <span>{repo.language}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4" />
                  <span>{repo.stargazers_count.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path d="M6 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  </svg>
                  <span>{repo.forks_count.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  <span>{repo.watchers_count.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{t('repositories.lastUpdated')}: {formatDate(repo.updated_at)}</span>
                </div>
              </div>

              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {repo.topics.slice(0, 5).map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                  {repo.topics.length > 5 && (
                    <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
                      +{repo.topics.length - 5}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex-shrink-0">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                {t('repositories.view')}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
