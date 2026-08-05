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

const TOKEN_KEY = 'tb_quest_jwt_token';

class AuthService {
  /**
   * Supabase OAuth Sign In with Google
   */
  async loginWithGoogle(): Promise<void> {
    const redirectTo = window.location.origin.includes('localhost')
      ? window.location.origin
      : 'https://tb-frontend-flame.vercel.app';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) {
      throw new Error(error.message || 'Google Sign-In failed. Please try again.');
    }
  }

  /**
   * Supabase Real Auth Email & Password Sign In
   */
  async login(email: string, password: string, role: UserRole = 'student'): Promise<{ token: string; user: AuthUser }> {
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // Default placeholder email if empty
    const targetEmail = cleanEmail || `${role}@tbquest.org`;
    const targetPassword = password || 'Password123!';

    // 1. Attempt Supabase Auth Sign In
    let authRes = await supabase.auth.signInWithPassword({
      email: targetEmail,
      password: targetPassword
    });

    // 2. If user doesn't exist yet, auto-register for seamless experience
    if (authRes.error && (authRes.error.message.includes('Invalid login credentials') || authRes.error.message.includes('User not found'))) {
      const signUpRes = await supabase.auth.signUp({
        email: targetEmail,
        password: targetPassword,
        options: { data: { role, name: targetEmail.split('@')[0] } }
      });
      if (!signUpRes.error && signUpRes.data?.user) {
        authRes = { data: { user: signUpRes.data.user, session: signUpRes.data.session }, error: null };
      }
    }

    if (authRes.error || !authRes.data?.user) {
      throw new Error(authRes.error?.message || 'Authentication failed. Please check your credentials.');
    }

    const sessionUser = authRes.data.user;
    const token = authRes.data.session?.access_token || `sb_token_${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, token);

    // Read real role from profiles.role in Supabase
    let profile = await supabaseData.fetchUserProfile(sessionUser.id);
    if (!profile) {
      profile = await supabaseData.updateUserProfile(sessionUser.id, {
        name: sessionUser.user_metadata?.name || sessionUser.user_metadata?.full_name || targetEmail.split('@')[0],
        email: sessionUser.email || targetEmail,
        role: role || sessionUser.user_metadata?.role || 'student',
        level: 1,
        xp: 0,
        accuracy: 0,
        streak: 0,
        completed_cases: 0
      });
    }

    const authUser: AuthUser = {
      id: sessionUser.id,
      name: profile?.name || sessionUser.user_metadata?.name || targetEmail.split('@')[0],
      email: sessionUser.email || targetEmail,
      mobile: profile?.mobile || '',
      college: profile?.college || '',
      role: profile?.role || role || 'student',
      level: profile?.level ?? 1,
      xp: profile?.xp ?? 0,
      accuracy: profile?.accuracy ?? 0,
      streak: profile?.streak ?? 0,
      completedCases: profile?.completed_cases ?? 0
    };

    localStorage.setItem('tbquest_active_user', JSON.stringify(authUser));
    return { token, user: authUser };
  }

  /**
   * Supabase Real Auth Registration with full profile fields
   */
  async register(
    name: string,
    email: string,
    password: string,
    role: UserRole,
    mobile: string = '',
    college: string = ''
  ): Promise<{ token: string; user: AuthUser }> {
    const cleanEmail = (email || '').trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { name: name.trim(), role, mobile, college }
      }
    });

    if (error || !data?.user) {
      throw new Error(error?.message || 'Registration failed. Please try again.');
    }

    const token = data.session?.access_token || `sb_token_${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, token);

    const profile = await supabaseData.updateUserProfile(data.user.id, {
      name: name.trim(),
      email: cleanEmail,
      mobile: mobile.trim(),
      college: college.trim(),
      role,
      level: 1,
      xp: 0,
      accuracy: 0,
      streak: 0,
      completed_cases: 0
    });

    const authUser: AuthUser = {
      id: data.user.id,
      name: name.trim(),
      email: cleanEmail,
      mobile: mobile.trim(),
      college: college.trim(),
      role: profile?.role || role,
      level: profile?.level ?? 1,
      xp: profile?.xp ?? 0,
      accuracy: profile?.accuracy ?? 0,
      streak: profile?.streak ?? 0,
      completedCases: profile?.completed_cases ?? 0
    };

    localStorage.setItem('tbquest_active_user', JSON.stringify(authUser));
    return { token, user: authUser };
  }

  /**
   * Session Restore via Supabase Auth & Local Storage
   */
  async getMe(): Promise<AuthUser | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        let profile = await supabaseData.fetchUserProfile(session.user.id);
        
        if (!profile) {
          const defaultName = session.user.user_metadata?.full_name || 
                              session.user.user_metadata?.name || 
                              session.user.email?.split('@')[0] || 
                              'Doctor';

          profile = await supabaseData.updateUserProfile(session.user.id, {
            name: defaultName,
            email: session.user.email,
            avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
            role: session.user.user_metadata?.role || 'student',
            level: 1,
            xp: 0,
            accuracy: 0,
            streak: 0,
            completed_cases: 0
          });
        }

        const sessionToken = session.access_token || 'sb_session_active';
        localStorage.setItem(TOKEN_KEY, sessionToken);

        const user: AuthUser = {
          id: session.user.id,
          name: profile?.name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Doctor',
          email: session.user.email || '',
          mobile: profile?.mobile || '',
          college: profile?.college || '',
          role: profile?.role || session.user.user_metadata?.role || 'student',
          level: profile?.level ?? 1,
          xp: profile?.xp ?? 0,
          accuracy: profile?.accuracy ?? 0,
          streak: profile?.streak ?? 0,
          completedCases: profile?.completed_cases ?? 0
        };

        localStorage.setItem('tbquest_active_user', JSON.stringify(user));
        return user;
      }
    } catch (e) {
      console.warn('Supabase getSession note:', e);
    }

    // Restore cached session if present
    const cachedUser = localStorage.getItem('tbquest_active_user');
    if (cachedUser && localStorage.getItem(TOKEN_KEY)) {
      try {
        return JSON.parse(cachedUser);
      } catch (e) {
        console.warn('Cached user parse error:', e);
      }
    }

    return null;
  }

  /**
   * Supabase Reset Password
   */
  async forgotPassword(email: string): Promise<string> {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) {
      throw new Error(error.message || 'Failed to send reset link.');
    }
    return `Password reset link sent to ${email || 'your email'}. Check your inbox.`;
  }

  /**
   * Supabase Sign Out
   */
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut note:', e);
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('tbquest_active_user');
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}

export const authService = new AuthService();

