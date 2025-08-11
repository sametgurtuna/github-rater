'use client';

import { GitHubRepo } from '../types/github';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useLanguage } from '../contexts/LanguageContext';

ChartJS.register(ArcElement, Tooltip, Legend);

interface LanguageChartProps {
  repos: GitHubRepo[];
}

export default function LanguageChart({ repos }: LanguageChartProps) {
  const { t } = useLanguage();

  // Calculate language statistics
  const languageStats = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  // Get top 8 languages and group others as "Other"
  const sortedLanguages = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const otherCount = Object.values(languageStats).reduce((sum, count, index) => {
    if (index >= 8) sum += count;
    return sum;
  }, 0);

  if (otherCount > 0) {
    sortedLanguages.push(['Other', otherCount]);
  }

  if (sortedLanguages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        {t('charts.noLanguageInfo')}
      </div>
    );
  }

  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#06B6D4', // cyan
    '#F97316', // orange
    '#EC4899', // pink
    '#6B7280', // gray
  ];

  const data = {
    labels: sortedLanguages.map(([language]) => language),
    datasets: [
      {
        data: sortedLanguages.map(([, count]) => count),
        backgroundColor: colors.slice(0, sortedLanguages.length),
        borderColor: colors.slice(0, sortedLanguages.length).map(color => color + '80'),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#D1D5DB',
          font: {
            size: 12,
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#D1D5DB',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} repo (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Doughnut data={data} options={options} />
      
      {/* Language statistics table */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">{t('charts.detailedStatistics')}</h4>
        <div className="space-y-2">
          {sortedLanguages.map(([language, count], index) => {
            const total = sortedLanguages.reduce((sum, [, c]) => sum + c, 0);
            const percentage = ((count / total) * 100).toFixed(1);
            
            return (
              <div key={language} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span className="text-gray-300">{language}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{count} repo</span>
                  <span className="text-gray-500">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
