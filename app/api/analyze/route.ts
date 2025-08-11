import { NextRequest, NextResponse } from 'next/server';
import { GitHubService } from '../../../services/github';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Geçerli bir kullanıcı adı gerekli' },
        { status: 400 }
      );
    }

    const githubService = GitHubService.getInstance();
    const result = await githubService.analyzeProfile(username);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Analiz hatası:', error);
    
    if (error.message.includes('bulunamadı')) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }
    
    if (error.message.includes('Rate limit')) {
      return NextResponse.json(
        { error: 'API rate limit aşıldı. Lütfen daha sonra tekrar deneyin.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Sunucu hatası: ' + error.message },
      { status: 500 }
    );
  }
}
