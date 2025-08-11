'use client';

import { GitHubRepo } from '../types/github';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useLanguage } from '../contexts/LanguageContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ActivityChartProps {
  repos: GitHubRepo[];
}

export default function ActivityChart({ repos }: ActivityChartProps) {
  const { t } = useLanguage();
  const now = new Date();

  const months = [];
  const data = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString(t('language') === 'tr' ? 'tr-TR' : 'en-US', { month: 'short' });
    months.push(monthName);
    
    // Bu ay güncellenen repo sayısını hesapla
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const updatedInMonth = repos.filter(repo => {
      const updateDate = new Date(repo.updated_at);
      return updateDate >= monthStart && updateDate <= monthEnd;
    }).length;
    
    data.push(updatedInMonth);
  }

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Updated Repositories',
        data: data,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#D1D5DB',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y} repo güncellendi`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return Math.floor(value);
          },
        },
      },
    },
  };

  // Toplam istatistikler
  const totalRepos = repos.length;
  const activeRepos = repos.filter(repo => {
    const lastUpdate = new Date(repo.updated_at);
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    return lastUpdate >= threeMonthsAgo;
  }).length;

  const averageUpdateFrequency = totalRepos > 0 ? Math.round(activeRepos / totalRepos * 100) : 0;

  return (
    <div>
      <div className="h-80 mb-6">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Activity statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-700/30 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">{totalRepos}</div>
          <div className="text-sm text-gray-400">{t('repositories.totalRepos')}</div>
        </div>
        <div className="text-center p-3 bg-gray-700/30 rounded-lg">
          <div className="text-2xl font-bold text-green-400">{activeRepos}</div>
          <div className="text-sm text-gray-400">{t('repositories.activeRepos')}</div>
        </div>
        <div className="text-center p-3 bg-gray-700/30 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">{averageUpdateFrequency}%</div>
          <div className="text-sm text-gray-400">{t('repositories.activityRate')}</div>
        </div>
      </div>

      {/* Activity analysis */}
      <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
        <h4 className="text-sm font-medium text-gray-300 mb-2">{t('repositories.activityAnalysis')}</h4>
        <div className="text-xs text-gray-400 space-y-1">
          {averageUpdateFrequency >= 70 ? (
            <p>{t('repositories.excellentActivity')}</p>
          ) : averageUpdateFrequency >= 50 ? (
            <p>{t('repositories.goodActivity')}</p>
          ) : averageUpdateFrequency >= 30 ? (
            <p>{t('repositories.mediumActivity')}</p>
          ) : (
            <p>{t('repositories.lowActivity')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
