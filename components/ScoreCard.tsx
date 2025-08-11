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
  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`} />
      </div>
      
      <div className="text-center mb-4">
        <div className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}>
          {score}
        </div>
        <div className="text-sm text-gray-400 font-medium">
          {getScoreLabel(score)}
        </div>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
        <div
          className={`h-2 bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="text-sm text-gray-400 text-center leading-relaxed">
        {description}
      </p>
    </div>
  );
}
