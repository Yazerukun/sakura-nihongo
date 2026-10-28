import { LicenseRecord, StudentLicenseStatus, LicensingStats, UserProfile, TimeRemainingDetail } from '../types';

const STORAGE_KEY_LICENSES = 'sakura_licenses_db';
const STORAGE_KEY_ACTIVE_LICENSE = 'sakura_active_license_code';
const STORAGE_KEY_DEVICE_ID = 'sakura_device_fingerprint';

/**
 * Generate or retrieve persistent hardware/browser device fingerprint
 */
export function getDeviceId(): string {
  try {
    let deviceId = localStorage.getItem(STORAGE_KEY_DEVICE_ID);
    if (!deviceId) {
      const randHex = Math.random().toString(36).substring(2, 10);
      const timeStamp = Date.now().toString(36);
      deviceId = `dev_${timeStamp}_${randHex}`;
      localStorage.setItem(STORAGE_KEY_DEVICE_ID, deviceId);
    }
    return deviceId;
  } catch {
    return 'dev_fallback_anonymous';
  }
}

/**
 * Get human-readable device name for security audits
 */
export function getDeviceName(): string {
  if (typeof navigator === 'undefined') return 'Unknown Device';
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return '📱 Android Phone';
  if (/iPad|iPhone|iPod/.test(ua)) return '📱 iOS / iPhone';
  if (/Macintosh|Mac OS X/.test(ua)) return '💻 Apple Mac';
  if (/Windows/i.test(ua)) return '💻 Windows PC';
  if (/Linux/i.test(ua)) return '💻 Linux Station';
  return '🌐 Web Browser';
}

/**
 * Calculate high-precision live countdown ticker breakdown (Days, Hours, Minutes, Seconds)
 */
export function getTimeRemainingDetailed(expiresAt?: string): TimeRemainingDetail {
  if (!expiresAt) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isExpired: true,
      formatted: '00d 00h 00m 00s'
    };
  }

  const expiry = new Date(expiresAt).getTime();
  const now = Date.now();
  const diff = expiry - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isExpired: true,
      formatted: 'Expired'
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted = `${days > 0 ? `${days}d ` : ''}${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isExpired: false,
    formatted
  };
}

/**
 * Calculate days remaining until expiry
 */
export function getDaysRemaining(expiresAt?: string): number {
  if (!expiresAt) return 0;
  const expiry = new Date(expiresAt).getTime();
  const now = Date.now();
  const diff = expiry - now;
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Seed initial mock data so Mariel has an instant overview on first launch
 */
function getInitialSeedLicenses(): LicenseRecord[] {
  const now = new Date();
  
  const student1Expiry = new Date(now);
  student1Expiry.setDate(student1Expiry.getDate() + 27);

  const student2Expiry = new Date(now);
  student2Expiry.setDate(student2Expiry.getDate() + 19);

  return [
    {
      id: 'lic_seed_001',
      code: 'SAKURA-30D-M7B2-99F1',
      studentName: 'Angelica Ramos',
      planDurationDays: 30,
      pricePaid: 199,
      status: 'unused',
      createdAt: new Date(now.getTime() - 2 * 3600000).toISOString(),
      notes: 'GCash Ref #8892101 - JFT Reviewer'
    },
    {
      id: 'lic_seed_002',
      code: 'SAKURA-30D-K4E8-21A3',
      studentName: 'Kenji Bautista',
      planDurationDays: 30,
      pricePaid: 199,
      status: 'active',
      createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
      activatedAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
      expiresAt: student1Expiry.toISOString(),
      boundDeviceId: 'dev_mock_kenji_phone',
      boundDeviceName: '📱 Android Phone (Samsung)',
      notes: 'Paid via GCash ₱199'
    },
    {
      id: 'lic_seed_003',
      code: 'SAKURA-30D-R9T5-83C7',
      studentName: 'Mae Dela Cruz',
      planDurationDays: 30,
      pricePaid: 199,
      status: 'active',
      createdAt: new Date(now.getTime() - 11 * 86400000).toISOString(),
      activatedAt: new Date(now.getTime() - 11 * 86400000).toISOString(),
      expiresAt: student2Expiry.toISOString(),
      boundDeviceId: 'dev_mock_mae_iphone',
      boundDeviceName: '📱 iPhone / iOS',
      notes: 'JLPT N4 Prep Classmate'
    }
  ];
}

/**
 * Retrieve all registered licenses
 */
export function getLicenses(): LicenseRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LICENSES);
    if (!raw) {
      const seed = getInitialSeedLicenses();
      localStorage.setItem(STORAGE_KEY_LICENSES, JSON.stringify(seed));
      return seed;
    }
    const list: LicenseRecord[] = JSON.parse(raw);
    
    // Auto-update expired statuses
    let hasChanges = false;
    const now = Date.now();
    for (const lic of list) {
      if (lic.status === 'active' && lic.expiresAt && new Date(lic.expiresAt).getTime() < now) {
        lic.status = 'expired';
        hasChanges = true;
      }
    }
    if (hasChanges) {
      saveLicenses(list);
    }
    return list;
  } catch {
    return [];
  }
}

/**
 * Save licenses list
 */
export function saveLicenses(licenses: LicenseRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LICENSES, JSON.stringify(licenses));
  } catch (err) {
    console.error('Failed to save licenses to storage', err);
  }
}

/**
 * Generate a new random 30-day license key
 */
export function generateLicenseKey(params: {
  studentName: string;
  durationDays?: number;
  pricePaid?: number;
  notes?: string;
  adminUser?: UserProfile | null;
}): LicenseRecord {
  // STRICT SECURITY GATE: Only nihon11 can generate license keys!
  if (params.adminUser && params.adminUser.username !== 'nihon11') {
    throw new Error('Unauthorized: Only administrator account (nihon11) can generate licenses.');
  }

  const duration = params.durationDays || 30;
  const price = params.pricePaid !== undefined ? params.pricePaid : 199;
  
  // Format: SAKURA-30D-XXXX-YYYY
  const chunk1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const chunk2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const code = `SAKURA-${duration}D-${chunk1}-${chunk2}`;

  const newRecord: LicenseRecord = {
    id: `lic_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    code,
    studentName: params.studentName.trim() || 'Valued Classmate',
    planDurationDays: duration,
    pricePaid: price,
    status: 'unused',
    createdAt: new Date().toISOString(),
    notes: params.notes || '1-Month VIP Access'
  };

  const list = getLicenses();
  list.unshift(newRecord);
  saveLicenses(list);

  return newRecord;
}

