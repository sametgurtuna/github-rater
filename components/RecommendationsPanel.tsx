import { SparklesIcon, StarIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';

interface RecommendationsPanelProps {
  recommendations: string[];
  isProjectStarred?: boolean;
}

export default function RecommendationsPanel({ recommendations, isProjectStarred = false }: RecommendationsPanelProps) {
  const { t } = useLanguage();

  if (recommendations.length === 0) {
    return (
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-200">{t('recommendations.title')}</h3>
        </div>
        <p className="text-gray-400 text-center py-8">
          {t('recommendations.noRecommendations')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 relative overflow-hidden">
      {/* Blur overlay when project is not starred */}
      {!isProjectStarred && (
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <StarIcon className="w-8 h-8 text-purple-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">
              {t('recommendations.locked')}
            </h4>
            <p className="text-gray-300 text-sm max-w-xs">
              {t('recommendations.lockedDescription')}
            </p>
            <a
              href="https://github.com/yourusername/github-profile-analyzer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <StarIcon className="w-4 h-4" />
              GitHub'da Yıldızla
            </a>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <SparklesIcon className="w-6 h-6 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-200">{t('recommendations.title')}</h3>
      </div>
      
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg"
          >
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
            <p className="text-gray-200 leading-relaxed">
              {recommendation}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-400 text-center">
          {t('recommendations.description')}
        </p>
      </div>
    </div>
  );
}
