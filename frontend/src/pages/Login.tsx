import { useState, FormEvent } from 'react';
import { UserRole } from '../types';
import { Shield, Lock, Mail, ArrowRight, Sparkles, User as UserIcon, AlertCircle, CheckCircle2, Phone, GraduationCap } from 'lucide-react';
import { authService } from '../services/authService';
import { soundService } from '../services/soundService';

interface LoginProps {
  onLogin: (role: UserRole, email: string, name: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [college, setCollege] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (authMode === 'login') {
        const { user } = await authService.login(email, password, role);
        soundService.playLoginSuccess();
        onLogin(user.role, user.email, user.name);
      } else if (authMode === 'register') {
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match. Please re-enter.');
          soundService.playLoginFail();
          setIsLoading(false);
          return;
        }
        const { user } = await authService.register(name, email, password, role, mobile, college);
        soundService.playLoginSuccess();
        onLogin(user.role, user.email, user.name);
      } else if (authMode === 'forgot') {
        const msg = await authService.forgotPassword(email);
        soundService.playLoginSuccess();
        setSuccessMsg(msg);
        setIsLoading(false);
      }
    } catch (err: any) {
      soundService.playLoginFail();
      setErrorMsg(err.message || 'Authentication failed. Please check your details.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    try {
      await authService.loginWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Sign-In failed or was cancelled.');
      setIsGoogleLoading(false);
    }
  };

  const handleRoleSelect = (r: UserRole) => {
    setRole(r);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#060913] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glowing lung/circuit effects */}
      <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative z-10 my-4 max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex p-2 bg-white/10 backdrop-blur-md border border-cyan-500/30 rounded-xl mb-3 shadow-md shadow-cyan-500/20">
            <img 
              src="/nit_logo.png" 
              alt="TB Quest Official Logo" 
              className="w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] md:w-[48px] md:h-[48px] object-contain rounded-[8px]" 
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 uppercase">
            TB QUEST
          </h1>
          <p className="text-cyan-300/80 text-[10px] font-extrabold uppercase tracking-widest mt-0.5">TB DIAGNOSTIC LEARNING PLATFORM</p>

          {/* Prominent Auth Mode Navigation Tabs */}
          <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl mt-4">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('forgot'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMode === 'forgot'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Forgot Password
            </button>
          </div>
        </div>

        {/* Role Selector & Instant Access Option */}
        {authMode !== 'forgot' && (
          <div className="space-y-2 mb-4 sm:mb-6">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1 text-left">
              Select User Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['student', 'faculty', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    role === r
                      ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{r}</span>
                  {role === r && <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 animate-ping" />}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={async () => {
                setIsLoading(true);
                setErrorMsg(null);
                try {
                  const demoEmail = `${role}@tbquest.org`;
                  const demoPassword = 'Password123!';
                  const { user } = await authService.login(demoEmail, demoPassword, role);
                  onLogin(user.role, user.email, user.name);
                } catch (err: any) {
                  setErrorMsg(err.message || 'Instant login failed.');
                  setIsLoading(false);
                }
              }}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600/30 via-teal-600/30 to-cyan-600/30 hover:from-emerald-600/50 hover:to-cyan-600/50 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm mt-2"
            >
              <Sparkles size={15} className="text-emerald-400 shrink-0" />
              <span>Instant {role.toUpperCase()} Portal Access</span>
            </button>
          </div>
        )}


        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-xs flex items-center gap-2 font-mono">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2 font-mono">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-xs uppercase font-mono text-slate-400 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Full Name"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 sm:py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-slate-400 mb-1.5">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 sm:py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-slate-400 mb-1.5">Medical College / Institution</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. Navodaya Institute of Technology / RMC"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 sm:py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-xs"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs uppercase font-mono text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@institution.edu"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 sm:py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-xs"
                required
              />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div>
              <label className="block text-xs uppercase font-mono text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 sm:py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-xs"
                  required
                />
              </div>
            </div>
          )}

          {authMode === 'register' && (
            <div>
              <label className="block text-xs uppercase font-mono text-slate-400 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 sm:py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-xs"
                  required
                />
              </div>
            </div>
          )}


          {authMode === 'login' && (
            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0" />
                <span>Remember Me</span>
              </label>
              <button
                type="button"
                onClick={() => { setAuthMode('forgot'); setErrorMsg(null); setSuccessMsg(null); }}
                className="hover:text-cyan-400 transition-colors text-[11px] sm:text-xs"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3.5 sm:py-4 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50"
          >
            <span>
              {isLoading
                ? 'AUTHENTICATING...'
                : authMode === 'login'
                ? 'LOGIN TO TB QUEST'
                : authMode === 'register'
                ? 'CREATE ACCOUNT'
                : 'SEND RESET LINK'}
            </span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Divider */}
        {authMode !== 'forgot' && (
          <div className="my-4 sm:my-5 flex items-center gap-3 text-xs text-slate-500 font-mono">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span>OR</span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>
        )}

        {/* Continue with Google Sign-In Button */}
        {authMode !== 'forgot' && (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-3 sm:py-3.5 bg-slate-950 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/50 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-3 shadow-lg transition-all transform active:scale-[0.99] disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.1-6.68-4.93H1.21v3.15C3.21 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.21C.44 8.11 0 9.99 0 12s.44 3.89 1.21 5.42l4.11-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.21 2.64 1.21 6.58l4.11 3.15c.94-2.83 3.57-4.98 6.68-4.98z"
              />
            </svg>
            <span>{isGoogleLoading ? 'CONNECTING TO GOOGLE...' : 'Continue with Google'}</span>
          </button>
        )}

        {/* Mode Switch Footers */}
        <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400 flex justify-between items-center">
          {authMode === 'login' ? (
            <>
              <span>Need an account?</span>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMsg(null); setSuccessMsg(null); }}
                className="text-cyan-400 hover:underline font-bold"
              >
                Register Here
              </button>
            </>
          ) : (
            <>
              <span>Back to Sign In?</span>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMsg(null); setSuccessMsg(null); }}
                className="text-cyan-400 hover:underline font-bold"
              >
                Sign In
              </button>
            </>
          )}
        </div>

        <div className="mt-3 sm:mt-4 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1 font-mono">
          <Sparkles size={12} className="text-cyan-400 shrink-0" />
          <span>Skill Development Center • NIT Raichur</span>
        </div>
      </div>
    </div>
  );
}
