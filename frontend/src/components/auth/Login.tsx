import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Loading } from '../common/Loading';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 shadow-lg shadow-primary-500/30 mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-slate-600">Sign in to continue to TaskFlow</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-slide-down">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="label">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-11"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-11 pr-11"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3"
            >
              {isLoading ? <Loading size="sm" /> : 'Sign in'}
            </button>

            <p className="text-center text-sm text-slate-600">
              Do not have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Create one now
              </Link>
            </p>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              Demo Credentials
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-medium">Email:</span> Hahn@taskmanager.com
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-medium">Password:</span> Hahn123
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-40 right-16 w-24 h-24 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-32 left-20 w-40 h-40 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-16 right-32 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold mb-6">Manage your projects with ease</h1>
            <p className="text-lg text-primary-100">
              TaskFlow helps you organize your work, track progress, and achieve your goals faster than ever.
            </p>
          </div>
          
          {/* Blur decorative elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-16 w-48 h-48 bg-accent-500 opacity-20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};