'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileAnalyzer from '../components/ProfileAnalyzer';
import { AnalysisResult } from '../types/github';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const [username, setUsername] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleAnalyze = async () => {
    if (!username.trim()) {
      setError(t('search.error'));
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred during analysis');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const searchVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const featuresVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15
      }
    }
  };

  const featureCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white animated-scrollbar">
      <motion.div 
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={headerVariants}
        >
          <motion.h1 
            className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4 break-words"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {t('site.title')}
          </motion.h1>
          <motion.p 
            className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('site.description')}
          </motion.p>
        </motion.div>

        {/* Subtle Star Project Banner */}
        <motion.div 
          className="max-w-4xl mx-auto mb-8"
          variants={itemVariants}
        >
          <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                ⭐
              </motion.span>
              <span>If you like this project</span>
              <a
                href="https://github.com/sametgurtuna/github-rater"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline decoration-dotted"
              >
                star it on GitHub
              </a>
              <motion.span
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 1 }}
              >
                ⭐
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Search Form */}
        <motion.div 
          className="max-w-2xl mx-auto mb-12"
          variants={searchVariants}
        >
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
              >
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              </motion.div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('search.placeholder')}
                className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <motion.button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isAnalyzing ? { scale: [1, 1.02, 1] } : {}}
              transition={isAnalyzing ? { duration: 1, repeat: Infinity } : {}}
            >
              {isAnalyzing ? t('search.analyzing') : t('search.button')}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <ProfileAnalyzer result={result} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features */}
        <AnimatePresence>
          {!result && (
            <motion.div 
              className="max-w-6xl mx-auto"
              variants={featuresVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 
                className="text-3xl font-bold text-center mb-8 text-gray-200"
                variants={itemVariants}
              >
                {t('features.title')}
              </motion.h2>
              <div className="grid md:grid-cols-3 gap-8">
                <motion.div 
                  className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer"
                  variants={featureCardVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-200">{t('features.detailedAnalysis.title')}</h3>
                  <p className="text-gray-400">
                    {t('features.detailedAnalysis.description')}
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer"
                  variants={featureCardVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-200">{t('features.smartRecommendations.title')}</h3>
                  <p className="text-gray-400">
                    {t('features.smartRecommendations.description')}
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer"
                  variants={featureCardVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-200">{t('features.visualDashboard.title')}</h3>
                  <p className="text-gray-400">
                    {t('features.visualDashboard.description')}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
