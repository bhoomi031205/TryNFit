import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  Check
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, resetPassword } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const redirectPath = location.state?.from || '/studio';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === 'forgot') {
      if (!email) {
        setError('Please provide your account email address.');
        return;
      }
      setIsLoading(true);
      try {
        await resetPassword(email);
        setSuccessMessage('Password reset link sent! Check your email inbox.');
      } catch (err) {
        setError(err.message || 'Could not send reset email. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup' && !name) {
      setError('Please provide your full name.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        navigate(redirectPath);
      } else {
        const res = await signup(name, email, password);
        if (res) {
          setSuccessMessage('Account created successfully! Welcome to TryNFit.');
          setTimeout(() => navigate(redirectPath), 600);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-8 sm:py-14 flex items-center justify-center px-4 sm:px-6 relative overflow-hidden bg-pearl-white">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-blush-100/60 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Brand Perks */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between h-full p-8 rounded-3xl card-pearl shadow-card-pearl bg-pearl-warm">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-blush-primary p-[1.5px] shadow-sm mb-6">
              <div className="w-full h-full bg-pearl-white rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blush-500" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-ink-900 font-outfit leading-tight mb-2">
              Your Personal AI Fitting Studio
            </h2>
            <p className="text-xs text-ink-600 leading-relaxed mb-6">
              Sign in to save fits to your personal digital wardrobe, sync your saved looks across devices, and test clothing in seconds.
            </p>

            {/* Feature checklist */}
            <div className="space-y-3.5">
              <div className="flex items-start space-x-3 text-xs text-ink-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-blush-500 shrink-0 mt-0.5" />
                <span>Save and organize unlimited virtual outfits</span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-ink-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-blush-500 shrink-0 mt-0.5" />
                <span>Side-by-side Before/After split comparisons</span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-ink-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-blush-500 shrink-0 mt-0.5" />
                <span>Automatic history sync with Supabase cloud database</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-blush-border flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-blush-500 shrink-0" />
            <p className="text-[11px] text-ink-500">
              Privacy guarantee: photos are processed in memory and securely saved to your account.
            </p>
          </div>
        </div>

        {/* Right Side: Auth Card Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl card-pearl shadow-card-pearl bg-pearl-white">
          {/* Mode Tabs */}
          {mode !== 'forgot' ? (
            <div className="flex items-center p-1 rounded-2xl bg-pearl-warm border border-blush-border mb-8">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all font-outfit ${
                  mode === 'login'
                    ? 'pill-pink-active'
                    : 'text-ink-600 hover:text-blush-500'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all font-outfit ${
                  mode === 'signup'
                    ? 'pill-pink-active'
                    : 'text-ink-600 hover:text-blush-500'
                }`}
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-xs font-bold text-blush-500 hover:underline mb-2 inline-block"
              >
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* Form Header */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold text-ink-900 font-outfit">
              {mode === 'login'
                ? 'Welcome Back to TryNFit'
                : mode === 'signup'
                ? 'Join TryNFit Studio'
                : 'Reset Your Password'}
            </h1>
            <p className="text-xs text-ink-600 mt-1">
              {mode === 'login'
                ? 'Enter your email and password to access your fitting studio.'
                : mode === 'signup'
                ? 'Create your free account and start visualizing outfits.'
                : 'Enter your email to receive a password reset link.'}
            </p>
          </div>

          {/* Notifications */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-fadeIn font-medium">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-fadeIn font-medium">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1.5 font-outfit">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-blush-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    required={mode === 'signup'}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-pearl-warm border border-blush-border text-xs text-ink-900 placeholder-ink-400 focus:outline-none focus:border-blush-400 font-medium"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-ink-700 mb-1.5 font-outfit">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-blush-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@fashion.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-pearl-warm border border-blush-border text-xs text-ink-900 placeholder-ink-400 focus:outline-none focus:border-blush-400 font-medium"
                />
              </div>
            </div>

            {/* Password (Login & Sign Up only) */}
            {mode !== 'forgot' && (
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1.5 font-outfit">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-blush-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-pearl-warm border border-blush-border text-xs text-ink-900 placeholder-ink-400 focus:outline-none focus:border-blush-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-blush-500"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            {mode !== 'forgot' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-ink-600 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-blush-border bg-pearl-warm text-blush-500 focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>

                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-blush-500 hover:text-blush-600 transition-colors font-bold"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl btn-pink-primary font-bold text-xs font-outfit disabled:opacity-50 flex items-center justify-center space-x-2 mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 rounded-full border-2 border-pearl-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login'
                      ? 'Sign In to Studio'
                      : mode === 'signup'
                      ? 'Create My Account'
                      : 'Send Password Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
