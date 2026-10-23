// src/app/components/AuthGate.tsx
'use client';

import React, { useState } from 'react';
import { ACCOUNTS } from '@/lib/auth';
import { UserSession } from '@/lib/types';
import IotMark from '@/components/mark';

interface AuthGateProps {
  onLogin: (session: UserSession) => void;
}

const fieldClass =
  'mt-2 h-12 w-full border border-control bg-surface px-4 text-[17px] text-text focus:border-accent focus:outline-none';

export default function AuthGate({ onLogin }: AuthGateProps) {
  const [username, setUsername] = useState('tech_team');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const account = ACCOUNTS.find(
      (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password
    );

    if (account) {
      onLogin({
        username: account.username,
        role: account.role,
        committeeCategory: account.committee,
      });
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)] max-w-[1280px] gap-10 px-5 pb-16 pt-10 md:grid-cols-[1fr_1fr] md:items-center md:gap-16 md:px-10">
      {/* Visual: the club mark on the club grid */}
      <div
        aria-hidden="true"
        className="flex aspect-[16/9] items-center justify-center text-accent md:aspect-square"
        style={{
          backgroundImage:
            'linear-gradient(var(--divider) 1px, transparent 1px), linear-gradient(90deg, var(--divider) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      >
        <IotMark className="h-[62%] w-[62%] max-h-72" />
      </div>

      <div>
        <h1 className="text-[clamp(48px,6.8vw,102px)] leading-[0.9] text-text">Committee sign in</h1>
        <p className="mt-6 max-w-md text-[18px] leading-[1.5] text-muted">
          Sign in with your committee account to see tasks and points.
        </p>

        <form onSubmit={handleLogin} className="mt-10 max-w-md space-y-6">
          <div>
            <label htmlFor="account" className="text-[16px] font-medium text-text">
              Account
            </label>
            <select
              id="account"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              className={fieldClass}
            >
              {ACCOUNTS.map((acc) => (
                <option key={acc.username} value={acc.username}>
                  {acc.label} ({acc.username})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="password" className="text-[16px] font-medium text-text">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              aria-describedby={error ? 'login-error' : undefined}
              aria-invalid={error ? true : undefined}
              className={fieldClass}
            />
          </div>

          {error && (
            <p id="login-error" role="alert" className="text-[16px] font-medium text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="h-12 bg-accent px-8 text-[17px] font-semibold text-on-accent transition-opacity duration-150 hover:opacity-90"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
