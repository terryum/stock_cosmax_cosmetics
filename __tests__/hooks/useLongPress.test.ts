import { renderHook, act } from '@testing-library/react';
import { useLongPress } from '@/hooks/useLongPress';

describe('useLongPress', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('짧은 클릭 시 onClick이 호출되어야 한다', () => {
    const onLongPress = jest.fn();
    const onClick = jest.fn();

    const { result } = renderHook(() =>
      useLongPress({ onLongPress, onClick, threshold: 500 })
    );

    // mouseDown 후 바로 mouseUp (짧은 클릭)
    act(() => {
      result.current.onMouseDown();
    });

    // 100ms만 경과 (threshold 500ms 미만)
    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      result.current.onMouseUp();
    });

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('길게 누르면 onLongPress가 호출되어야 한다', () => {
    const onLongPress = jest.fn();
    const onClick = jest.fn();

    const { result } = renderHook(() =>
      useLongPress({ onLongPress, onClick, threshold: 500 })
    );

    // mouseDown
    act(() => {
      result.current.onMouseDown();
    });

    // 500ms 이상 경과
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onLongPress).toHaveBeenCalledTimes(1);

    // mouseUp 후에도 onClick은 호출되지 않아야 함
    act(() => {
      result.current.onMouseUp();
    });

    expect(onClick).not.toHaveBeenCalled();
  });

  it('마우스가 떠나면 타이머가 취소되어야 한다', () => {
    const onLongPress = jest.fn();
    const onClick = jest.fn();

    const { result } = renderHook(() =>
      useLongPress({ onLongPress, onClick, threshold: 500 })
    );

    // mouseDown
    act(() => {
      result.current.onMouseDown();
    });

    // 300ms 경과 (threshold 미만)
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // mouseLeave
    act(() => {
      result.current.onMouseLeave();
    });

    // 나머지 시간 경과
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // 마우스가 떠났으므로 롱프레스가 호출되지 않아야 함
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('터치 이벤트에서도 동작해야 한다', () => {
    const onLongPress = jest.fn();
    const onClick = jest.fn();

    const { result } = renderHook(() =>
      useLongPress({ onLongPress, onClick, threshold: 500 })
    );

    // touchStart
    act(() => {
      result.current.onTouchStart();
    });

    // 500ms 경과
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onLongPress).toHaveBeenCalledTimes(1);

    // touchEnd
    act(() => {
      result.current.onTouchEnd();
    });

    expect(onClick).not.toHaveBeenCalled();
  });

  it('커스텀 threshold가 적용되어야 한다', () => {
    const onLongPress = jest.fn();
    const customThreshold = 1000;

    const { result } = renderHook(() =>
      useLongPress({ onLongPress, threshold: customThreshold })
    );

    act(() => {
      result.current.onMouseDown();
    });

    // 500ms 경과 (커스텀 threshold 1000ms 미만)
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onLongPress).not.toHaveBeenCalled();

    // 500ms 더 경과 (총 1000ms)
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });
});
