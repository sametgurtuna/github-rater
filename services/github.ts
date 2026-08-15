import axios from 'axios';
import { GitHubUser, GitHubRepo, ProfileScore, AnalysisResult } from '../types/github';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubService {
  private static instance: GitHubService;
  private rateLimitRemaining: number = 60;
  private rateLimitReset: number = 0;

  private constructor() {}

  public static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await axios.get<T>(`${GITHUB_API_BASE}${endpoint}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Profile-Analyzer'
        }
      });

      // Rate limit bilgilerini güncelle
      this.rateLimitRemaining = parseInt(response.headers['x-ratelimit-remaining'] || '0');
      this.rateLimitReset = parseInt(response.headers['x-ratelimit-reset'] || '0');

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      if (error.response?.status === 403) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error('GitHub API error: ' + error.message);
    }
  }

  async getUser(username: string): Promise<GitHubUser> {
    return this.makeRequest<GitHubUser>(`/users/${username}`);
  }

  async getUserRepos(username: string): Promise<GitHubRepo[]> {
    return this.makeRequest<GitHubRepo[]>(`/users/${username}/repos?sort=updated&per_page=100`);
  }

  async analyzeProfile(username: string): Promise<AnalysisResult> {
    const [user, repos] = await Promise.all([
      this.getUser(username),
      this.getUserRepos(username)
    ]);

    const score = this.calculateAdvancedScore(user, repos);
    const insights = this.generateAdvancedInsights(user, repos, score);
    const recommendations = this.generateAdvancedRecommendations(user, repos, score);

    return {
      user,
      repos,
      score,
      insights,
      recommendations
    };
  }

  private calculateAdvancedScore(user: GitHubUser, repos: GitHubRepo[]): ProfileScore {
    // Enhanced Activity Score (Account age, update frequency, consistency)
    const accountAge = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365);
    const lastUpdate = (Date.now() - new Date(user.updated_at).getTime()) / (1000 * 60 * 60 * 24);
    
    // Calculate activity consistency
    const recentRepos = repos.filter(repo => {
      const repoAge = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
      return repoAge <= 90; // Last 3 months
    });
    
    const activityScore = Math.min(100, Math.max(0, 
      (Math.min(accountAge * 8, 40)) + // Account age (max 40 points)
      (Math.max(0, 60 - lastUpdate) * 0.8) + // Recent activity (max 60 points)
      (recentRepos.length * 2) + // Active repos
      (user.public_repos * 0.5) // Total repos bonus
    ));

    // Enhanced Contribution Score (Repo quality, forks, community impact)
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const totalWatchers = repos.reduce((sum, repo) => sum + repo.watchers_count, 0);
    const originalRepos = repos.filter(r => !r.fork);
    const forkedRepos = repos.filter(r => r.fork);
    
    const contributionScore = Math.min(100, Math.max(0,
      (Math.min(originalRepos.length * 4, 40)) + // Original repos (max 40 points)
      (Math.min(totalForks * 1.5, 30) + // Fork impact (max 30 points)
      (Math.min(totalWatchers * 0.8, 20)) + // Watcher engagement (max 20 points)
      (user.public_gists * 0.5) + // Gists contribution
      (forkedRepos.length * 0.3) // Fork participation
    ));

    // Enhanced Popularity Score (Followers, stars, social proof)
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const avgStarsPerRepo = repos.length > 0 ? totalStars / repos.length : 0;
    const followerRatio = user.followers / Math.max(user.following, 1);
    
    const popularityScore = Math.min(100, Math.max(0,
      (Math.min(user.followers * 0.8, 40)) + // Followers (max 40 points)
      (Math.min(totalStars * 0.6, 30)) + // Total stars (max 30 points)
      (Math.min(avgStarsPerRepo * 10, 20)) + // Average stars per repo (max 20 points)
      (Math.min(followerRatio * 20, 10)) // Follower/following ratio (max 10 points)
    ));

    // Enhanced Quality Score (Documentation, features, professionalism)
    const reposWithDescription = repos.filter(r => r.description && r.description.length > 10);
    const reposWithWiki = repos.filter(r => r.has_wiki);
    const reposWithPages = repos.filter(r => r.has_pages);
    const reposWithLicense = repos.filter(r => r.license);
    const reposWithIssues = repos.filter(r => r.has_issues);
    const reposWithDiscussions = repos.filter(r => r.has_discussions);
    
    const qualityScore = Math.min(100, Math.max(0,
      (Math.min(reposWithDescription.length * 3, 30)) + // Good descriptions (max 30 points)
      (Math.min(reposWithWiki.length * 2, 20) + // Wikis (max 20 points)
      (Math.min(reposWithPages.length * 3, 20) + // GitHub Pages (max 20 points)
      (Math.min(reposWithLicense.length * 4, 20)) + // Licenses (max 20 points)
      (Math.min(reposWithIssues.length * 1)) + // Issue tracking (max 10 points)
      (Math.min(reposWithDiscussions.length * 2)) // Discussions (max 10 points)
    ));

    // Enhanced Diversity Score (Languages, topics, project types)
    const languages = new Set(repos.map(r => r.language).filter(Boolean));
    const topics = new Set(repos.flatMap(r => r.topics || []));
    const projectTypes = new Set();
    
    repos.forEach(repo => {
      if (repo.is_template) projectTypes.add('template');
      if (repo.archived) projectTypes.add('archived');
      if (repo.disabled) projectTypes.add('disabled');
      if (repo.mirror_url) projectTypes.add('mirror');
    });
    
    const diversityScore = Math.min(100, Math.max(0,
      (Math.min(languages.size * 8, 40)) + // Language diversity (max 40 points)
      (Math.min(topics.size * 3, 30)) + // Topic diversity (max 30 points)
      (Math.min(projectTypes.size * 5, 20)) + // Project type diversity (max 20 points)
      (originalRepos.length * 0.5) + // Original content bonus
      (Math.min(repos.length / 10, 10)) // Repository count bonus (max 10 points)
    ));

    // Advanced Overall Score with dynamic weighting
    const weights = this.calculateDynamicWeights(user, repos);
    const overallScore = Math.round(
      (activityScore * weights.activity) +
      (contributionScore * weights.contribution) +
      (popularityScore * weights.popularity) +
      (qualityScore * weights.quality) +
      (diversityScore * weights.diversity)
    );

    return {
      overall: overallScore,
      activity: Math.round(activityScore),
      contribution: Math.round(contributionScore),
      popularity: Math.round(popularityScore),
      quality: Math.round(qualityScore),
      diversity: Math.round(diversityScore)
    };
  }

  private calculateDynamicWeights(user: GitHubUser, repos: GitHubRepo[]) {
    // Dynamic weighting based on profile characteristics
    const totalRepos = repos.length;
    const accountAge = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    let weights = {
      activity: 0.2,
      contribution: 0.25,
      popularity: 0.2,
      quality: 0.2,
      diversity: 0.15
    };

    // Adjust weights based on profile maturity
    if (accountAge > 5) {
      // Mature accounts: emphasize quality and contribution
      weights.quality = 0.25;
      weights.contribution = 0.3;
      weights.activity = 0.15;
    } else if (accountAge < 1) {
      // New accounts: emphasize activity and potential
      weights.activity = 0.3;
      weights.contribution = 0.2;
      weights.quality = 0.15;
    }

    // Adjust weights based on repository count
    if (totalRepos > 50) {
      // High repo count: emphasize quality and diversity
      weights.quality = 0.25;
      weights.diversity = 0.2;
      weights.contribution = 0.2;
    } else if (totalRepos < 10) {
      // Low repo count: emphasize activity and contribution
      weights.activity = 0.25;
      weights.contribution = 0.3;
      weights.diversity = 0.1;
    }

    return weights;
  }

  private generateAdvancedInsights(user: GitHubUser, repos: GitHubRepo[], score: ProfileScore): string[] {
    const insights: string[] = [];

    // Score-based insights
    if (score.activity > 85) insights.push('Exceptional activity level! You maintain a very active development profile.');
    else if (score.activity > 70) insights.push('High activity level with consistent project updates.');
    
    if (score.contribution > 85) insights.push('Outstanding community contribution! Your projects have significant impact.');
    else if (score.contribution > 70) insights.push('Strong contribution to the open source community.');
    
    if (score.popularity > 85) insights.push('Highly popular profile with strong social proof and recognition.');
    else if (score.popularity > 70) insights.push('Good popularity with growing community engagement.');
    
    if (score.quality > 85) insights.push('Excellent project quality with professional documentation and features.');
    else if (score.quality > 70) insights.push('High quality projects with good documentation practices.');
    
    if (score.diversity > 85) insights.push('Impressive technical diversity across multiple domains and technologies.');
    else if (score.diversity > 70) insights.push('Good technical diversity showing versatility.');

    // Profile completeness insights
    if (user.bio && user.bio.length > 50) insights.push('Professional bio with detailed information.');
    if (user.blog) insights.push('Personal website/blog link enhances professional presence.');
    if (user.location) insights.push('Location information helps with local opportunities.');
    if (user.hireable) insights.push('Open to job opportunities - great for career growth.');
    if (user.company) insights.push('Company affiliation shows professional background.');

    // Repository insights
    const languages = new Set(repos.map(r => r.language).filter(Boolean));
    if (languages.size > 8) insights.push(`Expert in ${languages.size} programming languages.`);
    else if (languages.size > 5) insights.push(`Skilled in ${languages.size} programming languages.`);

    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    if (totalStars > 1000) insights.push(`Star power: ${totalStars.toLocaleString()} total stars across projects.`);
    else if (totalStars > 100) insights.push(`Recognition: ${totalStars} total stars received.`);

    const originalRepos = repos.filter(r => !r.fork);
    if (originalRepos.length > repos.length * 0.8) insights.push('High ratio of original projects vs forks.');

    // Activity insights
    const recentActivity = repos.filter(r => {
      const daysSinceUpdate = (Date.now() - new Date(r.updated_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceUpdate <= 30;
    });
    if (recentActivity.length > repos.length * 0.3) insights.push('Maintains active project updates.');

    return insights;
  }

  private generateAdvancedRecommendations(user: GitHubUser, repos: GitHubRepo[], score: ProfileScore): string[] {
    const recommendations: string[] = [];

    // Profile completeness recommendations
    if (!user.bio || user.bio.length < 30) {
      recommendations.push('Add a comprehensive bio (50+ characters) to showcase your expertise and interests.');
    }
    if (!user.blog) {
      recommendations.push('Create a personal website or blog to showcase your portfolio and thoughts.');
    }
    if (!user.location) {
      recommendations.push('Add location information to connect with local opportunities and communities.');
    }
    if (!user.hireable) {
      recommendations.push('Mark yourself as available for hire to attract career opportunities.');
    }

    // Score-based recommendations
    if (score.activity < 60) {
      recommendations.push('Increase activity: commit more frequently and update projects regularly.');
      recommendations.push('Consider setting up automated workflows to maintain consistent activity.');
    }
    
    if (score.contribution < 60) {
      recommendations.push('Contribute more to open source: fork projects and submit pull requests.');
      recommendations.push('Create original projects that solve real problems.');
    }
    
    if (score.popularity < 60) {
      recommendations.push('Engage with the community: follow other developers and participate in discussions.');
      recommendations.push('Promote your projects on social media and developer platforms.');
    }
    
    if (score.quality < 60) {
      recommendations.push('Improve project quality: add comprehensive README files and documentation.');
      recommendations.push('Include proper licensing, issue templates, and contribution guidelines.');
    }
    
    if (score.diversity < 60) {
      recommendations.push('Expand technical skills: work with different programming languages and frameworks.');
      recommendations.push('Add topics to your repositories to improve discoverability.');
    }

    // Specific improvement suggestions
    const languages = new Set(repos.map(r => r.language).filter(Boolean));
    if (languages.size < 3) {
      recommendations.push('Diversify your tech stack by working with at least 3 different programming languages.');
    }

    const topics = new Set(repos.flatMap(r => r.topics || []));
    if (topics.size < 8) {
      recommendations.push('Add more topics to repositories (aim for 8+ topics) to improve discoverability.');
    }

    const reposWithDescription = repos.filter(r => r.description && r.description.length > 20);
    if (reposWithDescription.length < repos.length * 0.7) {
      recommendations.push('Add detailed descriptions to 70%+ of your repositories.');
    }

    const reposWithLicense = repos.filter(r => r.license);
    if (reposWithLicense.length < repos.length * 0.5) {
      recommendations.push('Add licenses to at least 50% of your repositories for better open source contribution.');
    }

    // Advanced recommendations
    if (repos.length < 10) {
      recommendations.push('Build more projects to showcase your skills and experience.');
    }

    const archivedRepos = repos.filter(r => r.archived);
    if (archivedRepos.length > repos.length * 0.3) {
      recommendations.push('Consider cleaning up or updating archived repositories to maintain an active profile.');
    }

    return recommendations;
  }

  getRateLimitInfo() {
    return {
      remaining: this.rateLimitRemaining,
      reset: this.rateLimitReset
    };
  }
}
