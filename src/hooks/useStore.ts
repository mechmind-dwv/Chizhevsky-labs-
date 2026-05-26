// ─── CHIZHEVSKY LABS — Global State Store ───────────────────────────────────
import { create } from 'zustand';

export type Chronotype = 'madrugador' | 'intermedio' | 'nocturno';
export type AerionMode = 'creativa' | 'recovery' | 'cosmos';

interface UserProfile {
  name: string;
  birthYear: number;
  chronotype: Chronotype;
  streak: number;            // days consecutive
  totalXP: number;
  achievements: string[];
  moodLog: { date: string; value: number }[];
  onboarded: boolean;
}

interface AppState {
  user: UserProfile;
  aerionMode: AerionMode;
  activeTab: string;

  // Actions
  setUser: (updates: Partial<UserProfile>) => void;
  setAerionMode: (mode: AerionMode) => void;
  setActiveTab: (tab: string) => void;
  logMood: (value: number) => void;
  addAchievement: (id: string, xp: number) => void;
  incrementStreak: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: {
    name: 'Explorador',
    birthYear: 1990,
    chronotype: 'intermedio',
    streak: 0,
    totalXP: 0,
    achievements: [],
    moodLog: [],
    onboarded: false,
  },
  aerionMode: 'creativa',
  activeTab: 'helios',

  setUser: (updates) =>
    set((state) => ({ user: { ...state.user, ...updates } })),

  setAerionMode: (mode) => set({ aerionMode: mode }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  logMood: (value) =>
    set((state) => ({
      user: {
        ...state.user,
        moodLog: [
          ...state.user.moodLog.slice(-89), // Keep last 90 days
          { date: new Date().toISOString().split('T')[0], value },
        ],
      },
    })),

  addAchievement: (id, xp) => {
    const { user } = get();
    if (user.achievements.includes(id)) return;
    set({
      user: {
        ...user,
        achievements: [...user.achievements, id],
        totalXP: user.totalXP + xp,
      },
    });
  },

  incrementStreak: () =>
    set((state) => ({
      user: { ...state.user, streak: state.user.streak + 1 },
    })),
}));
