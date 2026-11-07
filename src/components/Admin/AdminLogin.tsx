import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Mail, AlertCircle, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, UserCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import adminProfileImg from '../../assets/images/mushahid_admin_profile.jpg';

const ADMIN_IMAGE = (adminProfileImg as any)?.src || (typeof adminProfileImg === 'string' ? adminProfileImg : '') || '/assets/images/mushahid_admin_profile.jpg';

interface AdminLoginProps {
  onLoginSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<'admin' | 'team'>('admin');
  const [email, setEmail] = useState('mushahidrafiqe744@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('admin_saved_email');
        if (saved) setEmail(saved);
      }
    } catch (e) {}
  }, []);

  const handleAdminDemo = () => {
    try {
      sessionStorage.setItem('admin_token', 'demo_admin_access_token');
      localStorage.setItem('admin_token', 'demo_admin_access_token');
      localStorage.setItem('admin_user', JSON.stringify({ email: 'mushahidrafiqe744@gmail.com', role: 'admin' }));
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Pehle Email enter karein!');
      return;
    }

    if (!password.trim() || password.length < 6) {
      setErrorMsg('Password kam az kam 6 characters ka hona chahiye.');
      return;
    }

    if (!supabase) {
      setErrorMsg('Supabase is not configured. Use the 1-Click Admin Demo button below.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              role: role === 'admin' ? 'admin' : 'team_member',
              name: 'Mushahid Hussain',
            },
          },
        });

        if (error) throw error;

        if (data?.session) {
          sessionStorage.setItem('admin_token', data.session.access_token);
          localStorage.setItem('admin_token', data.session.access_token);
          localStorage.setItem('admin_user', JSON.stringify(data.user));
          if (onLoginSuccess) onLoginSuccess();
        } else {
          setSuccessMsg('Account create ho gaya! Agar email confirmation enabled hai to Supabase inbox check karein ya direct Demo button use karein.');
        }
      } else {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;

        if (data?.session) {
          try {
            localStorage.setItem('admin_saved_email', email.trim());
          } catch (e) {}
          sessionStorage.setItem('admin_token', data.session.access_token);
          localStorage.setItem('admin_token', data.session.access_token);
          localStorage.setItem('admin_user', JSON.stringify(data.user));
          if (onLoginSuccess) onLoginSuccess();
        } else {
          setErrorMsg('Authentication failed. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('[ADMIN LOGIN] Error:', err);
      const msg = err.message || '';
      if (msg === 'Failed to fetch') {
        setErrorMsg('Network Error: Supabase se connect nahi ho raha. Aap 1-Click "Admin Demo" button use kar ke login kar saktay hain.');
      } else if (msg.includes('Invalid login credentials')) {
        setErrorMsg('Ghalat password ya email! Agar account nahi bana hua to "Create Account" tab par click karein ya "Admin Demo" use karein.');
      } else if (msg.includes('Email not confirmed')) {
        setErrorMsg('Email confirm nahi hui. Supabase Dashboard mein "Confirm Email" off karein ya "Admin Demo" use karein.');
      } else {
        setErrorMsg(msg || 'Login fail ho gaya.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-[#F8FAF9] to-[#E8F2EC] p-4">
      <div className="w-full max-w-sm">
        <div className="p-7 sm:p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
          
          {/* Top lock badge indicator */}
          <div className="w-full flex items-center justify-between mb-3">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#0A3D22] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Site</span>
            </a>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Secure Access</span>
            </div>
          </div>

          {/* Admin Avatar */}
          <div className="relative mb-3">
            <img
              src={ADMIN_IMAGE}
              alt="Mushahid Hussain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/assets/images/mushahid_admin_profile.jpg';
              }}
              className="w-20 h-20 rounded-full object-cover border-4 border-[#50E364] shadow-md"
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0A3D22] border-2 border-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#50E364]" />
            </div>
          </div>

          <h2 className="text-xl font-black text-[#0A3D22] mb-0.5">Admin Security Lock</h2>
          <p className="text-xs text-gray-600 font-medium mb-3">
            {mode === 'signin' ? 'Sign in to access admin panel' : 'Create new admin or team account'}
          </p>

          {/* Tabs: Sign In / Create Account */}
          <div className="w-full grid grid-cols-2 p-1 bg-gray-100 rounded-xl mb-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-[#0A3D22] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#0A3D22] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="w-full mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="w-full mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-start gap-2 text-left">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full text-left space-y-3">
            {/* Role dropdown for signup */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                  Account Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#0A3D22]/20 focus:border-[#0A3D22] cursor-pointer"
                >
                  <option value="admin">Administrator</option>
                  <option value="team">Team Member</option>
                </select>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  Email <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-gray-400 font-medium">Supabase Auth</span>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter email..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#0A3D22]/20 focus:border-[#0A3D22] transition-all"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  Password <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-gray-400 font-medium">Min 6 characters</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter password..."
                  className="w-full px-3.5 py-2 pr-10 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#0A3D22]/20 focus:border-[#0A3D22] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 hover:scale-[1.01] ${
                mode === 'signup'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-[#0A3D22] hover:bg-[#114D2C] text-[#50E364]'
              }`}
            >
              {mode === 'signup' ? <UserCheck className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              <span>
                {loading
                  ? 'Please wait...'
                  : mode === 'signup'
                  ? 'Create Account'
                  : 'Sign In with Supabase'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Access Button matching attachment image_3fffd7d2.png */}
          <div className="w-full mt-5 pt-4 border-t border-gray-100 flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">
              QUICK 1-CLICK DEMO ACCESS
            </span>
            <button
              type="button"
              onClick={handleAdminDemo}
              className="w-full py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-[#0A3D22] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs hover:scale-[1.01] cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin Demo</span>
            </button>
          </div>

          <p className="mt-3 text-[10px] text-gray-400 font-medium italic">
            Admin demo access allows managing hero, projects, about, and skills.
          </p>
        </div>
      </div>
    </div>
  );
};
