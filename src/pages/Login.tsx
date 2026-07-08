import React, { useState } from 'react';
import { ShieldCheck, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { setCurrentUser } from '../utils/api';
import { User } from '../types';
import { AppLanguage, getLanguageText } from '../utils/i18n';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  language?: AppLanguage;
}

export default function Login({ onLoginSuccess, language = 'en' }: LoginProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          // Store the authenticated user in local storage
          setCurrentUser(data.user);
          onLoginSuccess(data.user);
        } else {
          setError(data.error || getLanguageText(language, 'authError'));
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Authentication error:', err);
        setError(getLanguageText(language, 'authServerError'));
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl font-display shadow-md mb-4">
            P
          </div>
          <h2 className="font-display font-bold text-slate-800 text-2xl tracking-tight">
            {getLanguageText(language, 'loginTitle')}
          </h2>
          <p className="text-sm text-slate-500 mt-1.5">
            {getLanguageText(language, 'loginSubtitle')}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="text-indigo-600" size={20} />
            <h3 className="font-semibold text-slate-800 text-sm">{getLanguageText(language, 'adminAuth')}</h3>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2 text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {getLanguageText(language, 'username')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon size={16} />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={getLanguageText(language, 'placeholderUsername')}
                  className="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {getLanguageText(language, 'password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm shadow-indigo-100 disabled:opacity-70 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                getLanguageText(language, 'signIn')
              )}
            </button>
          </form>

          {/* Seed credentials assistance banner
          <div className="mt-6 pt-5 border-t border-slate-100 bg-indigo-50/30 rounded-xl px-4 py-3 text-center">
            <span className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wider block mb-1">
              Test Credentials (from .env)
            </span>
            <p className="text-xs text-indigo-600 font-sans">
              Admin: <span className="font-mono font-bold">admin</span> / <span className="font-mono font-bold">admin_password_2026</span>
            </p>
            <p className="text-[11px] text-indigo-500 mt-1">
              Staff: <span className="font-mono font-bold">factory</span> / <span className="font-mono font-bold">factory2026</span>
            </p>
          </div> */}
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-slate-400 mt-6 font-mono uppercase tracking-widest">
          Plate Manufacturing ERP Suite v1.0.0
        </p>
      </div>
    </div>
  );
}
