import { supabase, supabaseAdmin } from '../client';
import { NewsArticle, NewsArticleInsert } from '../types';
import crypto from 'crypto';

// 컨텐츠 해시 생성
function generateContentHash(title: string, link: string): string {
  return crypto
    .createHash('sha256')
    .update(`${title}:${link}`)
    .digest('hex');
}

export const newsRepository = {
  // 카테고리별 뉴스 조회
  async findByCategory(
    category: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<NewsArticle[]> {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('category', category)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('뉴스 조회 오류:', error);
      return [];
    }

    return data || [];
  },

  // 최신 뉴스 조회 (전체)
  async findLatest(limit: number = 50): Promise<NewsArticle[]> {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('최신 뉴스 조회 오류:', error);
      return [];
    }

    return data || [];
  },

  // 뉴스 검색
  async search(keyword: string, limit: number = 20): Promise<NewsArticle[]> {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('뉴스 검색 오류:', error);
      return [];
    }

    return data || [];
  },

  // 뉴스 중복 확인
  async existsByHash(contentHash: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('news_articles')
      .select('id')
      .eq('content_hash', contentHash)
      .limit(1);

    if (error) {
      console.error('뉴스 중복 확인 오류:', error);
      return false;
    }

    return (data?.length ?? 0) > 0;
  },

  // 뉴스 저장 (중복 제외)
  async create(article: Omit<NewsArticleInsert, 'content_hash'>): Promise<NewsArticle | null> {
    const contentHash = generateContentHash(article.title, article.link);

    // 중복 확인
    const exists = await this.existsByHash(contentHash);
    if (exists) {
      return null;
    }

    const { data, error } = await supabaseAdmin
      .from('news_articles')
      .insert({
        ...article,
        content_hash: contentHash,
      } as any)
      .select()
      .single();

    if (error) {
      // 중복 키 오류는 무시
      if (error.code === '23505') {
        return null;
      }
      console.error('뉴스 저장 오류:', error);
      return null;
    }

    return data;
  },

  // 여러 뉴스 일괄 저장 (중복 무시)
  async bulkCreate(
    articles: Omit<NewsArticleInsert, 'content_hash'>[]
  ): Promise<number> {
    if (articles.length === 0) return 0;

    const articlesWithHash = articles.map((article) => ({
      ...article,
      content_hash: generateContentHash(article.title, article.link),
    }));

    const { data, error } = await supabaseAdmin
      .from('news_articles')
      .upsert(articlesWithHash as any, {
        onConflict: 'content_hash',
        ignoreDuplicates: true,
      })
      .select();

    if (error) {
      console.error('뉴스 일괄 저장 오류:', error);
      return 0;
    }

    return data?.length ?? 0;
  },

  // 오래된 뉴스 삭제 (기본 30일)
  async deleteOldNews(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const { data, error } = await supabaseAdmin
      .from('news_articles')
      .delete()
      .lt('published_at', cutoffDate.toISOString())
      .select();

    if (error) {
      console.error('오래된 뉴스 삭제 오류:', error);
      return 0;
    }

    return data?.length ?? 0;
  },

  // 카테고리별 뉴스 개수
  async countByCategory(category: string): Promise<number> {
    const { count, error } = await supabase
      .from('news_articles')
      .select('*', { count: 'exact', head: true })
      .eq('category', category);

    if (error) {
      console.error('뉴스 개수 조회 오류:', error);
      return 0;
    }

    return count ?? 0;
  },
};
