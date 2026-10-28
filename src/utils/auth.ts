import { UserProfile, LevelType } from '../types';

const STORAGE_KEY_AUTH = 'sakura_auth_session';
const STORAGE_KEY_PROFILE = 'sakura_user_profile';
const STORAGE_KEY_USERS = 'sakura_registered_users';

export interface RegisteredUserRecord {
  username: string;
  password: string;
  profile: UserProfile;
  createdAt: string;
}

// Built-in protected accounts (never exposed publicly on UI)
export const DEFAULT_PROFILES: Record<string, UserProfile> = {
  nihon11: {
    username: 'nihon11',
    displayName: 'Mariel (Admin • 桜)',
    avatar: '👑',
    targetLevel: 'JFT',
    examTargetDate: '2026-06-15',
    dailyGoalCards: 30,
    dailyGoalMinutes: 45,
    sweetNote: "Sakura Nihongo Administrator & Student Licensing Hub 🌸",
    role: 'admin'
  },
  mariel: {
    username: 'mariel',
    displayName: 'Mariel (マリエル)',
    avatar: '🌸',
    targetLevel: 'JFT',
    examTargetDate: '2026-06-15',
    dailyGoalCards: 20,
    dailyGoalMinutes: 30,
    sweetNote: "がんばって, Mariel! Ian believes in you and loves you with all his heart! ❤️✨",
    role: 'student'
  },
  ian: {
    username: 'ian',
    displayName: 'Ian (イアン)',
    avatar: '👑',
    targetLevel: 'JFT',
    examTargetDate: '2026-07-05',
    dailyGoalCards: 30,
    dailyGoalMinutes: 45,
    sweetNote: "Studying alongside my beloved Mariel ✨",
    role: 'student'
  }
};

// Built-in authentication credentials
const PROTECTED_CREDENTIALS = [
  { username: 'nihon11', password: 'nihon11', profileKey: 'nihon11' },
  { username: 'mariel', password: '111', profileKey: 'mariel' },
  { username: 'mariel@study.jp', password: '111', profileKey: 'mariel' },
  { username: 'ian', password: '111', profileKey: 'ian' },
  { username: 'ian', password: 'love2026', profileKey: 'ian' },
  { username: 'ian@admin.jp', password: '111', profileKey: 'ian' },
  { username: 'ian@admin.jp', password: 'love2026', profileKey: 'ian' }
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

export function getRegisteredUsers(): RegisteredUserRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function registerUser(params: {
  username: string;
  password: string;
  displayName: string;
  avatar?: string;
  targetLevel?: LevelType;
}): { success: boolean; error?: string; profile?: UserProfile } {
  const cleanUser = params.username.trim().toLowerCase();
  const cleanPass = params.password.trim();
  const cleanName = params.displayName.trim() || params.username.trim();

  if (!cleanUser || cleanUser.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters.' };
  }

  if (!cleanPass || cleanPass.length < 3) {
    return { success: false, error: 'Password must be at least 3 characters.' };
  }

  // Prevent hijacking protected accounts
  const reservedNames = ['ian', 'admin', 'mariel', 'sakura', 'nihon11'];
  if (reservedNames.includes(cleanUser)) {
    return { success: false, error: 'This username is reserved. Please choose a different one.' };
  }

  const existingUsers = getRegisteredUsers();
  if (existingUsers.some(u => u.username.toLowerCase() === cleanUser)) {
    return { success: false, error: 'Username is already registered. Please log in or choose another.' };
  }

  const now = new Date();
  const trialEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24-Hour Real-time Instant Access

  const newProfile: UserProfile = {
    username: cleanUser,
    displayName: cleanName,
    avatar: params.avatar || '🌸',
    targetLevel: params.targetLevel || 'JFT',
    examTargetDate: '2026-06-15',
    dailyGoalCards: 20,
    dailyGoalMinutes: 30,
    sweetNote: `Welcome to Sakura Nihongo, ${cleanName}! Ganbatte kudasai! 🌸`,
    role: 'student', // STRICT: Every registered classmate is always student
    registeredAt: now.toISOString(),
    trialExpiresAt: trialEnd.toISOString()
  };

  const newRecord: RegisteredUserRecord = {
    username: cleanUser,
    password: cleanPass,
    profile: newProfile,
    createdAt: new Date().toISOString()
  };

  existingUsers.push(newRecord);
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(existingUsers));
  } catch (err) {
    return { success: false, error: 'Failed to save account locally. Storage may be full.' };
  }

  saveSession(newProfile);
  return { success: true, profile: newProfile };
}

export function authenticate(username: string, password: string): UserProfile | null {
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanUser || !cleanPass) return null;

  // 1. Check protected accounts
  const foundProtected = PROTECTED_CREDENTIALS.find(
    c => c.username.toLowerCase() === cleanUser && c.password === cleanPass
  );

  if (foundProtected) {
    const storedCustom = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (storedCustom && foundProtected.profileKey === 'mariel') {
      try {
        const customProfile = JSON.parse(storedCustom);
        saveSession(customProfile);
        return customProfile;
      } catch {
        // fallback
      }
    }
    const profile = DEFAULT_PROFILES[foundProtected.profileKey];
    saveSession(profile);
    return profile;
  }

  // 2. Check dynamically registered users in real-time
  const registered = getRegisteredUsers();
  const matchedUser = registered.find(
    u => u.username.toLowerCase() === cleanUser && u.password === cleanPass
  );

  if (matchedUser) {
    saveSession(matchedUser.profile);
    return matchedUser.profile;
  }

  return null;
}

export function updateProfile(updated: UserProfile): void {
  // STRICT SECURITY GATE: Only nihon11 can ever have the 'admin' role
  if (updated.username.toLowerCase() !== 'nihon11') {
    updated.role = 'student';
  }

  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));
  saveSession(updated);

  // If this is a registered user, keep their stored record in sync
  const registered = getRegisteredUsers();
  const idx = registered.findIndex(u => u.username.toLowerCase() === updated.username.toLowerCase());
  if (idx !== -1) {
    registered[idx].profile = updated;
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registered));
  }
}
