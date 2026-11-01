import { supabase } from './supabase';
import { UserRole } from '../types';
import { supabaseData } from './supabaseData';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  college?: string;
  role: UserRole;
  level: number;
  xp: number;
  accuracy: number;
  streak: number;
  completedCases: number;
}

export interface RegisterResult {
  token: string;
  user: AuthUser;
  /** True when Supabase created the account but has not issued a session yet (email confirmation is on). The user must confirm, then sign in — they are not logged in yet. */
  needsConfirmation?: boolean;
}

const TOKEN_KEY = 'tb_quest_jwt_token';
const CACHED_USER_KEY = 'tbquest_active_user';

function clearLocalSession() {
  localStorage.removeItem(TOKEN_KEY);
  // Remove any session cached by the old fake-login flow. A real session
  // is restored from Supabase itself (see getMe), never from this key.
  localStorage.removeItem(CACHED_USER_KEY);
}

class AuthService {
  /**
   * Supabase OAuth Sign In with Google.
   * Always returns to the site the user is actually on, so Google login
   * works on tb-quest-sdg-24.vercel.app, on localhost, and on any other
   * deployment — not a hardcoded old domain.
   */
  async loginWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      throw new Error(error.message || 'Google Sign-In failed. Please try again.');
    }
  }

  /**
   * Supabase-only email & password sign in.
   *
   * No backend shortcut, no auto-sign-up on a wrong password, and no
   * fake local session: if Supabase rejects the credentials, or issues
   * no session, this throws and the login page shows the real error.
   */
  async login(email: string, password: string, role: UserRole = 'student'): Promise<{ token: string; user: AuthUser }> {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      throw new Error('Please enter your email and password.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error || !data.user || !data.session) {
      clearLocalSession();
      throw new Error(error?.message || 'Authentication failed. Please check your credentials.');
    }

    localStorage.setItem(TOKEN_KEY, data.session.access_token);

    // Create a profile row for a real Supabase user who has none yet.
    // An existing profile is never overwritten here, so the stored role
    // (student / faculty / admin) stays authoritative — picking a different
    // role on the login screen does not escalate privileges.
    let profile = await supabaseData.fetchUserProfile(data.user.id);
    if (!profile) {
      profile = await supabaseData.updateUserProfile(data.user.id, {
        name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || cleanEmail.split('@')[0],
        email: data.user.email,
        role,
        level: 1,
        xp: 0,
        accuracy: 0,
        streak: 0,
        completed_cases: 0,
      });
    }

    const authUser: AuthUser = {
      id: data.user.id,
      name: profile?.name || data.user.user_metadata?.full_name || data.user.user_metadata?.name || 'New User',
      email: data.user.email || cleanEmail,
      mobile: profile?.mobile || '',
      college: profile?.college || '',
      role: profile?.role || role || 'student',
      level: profile?.level ?? 1,
      xp: profile?.xp ?? 0,
      accuracy: profile?.accuracy ?? 0,
      streak: profile?.streak ?? 0,
      completedCases: profile?.completed_cases ?? 0,
    };

    return { token: data.session.access_token, user: authUser };
  }

  /**
   * Supabase-only registration.
   *
   * If email confirmation is enabled in Supabase, signUp returns a user
   * with no session. That is not a login: this returns
   * needsConfirmation=true, stores no token, and the login page tells
   * the user to confirm their email and then sign in.
   */
  async register(
    name: string,
    email: string,
    password: string,
    role: UserRole,
    mobile: string = '',
    college: string = '',
  ): Promise<RegisterResult> {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password || !name.trim()) {
      throw new Error('Please enter your name, email and password.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { name: name.trim(), role, mobile, college },
      },
    });

    if (error || !data.user) {
      clearLocalSession();
      throw new Error(error?.message || 'Registration failed. Please try again.');
    }

    const authUser: AuthUser = {
      id: data.user.id,
      name: name.trim(),
      email: cleanEmail,
      mobile: mobile.trim(),
      college: college.trim(),
      role,
      level: 1,
      xp: 0,
      accuracy: 0,
      streak: 0,
      completedCases: 0,
    };

    if (!data.session) {
      // Email confirmation pending — do not fake a session or a profile.
      // (A profile row cannot be created yet: RLS requires auth.uid() = id.)
      return { token: '', user: authUser, needsConfirmation: true };
    }

    localStorage.setItem(TOKEN_KEY, data.session.access_token);

    await supabaseData.updateUserProfile(data.user.id, {
      name: name.trim(),
      email: cleanEmail,
      mobile: mobile.trim(),
      college: college.trim(),
      role,
      level: 1,
      xp: 0,
      accuracy: 0,
      streak: 0,
      completed_cases: 0,
    });

    return { token: data.session.access_token, user: authUser };
  }

  /**
   * Session restore from Supabase only.
   *
   * The old code returned a cached `tbquest_active_user` object from
   * localStorage before ever checking Supabase, so a fake/expired
   * session survived refreshes. Now: no Supabase session = no user.
   */
  async getMe(): Promise<AuthUser | null> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session && session.user) {
        let profile = await supabaseData.fetchUserProfile(session.user.id);

        if (!profile) {
          const defaultName =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email?.split('@')[0] ||
            'New User';
          profile = await supabaseData.updateUserProfile(session.user.id, {
            name: defaultName,
            email: session.user.email,
            avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
            role: session.user.user_metadata?.role || 'student',
            level: 1,
            xp: 0,
            accuracy: 0,
            streak: 0,
            completed_cases: 0,
          });
        }

        localStorage.setItem(TOKEN_KEY, session.access_token);

        return {
          id: session.user.id,
          name: profile?.name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'New User',
          email: session.user.email || '',
          mobile: profile?.mobile || '',
          college: profile?.college || '',
          role: profile?.role || session.user.user_metadata?.role || 'student',
          level: profile?.level ?? 1,
          xp: profile?.xp ?? 0,
          accuracy: profile?.accuracy ?? 0,
          streak: profile?.streak ?? 0,
          completedCases: profile?.completed_cases ?? 0,
        };
      }
    } catch (e) {
      console.warn('Supabase getSession note:', e);
    }

    clearLocalSession();
    return null;
  }

  /**
   * Supabase password reset only. Throws on a real Supabase error
   * instead of reporting success when nothing was sent.
   */
  async forgotPassword(email: string): Promise<string> {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      throw new Error('Please enter your registered email address.');
    }
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: window.location.origin,
    });
    if (error) {
      throw new Error(error.message || 'Failed to send password reset request.');
    }
    return `Password reset link sent to ${cleanEmail}. Check your inbox.`;
  }

  /**
   * Supabase sign out, clearing any stale local session keys.
   */
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut note:', e);
    }
    clearLocalSession();
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}

export const authService = new AuthService();
