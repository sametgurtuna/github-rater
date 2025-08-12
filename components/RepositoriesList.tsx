import { GitHubRepo } from '../types/github';
import { StarIcon, EyeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const repoCardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  if (repos.length === 0) {
    return (
      <motion.div 
        className="text-center py-8 text-gray-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {t('repositories.noRepos')}
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-4 custom-scrollbar"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {repos.map((repo, index) => (
        <motion.div
          key={repo.id}
          className="bg-gray-700/30 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200"
          variants={repoCardVariants}
          whileHover={{ 
            y: -5, 
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <motion.h4 
                  className="text-lg font-semibold text-white truncate"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    {repo.name}
                  </a>
                </motion.h4>
                {repo.fork && (
                  <motion.span 
                    className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full"
                    variants={badgeVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {t('repositories.fork')}
                  </motion.span>
                )}
                {repo.archived && (
                  <motion.span 
                    className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded-full border border-yellow-600/30"
                    variants={badgeVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {t('repositories.archived')}
                  </motion.span>
                )}
              </div>

              {repo.description && (
                <motion.p 
                  className="text-gray-300 text-sm mb-3 line-clamp-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                >
                  {repo.description}
                </motion.p>
              )}

              <motion.div 
                className="flex flex-wrap items-center gap-4 text-sm text-gray-400"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
              >
                {repo.language && (
                  <motion.div 
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div 
                      className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}
                      whileHover={{ scale: 1.5, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    />
                    <span>{repo.language}</span>
                  </motion.div>
                )}

                <motion.div 
                  className="flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <StarIcon className="w-4 h-4" />
                  </motion.div>
                  <span>{repo.stargazers_count.toLocaleString()}</span>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <path d="M18 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path d="M6 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  </motion.svg>
                  <span>{repo.forks_count.toLocaleString()}</span>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </motion.div>
                  <span>{repo.watchers_count.toLocaleString()}</span>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <CalendarIcon className="w-4 h-4" />
                  </motion.div>
                  <span>{t('repositories.lastUpdated')}: {formatDate(repo.updated_at)}</span>
                </motion.div>
              </motion.div>

              {repo.topics && repo.topics.length > 0 && (
                <motion.div 
                  className="flex flex-wrap gap-2 mt-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                >
                  {repo.topics.slice(0, 5).map((topic, topicIndex) => (
                    <motion.span
                      key={topic}
                      className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.05 + topicIndex * 0.05 }}
                      whileHover={{ scale: 1.1, backgroundColor: 'rgb(75, 85, 99)' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {topic}
                    </motion.span>
                  ))}
                  {repo.topics.length > 5 && (
                    <motion.span 
                      className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.05 + 5 * 0.05 }}
                      whileHover={{ scale: 1.1, backgroundColor: 'rgb(75, 85, 99)' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      +{repo.topics.length - 5}
                    </motion.span>
                  )}
                </motion.div>
              )}
            </div>

            <motion.div 
              className="flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
            >
              <motion.a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.svg 
                  className="w-4 h-4" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </motion.svg>
                {t('repositories.view')}
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
