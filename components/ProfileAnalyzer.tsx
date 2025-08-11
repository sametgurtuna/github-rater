'use client';

import { AnalysisResult } from '../types/github';
import ScoreCard from './ScoreCard';
import ProfileHeader from './ProfileHeader';
import RepositoriesList from './RepositoriesList';
import InsightsPanel from './InsightsPanel';
import RecommendationsPanel from './RecommendationsPanel';
import LanguageChart from './LanguageChart';
import ActivityChart from './ActivityChart';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfileAnalyzerProps {
  result: AnalysisResult;
  isProjectStarred?: boolean;
}

export default function ProfileAnalyzer({ result, isProjectStarred = false }: ProfileAnalyzerProps) {
  const { user, repos, score, insights, recommendations } = result;
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Profile Header */}
      <ProfileHeader user={user} />

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ScoreCard
          title={t('scores.overall')}
          score={score.overall}
          color="blue"
          description={t('scores.overallDesc')}
        />
        <ScoreCard
          title={t('scores.activity')}
          score={score.activity}
          color="green"
          description={t('scores.activityDesc')}
        />
        <ScoreCard
          title={t('scores.contribution')}
          score={score.contribution}
          color="purple"
          description={t('scores.contributionDesc')}
        />
        <ScoreCard
          title={t('scores.popularity')}
          score={score.popularity}
          color="yellow"
          description={t('scores.popularityDesc')}
        />
        <ScoreCard
          title={t('scores.quality')}
          score={score.quality}
          color="indigo"
          description={t('scores.qualityDesc')}
        />
        <ScoreCard
          title={t('scores.diversity')}
          score={score.diversity}
          color="pink"
          description={t('scores.diversityDesc')}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">{t('charts.programmingLanguages')}</h3>
          <LanguageChart repos={repos} />
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">{t('charts.repositoryActivity')}</h3>
          <ActivityChart repos={repos} />
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InsightsPanel insights={insights} isProjectStarred={isProjectStarred} />
        <RecommendationsPanel recommendations={recommendations} isProjectStarred={isProjectStarred} />
      </div>

      {/* Repositories List */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">{t('charts.mostPopularProjects')}</h3>
        <RepositoriesList repos={repos.slice(0, 10)} />
      </div>
    </div>
  );
}