/**
 * Activate a license key for a student on current device
 */
export function activateLicense(
  inputCode: string,
  providedName?: string
): { success: boolean; message: string; license?: LicenseRecord } {
  const cleanCode = inputCode.trim().toUpperCase();
  if (!cleanCode) {
    return { success: false, message: 'Please enter a valid license code.' };
  }

  const list = getLicenses();
  const index = list.findIndex(l => l.code.toUpperCase() === cleanCode);

  if (index === -1) {
    return {
      success: false,
      message: 'Invalid license key. Please check the code or contact Mariel.'
    };
  }

  const lic = list[index];
  const currentDeviceId = getDeviceId();
  const currentDeviceName = getDeviceName();

  if (lic.status === 'revoked') {
    return {
      success: false,
      message: 'This license has been deactivated. Please contact administrator Mariel.'
    };
  }

  if (lic.status === 'expired') {
    return {
      success: false,
      message: 'This 1-month license has already expired. Please renew with Mariel.'
    };
  }

  // Device Lock Anti-Piracy Check
  if (lic.boundDeviceId && lic.boundDeviceId !== currentDeviceId) {
    return {
      success: false,
      message: `Security Notice: This license is already locked to another device (${lic.boundDeviceName || 'Other Device'}). License sharing is strictly prohibited. Please message Mariel to reset device binding if you changed your phone.`
    };
  }

  // First time activation
  if (lic.status === 'unused') {
    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + lic.planDurationDays);

    lic.status = 'active';
    lic.activatedAt = now.toISOString();
    lic.expiresAt = expiry.toISOString();
    lic.boundDeviceId = currentDeviceId;
    lic.boundDeviceName = currentDeviceName;
    if (providedName && (!lic.studentName || lic.studentName === 'Valued Classmate')) {
      lic.studentName = providedName.trim();
    }

    list[index] = lic;
    saveLicenses(list);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_LICENSE, lic.code);
    } catch {}

    return {
      success: true,
      message: `🌸 Welcome ${lic.studentName}! Your 30-day VIP pass is now active on this device!`,
      license: lic
    };
  }

  // Already active on this same device
  if (lic.status === 'active' && lic.boundDeviceId === currentDeviceId) {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_LICENSE, lic.code);
    } catch {}
    const daysLeft = getDaysRemaining(lic.expiresAt);
    return {
      success: true,
      message: `Your license is active on this device with ${daysLeft} days remaining.`,
      license: lic
    };
  }

  return {
    success: false,
    message: 'Unable to process license activation. Please try again.'
  };
}

/**
 * Check if the current user has active VIP license (or 24h newly created trial)
 */
