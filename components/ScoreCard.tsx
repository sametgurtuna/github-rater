import { motion } from 'framer-motion';

interface ScoreCardProps {
  title: string;
  score: number;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'indigo' | 'pink';
  description: string;
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  yellow: 'from-yellow-500 to-yellow-600',
  indigo: 'from-indigo-500 to-indigo-600',
  pink: 'from-pink-500 to-pink-600',
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  if (score >= 20) return 'Improvable';
  return 'Poor';
};

export default function ScoreCard({ title, score, color, description }: ScoreCardProps) {
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const scoreVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut" as const
      }
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${score}%`,
      transition: {
        duration: 1.2,
        delay: 0.4,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div 
      className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 dark-scrollbar"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div 
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
        <motion.div 
          className={`w-3 h-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`}
          whileHover={{ scale: 1.5, rotate: 360 }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
      
      <motion.div 
        className="text-center mb-4"
        variants={scoreVariants}
      >
        <motion.div 
          className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {score}
        </motion.div>
        <motion.div 
          className="text-sm text-gray-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {getScoreLabel(score)}
        </motion.div>
      </motion.div>

      <div className="w-full bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
        <motion.div
          className={`h-2 bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-500`}
          variants={progressVariants}
          initial="hidden"
          animate="visible"
        />
      </div>

      <motion.p 
        className="text-sm text-gray-400 text-center leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
}
