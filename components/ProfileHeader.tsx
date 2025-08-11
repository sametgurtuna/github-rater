import { GitHubUser } from '../types/github';
import { CalendarIcon, MapPinIcon, LinkIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfileHeaderProps {
  user: GitHubUser;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { t, language } = useLanguage();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAccountAge = () => {
    const created = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} yıl${years > 1 ? '' : ''} ${months > 0 ? `${months} ay` : ''}`;
    }
    return `${months} ay`;
  };

  return (
    <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={user.avatar_url}
            alt={`${user.name || user.login} avatar`}
            className="w-24 h-24 rounded-full border-4 border-gray-600"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            <h1 className="text-3xl font-bold text-white truncate">
              {user.name || user.login}
            </h1>
            {user.name && (
              <span className="text-xl text-gray-400">@{user.login}</span>
            )}
          </div>

          {user.bio && (
            <p className="text-gray-300 text-lg mb-4 leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mb-4">
            <div className="flex items-center gap-2 text-gray-300">
              <BuildingOfficeIcon className="w-5 h-5" />
              <span className="font-medium">{user.public_repos}</span>
              <span className="text-gray-400">repo</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">{user.followers}</span>
              <span className="text-gray-400">{t('profile.followers')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{user.following}</span>
              <span className="text-gray-400">{t('profile.following')}</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {user.location && (
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>{t('profile.memberSince')}: {formatDate(user.created_at)} ({getAccountAge()})</span>
            </div>

            {user.blog && (
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                <a
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {user.blog}
                </a>
              </div>
            )}

            {user.company && (
              <div className="flex items-center gap-2">
                <BuildingOfficeIcon className="w-4 h-4" />
                <span>{user.company}</span>
              </div>
            )}
          </div>

          {/* Hireable Badge */}
          {user.hireable && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t('profile.availableForHire')}
            </div>
          )}
        </div>

        {/* GitHub Link */}
        <div className="flex-shrink-0">
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {t('profile.viewOnGitHub')}
          </a>
        </div>
      </div>
    </div>
  );
}
