'use client';

import { GitHubRepo } from '../types/github';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
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
            size: 10,
          },
          maxRotation: 45,
          minRotation: 0,
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
            size: 10,
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
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const statItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const
      }
    }
  };

  const analysisVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="w-full overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="h-48 w-full"
        variants={chartVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Bar data={chartData} options={options} />
      </motion.div>
      
      {/* Activity statistics */}
      <motion.div 
        className="grid grid-cols-3 gap-3 mt-4 custom-scrollbar"
        variants={statsVariants}
      >
        <motion.div 
          className="text-center p-2 lg:p-3 bg-gray-700/30 rounded-lg"
          variants={statItemVariants}
          whileHover={{ 
            scale: 1.05, 
            y: -5,
            backgroundColor: 'rgba(75, 85, 99, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="text-lg lg:text-2xl font-bold text-blue-400"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {totalRepos}
          </motion.div>
          <div className="text-xs lg:text-sm text-gray-400">{t('repositories.totalRepos')}</div>
        </motion.div>
        <motion.div 
          className="text-center p-2 lg:p-3 bg-gray-700/30 rounded-lg"
          variants={statItemVariants}
          whileHover={{ 
            scale: 1.05, 
            y: -5,
            backgroundColor: 'rgba(75, 85, 99, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="text-lg lg:text-2xl font-bold text-green-400"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {activeRepos}
          </motion.div>
          <div className="text-xs lg:text-sm text-gray-400">{t('repositories.activeRepos')}</div>
        </motion.div>
        <motion.div 
          className="text-center p-2 lg:p-3 bg-gray-700/30 rounded-lg"
          variants={statItemVariants}
          whileHover={{ 
            scale: 1.05, 
            y: -5,
            backgroundColor: 'rgba(75, 85, 99, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="text-lg lg:text-2xl font-bold text-purple-400"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {averageUpdateFrequency}%
          </motion.div>
          <div className="text-xs lg:text-sm text-gray-400">{t('repositories.activityRate')}</div>
        </motion.div>
      </motion.div>

      {/* Activity analysis */}
      <motion.div 
        className="mt-4 p-3 bg-gray-700/30 rounded-lg"
        variants={analysisVariants}
        whileHover={{ 
          scale: 1.02,
          backgroundColor: 'rgba(75, 85, 99, 0.4)'
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.h4 
          className="text-sm font-medium text-gray-300 mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {t('repositories.activityAnalysis')}
        </motion.h4>
        <motion.div 
          className="text-xs text-gray-400 space-y-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {averageUpdateFrequency >= 70 ? (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              {t('repositories.excellentActivity')}
            </motion.p>
          ) : averageUpdateFrequency >= 50 ? (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              {t('repositories.goodActivity')}
            </motion.p>
          ) : averageUpdateFrequency >= 30 ? (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              {t('repositories.mediumActivity')}
            </motion.p>
          ) : (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              {t('repositories.lowActivity')}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
