import { UserProfile, LevelType } from '../types';

const STORAGE_KEY_AUTH = 'sakura_auth_session';
const STORAGE_KEY_PROFILE = 'sakura_user_profile';

export const DEFAULT_PROFILES: Record<string, UserProfile> = {
  girlfriend: {
    username: 'sakura@study.jp',
    displayName: 'Sakura (さくら)',
    avatar: '🌸',
    targetLevel: 'JFT',
    examTargetDate: '2026-06-15',
    dailyGoalCards: 20,
    dailyGoalMinutes: 30,
    sweetNote: "がんばって！ You are doing great, Ian believes in you! ❤️"
  },
  ian: {
    username: 'ian',
    displayName: 'Ian (イアン)',
    avatar: '👑',
    targetLevel: 'N3',
    examTargetDate: '2026-07-05',
    dailyGoalCards: 30,
    dailyGoalMinutes: 45,
    sweetNote: "Studying alongside my favorite girl ✨"
  }
};

export const VALID_CREDENTIALS = [
  { username: 'sakura@study.jp', password: 'sakura2026', profileKey: 'girlfriend' },
  { username: 'girlfriend', password: 'sakura2026', profileKey: 'girlfriend' },
  { username: 'nihongo', password: 'nihongo2026', profileKey: 'girlfriend' },
  { username: 'ian', password: 'love2026', profileKey: 'ian' },
  { username: 'yuzu', password: 'love2026', profileKey: 'ian' }
];

export function getStoredSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(profile));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY_AUTH);
}

export function authenticate(username: string, password: string):UserProfile | null {
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  const found = VALID_CREDENTIALS.find(
    c => c.username.toLowerCase() === cleanUser && c.password === cleanPass
  );

  if (found) {
    const storedCustom = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (storedCustom && found.profileKey === 'girlfriend') {
      try {
        const customProfile = JSON.parse(storedCustom);
        saveSession(customProfile);
        return customProfile;
      } catch {
        // fallback
      }
    }
    const profile = DEFAULT_PROFILES[found.profileKey];
    saveSession(profile);
    return profile;
  }
  return null;
}

export function updateProfile(updated: UserProfile): void {
  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));
  saveSession(updated);
}
