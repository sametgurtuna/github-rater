import { LightBulbIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';

interface InsightsPanelProps {
  insights: string[];
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  const { t } = useLanguage();

  if (insights.length === 0) {
    return (
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <LightBulbIcon className="w-6 h-6 text-yellow-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-200">{t('insights.title')}</h3>
        </div>
        <p className="text-gray-400 text-center py-8">
          {t('insights.noData')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
          <LightBulbIcon className="w-6 h-6 text-yellow-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-200">{t('insights.title')}</h3>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
          >
            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
            <p className="text-gray-200 leading-relaxed">
              {insight}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-400 text-center">
          {t('insights.description')}
        </p>
      </div>
    </div>
  );
}
