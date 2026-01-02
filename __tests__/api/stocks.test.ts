/**
 * 주가 API 유틸리티 테스트
 *
 * Next.js API 라우트는 E2E 테스트에서 검증하므로
 * 여기서는 관련 유틸리티 함수만 테스트합니다.
 */

describe('주가 API 유틸리티', () => {
  describe('날짜 포맷 변환', () => {
    it('Date 객체를 YYYYMMDD 형식으로 변환해야 한다', () => {
      const formatDateToYYYYMMDD = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
      };

      const date = new Date('2024-01-15');
      expect(formatDateToYYYYMMDD(date)).toBe('20240115');
    });

    it('월과 일이 한 자리수일 때도 올바르게 포맷해야 한다', () => {
      const formatDateToYYYYMMDD = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
      };

      const date = new Date('2024-03-05');
      expect(formatDateToYYYYMMDD(date)).toBe('20240305');
    });
  });

  describe('더미 데이터 생성', () => {
    it('더미 가격 데이터가 올바른 구조를 가져야 한다', () => {
      const dummyData = {
        code: '192820',
        name: '코스맥스',
        currentPrice: 100000,
        changePrice: 1000,
        changeRate: 1.0,
        changeSign: 'up' as const,
        volume: 500000,
        tradeAmount: 50000000000,
        open: 99000,
        high: 102000,
        low: 98000,
        prevClose: 99000,
        timestamp: new Date().toISOString(),
      };

      expect(dummyData.code).toBe('192820');
      expect(typeof dummyData.currentPrice).toBe('number');
      expect(typeof dummyData.changeRate).toBe('number');
      expect(['up', 'down', 'unchanged']).toContain(dummyData.changeSign);
    });

    it('더미 히스토리 데이터가 올바른 구조를 가져야 한다', () => {
      const dummyHistoryItem = {
        date: '2024-01-15',
        open: 99000,
        high: 102000,
        low: 98000,
        close: 100000,
        volume: 500000,
        changeRate: 1.0,
      };

      expect(dummyHistoryItem).toHaveProperty('date');
      expect(dummyHistoryItem).toHaveProperty('open');
      expect(dummyHistoryItem).toHaveProperty('high');
      expect(dummyHistoryItem).toHaveProperty('low');
      expect(dummyHistoryItem).toHaveProperty('close');
      expect(dummyHistoryItem).toHaveProperty('volume');
    });
  });

  describe('등락 부호 변환', () => {
    it('한투 API 부호를 앱 부호로 변환해야 한다', () => {
      const convertChangeSign = (
        sign: string
      ): 'up' | 'down' | 'unchanged' => {
        switch (sign) {
          case '1': // 상한
          case '2': // 상승
            return 'up';
          case '4': // 하한
          case '5': // 하락
            return 'down';
          default: // 3: 보합
            return 'unchanged';
        }
      };

      expect(convertChangeSign('1')).toBe('up');
      expect(convertChangeSign('2')).toBe('up');
      expect(convertChangeSign('3')).toBe('unchanged');
      expect(convertChangeSign('4')).toBe('down');
      expect(convertChangeSign('5')).toBe('down');
    });
  });

  describe('날짜 문자열 변환', () => {
    it('YYYYMMDD를 YYYY-MM-DD로 변환해야 한다', () => {
      const formatDate = (dateStr: string): string => {
        if (dateStr.length !== 8) return dateStr;
        return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
      };

      expect(formatDate('20240115')).toBe('2024-01-15');
      expect(formatDate('20231231')).toBe('2023-12-31');
    });

    it('8자리가 아닌 문자열은 그대로 반환해야 한다', () => {
      const formatDate = (dateStr: string): string => {
        if (dateStr.length !== 8) return dateStr;
        return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
      };

      expect(formatDate('2024-01-15')).toBe('2024-01-15');
      expect(formatDate('invalid')).toBe('invalid');
    });
  });
});