export function checkCurrentLicense(user?: UserProfile | null): StudentLicenseStatus {
  // STRICT: Only nihon11 is the true administrator
  if (user?.username === 'nihon11') {
    return {
      hasValidLicense: true,
      isTrial: false,
      daysRemaining: 9999,
      isExpired: false,
      isLockedToOtherDevice: false
    };
  }

  // 1. Check paid 30-day license
  const activeCode = localStorage.getItem(STORAGE_KEY_ACTIVE_LICENSE);
  if (activeCode) {
    const list = getLicenses();
    const lic = list.find(l => l.code.toUpperCase() === activeCode.trim().toUpperCase());
    if (lic) {
      const currentDeviceId = getDeviceId();
      if (lic.boundDeviceId && lic.boundDeviceId !== currentDeviceId) {
        return {
          hasValidLicense: false,
          license: lic,
          daysRemaining: 0,
          isExpired: false,
          isLockedToOtherDevice: true,
          lockedDeviceName: lic.boundDeviceName
        };
      }

      const timeDetail = getTimeRemainingDetailed(lic.expiresAt);
      if (timeDetail.isExpired) {
        lic.status = 'expired';
        saveLicenses(list);
        return {
          hasValidLicense: false,
          license: lic,
          daysRemaining: 0,
          timeRemaining: timeDetail,
          isExpired: true,
          isLockedToOtherDevice: false,
          expiresAt: lic.expiresAt
        };
      }

      return {
        hasValidLicense: true,
        isTrial: false,
        license: lic,
        daysRemaining: getDaysRemaining(lic.expiresAt),
        timeRemaining: timeDetail,
        isExpired: false,
        isLockedToOtherDevice: false,
        expiresAt: lic.expiresAt
      };
    }
  }

  // 2. Check 24-Hour Instant Access Trial for newly created student account
  if (user?.trialExpiresAt) {
    const trialDetail = getTimeRemainingDetailed(user.trialExpiresAt);
    if (!trialDetail.isExpired) {
      return {
        hasValidLicense: true,
        isTrial: true,
        daysRemaining: 1,
        timeRemaining: trialDetail,
        isExpired: false,
        isLockedToOtherDevice: false,
        expiresAt: user.trialExpiresAt
      };
    }
    return {
      hasValidLicense: false,
      isTrial: true,
      daysRemaining: 0,
      timeRemaining: trialDetail,
      isExpired: true,
      isLockedToOtherDevice: false,
      expiresAt: user.trialExpiresAt
    };
  }

  return {
    hasValidLicense: false,
    daysRemaining: 0,
    isExpired: false,
    isLockedToOtherDevice: false
  };
}

/**
 * Extend a student's license by +30 days (or custom days)
 */
export function extendLicense(licenseId: string, additionalDays = 30): LicenseRecord | null {
  const list = getLicenses();
  const idx = list.findIndex(l => l.id === licenseId);
  if (idx === -1) return null;

  const lic = list[idx];
  const currentExpiry = lic.expiresAt ? new Date(lic.expiresAt) : new Date();
  const baseTime = currentExpiry.getTime() > Date.now() ? currentExpiry.getTime() : Date.now();
  
  const newExpiry = new Date(baseTime);
  newExpiry.setDate(newExpiry.getDate() + additionalDays);

  lic.expiresAt = newExpiry.toISOString();
  lic.status = 'active';
  lic.planDurationDays += additionalDays;

  list[idx] = lic;
  saveLicenses(list);
  return lic;
}

/**
 * Reset device binding (allows student to move to a new phone or laptop)
 */
export function resetDeviceBinding(licenseId: string): LicenseRecord | null {
  const list = getLicenses();
  const idx = list.findIndex(l => l.id === licenseId);
  if (idx === -1) return null;

  list[idx].boundDeviceId = undefined;
  list[idx].boundDeviceName = undefined;

  saveLicenses(list);
  return list[idx];
}

/**
 * Toggle Revoke / Activate
 */
export function toggleRevokeLicense(licenseId: string): LicenseRecord | null {
  const list = getLicenses();
  const idx = list.findIndex(l => l.id === licenseId);
  if (idx === -1) return null;

  const lic = list[idx];
  if (lic.status === 'revoked') {
    lic.status = 'active';
  } else {
    lic.status = 'revoked';
  }

  list[idx] = lic;
  saveLicenses(list);
  return lic;
}

/**
 * Delete license permanently
 */
export function deleteLicense(licenseId: string): boolean {
  const list = getLicenses();
  const filtered = list.filter(l => l.id !== licenseId);
  if (filtered.length !== list.length) {
    saveLicenses(filtered);
    return true;
  }
  return false;
}

/**
 * Get summary stats for Mariel's admin view
 */
export function getLicensingStats(): LicensingStats {
  const list = getLicenses();
  let active = 0;
  let unused = 0;
  let expired = 0;
  let revenue = 0;

  for (const lic of list) {
    if (lic.status === 'active') active++;
    else if (lic.status === 'unused') unused++;
    else if (lic.status === 'expired' || lic.status === 'revoked') expired++;

    if (lic.status === 'active' || lic.status === 'expired') {
      revenue += lic.pricePaid || 199;
    }
  }

  return {
    totalLicenses: list.length,
    activeLicenses: active,
    unusedLicenses: unused,
    expiredLicenses: expired,
    estimatedRevenue: revenue
  };
}
