'use client';

import { GitHubRepo } from '../types/github';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
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
      <motion.div 
        className="text-center py-8 text-gray-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {t('charts.noLanguageInfo')}
      </motion.div>
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
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#D1D5DB',
          font: {
            size: 11,
          },
          usePointStyle: true,
          padding: 15,
          boxWidth: 8,
          boxHeight: 8,
        },
        align: 'center' as const,
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

  // Calculate dynamic height based on number of languages
  const chartHeight = Math.max(20, Math.min(28, sortedLanguages.length * 2.5)); // 20-28 range (daha da küçük)
  const tableHeight = sortedLanguages.length * 2; // 2rem per language (sabit)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.05
      }
    }
  };

  const languageItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div 
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Chart with dynamic height */}
      <motion.div 
        className={`w-full`} 
        style={{ height: `${chartHeight}rem` }}
        variants={chartVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Doughnut data={data} options={options} />
      </motion.div>
      
      {/* Language statistics table - with custom scrollbar */}
      <motion.div 
        className="mt-4 thin-scrollbar" 
        style={{ height: `${tableHeight}rem` }}
        variants={tableVariants}
      >
        <motion.h4 
          className="text-sm font-medium text-gray-300 mb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t('charts.detailedStatistics')}
        </motion.h4>
        <div className="space-y-2">
          {sortedLanguages.map(([language, count], index) => {
            const total = sortedLanguages.reduce((sum, [, c]) => sum + c, 0);
            const percentage = ((count / total) * 100).toFixed(1);
            
            return (
              <motion.div 
                key={language} 
                className="flex items-center justify-between text-sm"
                variants={languageItemVariants}
                whileHover={{ 
                  x: 5, 
                  scale: 1.02,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)'
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <motion.div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colors[index] }}
                    whileHover={{ scale: 1.5, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="text-gray-300 truncate" title={language}>
                    {language}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <motion.span 
                    className="text-gray-400 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    {count} repo
                  </motion.span>
                  <motion.span 
                    className="text-gray-500 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                  >
                    ({percentage}%)
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
