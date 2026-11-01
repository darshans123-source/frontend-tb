import { supabase } from './supabase';

/**
 * Student PIN login — name + phone + a 4-digit key the student sets once
 * at registration. No email, no password, no OTP.
 *
 * Faculty/Admin are NOT handled here: they stay on Supabase email +
 * password in authService.ts.
 *
 * How the key is protected (see supabase_student_login.sql, which must be
 * run once in Supabase before this works):
 * - The app never reads the student_accounts table directly and never
 *   stores or receives the key or its hash.
 * - Register/login go through SECURITY DEFINER Postgres functions that
 *   hash the key with a random per-student salt inside Postgres
 *   (SHA-256) and return the student row WITHOUT the hash/salt.
 * - The browser only keeps the student's id/name/phone/college in
 *   localStorage so a refresh can restore the session. On restore,
 *   getSession() re-checks the row in Supabase, so deleting a row in
 *   Supabase signs that student out.
 */

export interface StudentAccount {
  id: string;
  name: string;
  phone: string;
  college: string;
  level: number;
  xp: number;
  accuracy: number;
  streak: number;
  completedCases: number;
}

export const STUDENT_SESSION_KEY = 'tbquest_student_session';

/**
 * Normalise a phone number so "+91 98765 43210", "09876543210" and
 * "9876543210" all match the same student. The same normalisation is
 * applied at registration and at login.
 */
export function normalizePhone(raw: string): string {
  let digits = (raw || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}

// A missing function comes back from PostgREST as PGRST202 ("Could not find
// the function ..."). Do NOT treat Postgres 42883 as a setup error: 42883 is
// also the code for a real error inside an existing function (e.g. a bad
// digest() call), and masking it as "not set up yet" hides the real problem.
function isSetupError(err: any): boolean {
  const msg = String(err?.message || '');
  return err?.code === 'PGRST202' || msg.includes('Could not find the function');
}

function friendlyError(err: any, fallback: string): Error {
  if (isSetupError(err)) {
    return new Error(
      'Student login is not set up in Supabase yet. Run supabase_student_login.sql once in Supabase SQL Editor, then try again.',
    );
  }
  return new Error(err?.message || fallback);
}

function rowToAccount(row: any): StudentAccount {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    college: row.college || '',
    level: row.level ?? 1,
    xp: row.xp ?? 0,
    accuracy: row.accuracy ?? 0,
    streak: row.streak ?? 0,
    completedCases: row.completed_cases ?? 0,
  };
}

function firstRow(data: any): any | null {
  if (!data) return null;
  return Array.isArray(data) ? data[0] || null : data;
}

class StudentAuthService {
  private saveSession(account: StudentAccount) {
    try {
      localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(account));
    } catch {
      // Private browsing etc. — login still succeeds for this page load.
    }
  }

  logout() {
    try {
      localStorage.removeItem(STUDENT_SESSION_KEY);
    } catch {
      // ignore
    }
  }

  hasLocalSession(): boolean {
    try {
      return !!localStorage.getItem(STUDENT_SESSION_KEY);
    } catch {
      return false;
    }
  }

  async register(
    name: string,
    phoneRaw: string,
    college: string,
    pin: string,
  ): Promise<StudentAccount> {
    const cleanName = (name || '').trim();
    const phone = normalizePhone(phoneRaw);
    if (!cleanName) throw new Error('Please enter your full name.');
    if (phone.length < 10) throw new Error('Please enter a valid phone number (at least 10 digits).');
    if (!/^[0-9]{4}$/.test(pin || '')) throw new Error('Your key must be exactly 4 digits.');

    const { data, error } = await supabase.rpc('register_student_account', {
      p_name: cleanName,
      p_phone: phone,
      p_college: (college || '').trim(),
      p_pin: pin,
    });

    if (error) {
      if (String(error.message || '').includes('phone already registered')) {
        throw new Error('This phone number is already registered. Please sign in with your 4-digit key.');
      }
      throw friendlyError(error, 'Student registration failed. Please try again.');
    }

    const row = firstRow(data);
    if (!row) throw new Error('Student registration failed. Please try again.');
    const account = rowToAccount(row);
    this.saveSession(account);
    return account;
  }

  async login(name: string, phoneRaw: string, pin: string): Promise<StudentAccount> {
    const cleanName = (name || '').trim();
    const phone = normalizePhone(phoneRaw);
    if (!cleanName) throw new Error('Please enter your full name.');
    if (phone.length < 10) throw new Error('Please enter a valid phone number (at least 10 digits).');
    if (!/^[0-9]{4}$/.test(pin || '')) throw new Error('Your key must be exactly 4 digits.');

    const { data, error } = await supabase.rpc('verify_student_login', {
      p_name: cleanName,
      p_phone: phone,
      p_pin: pin,
    });

    if (error) throw friendlyError(error, 'Student sign-in failed. Please try again.');
    const row = firstRow(data);
    if (!row) {
      throw new Error('Name, phone number or 4-digit key does not match. Please check and try again.');
    }
    const account = rowToAccount(row);
    this.saveSession(account);
    return account;
  }

  /**
   * Restore a student session, verified against Supabase. Returns null
   * (and clears the local copy) when there is no local session, the row
   * was deleted, or the student functions are not set up yet — so a
   * missing SQL setup never breaks email login for faculty/admin.
   */
  async getSession(): Promise<StudentAccount | null> {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STUDENT_SESSION_KEY);
    } catch {
      return null;
    }
    if (!stored) return null;

    let parsed: any;
    try {
      parsed = JSON.parse(stored);
    } catch {
      this.logout();
      return null;
    }
    if (!parsed?.id) {
      this.logout();
      return null;
    }

    try {
      const { data, error } = await supabase.rpc('get_student_account', { p_id: parsed.id });
      if (error) {
        // Setup missing or transient error: do not trust the local copy
        // for a fresh restore, but do not throw into email-login flows.
        this.logout();
        return null;
      }
      const row = firstRow(data);
      if (!row) {
        this.logout();
        return null;
      }
      const account = rowToAccount(row);
      this.saveSession(account);
      return account;
    } catch {
      this.logout();
      return null;
    }
  }
}

export const studentAuthService = new StudentAuthService();
