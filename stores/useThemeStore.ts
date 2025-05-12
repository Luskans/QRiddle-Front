// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface ThemeState {
//   isDark: boolean;
//   toggleTheme: () => void;
// }

// export const useThemeStore = create<ThemeState>()(
//   persist(
//     (set) => ({
//       isDark: false,
//       toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
//     }),
//     {
//       name: 'theme-storage',
//       storage: createJSONStorage(() => AsyncStorage),
//     }
//   )
// );





import { create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  isDark: boolean;
  isPrimaryLayout: boolean;
  toggleTheme: () => void;
  setIsPrimaryLayout: (isPrimary: boolean) => void;
}

const persistOptions: PersistOptions<ThemeState> = {
  name: 'theme-storage',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state) => ({ isDark: state.isDark }),
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      isPrimaryLayout: true,

      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      setIsPrimaryLayout: (isPrimary: boolean) => set({ isPrimaryLayout: isPrimary }),
    }),
    persistOptions
  )
);