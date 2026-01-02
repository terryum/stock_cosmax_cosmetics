import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { NewsCategory } from '@/types';

interface UIState {
  // 모달 상태
  isDatePickerOpen: boolean;
  isNewsModalOpen: boolean;
  activeNewsCategory: NewsCategory | null;

  // 로딩 상태
  isGlobalLoading: boolean;

  // 알림/토스트 메시지
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };

  // 액션
  openDatePicker: () => void;
  closeDatePicker: () => void;
  openNewsModal: (category: NewsCategory) => void;
  closeNewsModal: () => void;
  setGlobalLoading: (loading: boolean) => void;
  showSnackbar: (
    message: string,
    severity?: 'success' | 'error' | 'warning' | 'info'
  ) => void;
  hideSnackbar: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // 초기 상태
      isDatePickerOpen: false,
      isNewsModalOpen: false,
      activeNewsCategory: null,
      isGlobalLoading: false,
      snackbar: {
        open: false,
        message: '',
        severity: 'info',
      },

      // 날짜 선택기
      openDatePicker: () =>
        set({ isDatePickerOpen: true }, false, 'openDatePicker'),

      closeDatePicker: () =>
        set({ isDatePickerOpen: false }, false, 'closeDatePicker'),

      // 뉴스 모달
      openNewsModal: (category) =>
        set(
          {
            isNewsModalOpen: true,
            activeNewsCategory: category,
          },
          false,
          'openNewsModal'
        ),

      closeNewsModal: () =>
        set(
          {
            isNewsModalOpen: false,
            activeNewsCategory: null,
          },
          false,
          'closeNewsModal'
        ),

      // 글로벌 로딩
      setGlobalLoading: (loading) =>
        set({ isGlobalLoading: loading }, false, 'setGlobalLoading'),

      // 스낵바
      showSnackbar: (message, severity = 'info') =>
        set(
          {
            snackbar: { open: true, message, severity },
          },
          false,
          'showSnackbar'
        ),

      hideSnackbar: () =>
        set(
          (state) => ({
            snackbar: { ...state.snackbar, open: false },
          }),
          false,
          'hideSnackbar'
        ),
    }),
    { name: 'ui-store' }
  )
);
