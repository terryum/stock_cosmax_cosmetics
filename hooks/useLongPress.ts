'use client';

import { useCallback, useRef } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  threshold?: number; // 롱프레스 인식 시간 (ms)
}

interface UseLongPressReturn {
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
}

export function useLongPress({
  onLongPress,
  onClick,
  threshold = 500,
}: UseLongPressOptions): UseLongPressReturn {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef<boolean>(false);

  const startPressTimer = useCallback(() => {
    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress();
      // 롱프레스 피드백 (진동)
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, threshold);
  }, [onLongPress, threshold]);

  const clearPressTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleEnd = useCallback(() => {
    clearPressTimer();
    // 롱프레스가 아니었다면 onClick 실행
    if (!isLongPressRef.current && onClick) {
      onClick();
    }
  }, [clearPressTimer, onClick]);

  return {
    onMouseDown: startPressTimer,
    onMouseUp: handleEnd,
    onMouseLeave: clearPressTimer,
    onTouchStart: startPressTimer,
    onTouchEnd: handleEnd,
  };
}
