import { supabaseAdmin } from '../client';
import { ApiToken, ApiTokenInsert } from '../types';

export const tokenRepository = {
  // 프로바이더별 토큰 조회
  async findByProvider(provider: string): Promise<ApiToken | null> {
    const { data, error } = await supabaseAdmin
      .from('api_tokens')
      .select('*')
      .eq('provider', provider)
      .order('issued_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('토큰 조회 오류:', error);
      }
      return null;
    }

    return data as ApiToken;
  },

  // 토큰 저장 (upsert)
  async save(token: ApiTokenInsert): Promise<ApiToken | null> {
    // 기존 토큰 삭제 후 새로 저장
    await supabaseAdmin
      .from('api_tokens')
      .delete()
      .eq('provider', token.provider);

    const { data, error } = await supabaseAdmin
      .from('api_tokens')
      .insert(token as Record<string, unknown>)
      .select()
      .single();

    if (error) {
      console.error('토큰 저장 오류:', error);
      return null;
    }

    return data as ApiToken;
  },

  // 토큰 삭제
  async delete(provider: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('api_tokens')
      .delete()
      .eq('provider', provider);

    if (error) {
      console.error('토큰 삭제 오류:', error);
      return false;
    }

    return true;
  },
};
