'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { ROUTES } from '../routes/paths';
import { ZODIAC_WHEEL_SRC } from '@/lib/imageSrc';
import { AUTH_HERO_SUBTITLE, AUTH_HERO_TITLE } from '../content/siteCopy';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';

type AuthMode = 'login' | 'signup';

type Props = {
  mode: AuthMode;
};

function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-field">
      <label className="auth-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="auth-field__control">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className="auth-field__input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={id.includes('confirm') ? 'new-password' : 'current-password'}
        />
        <button
          type="button"
          className="auth-field__toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
        </button>
      </div>
    </div>
  );
}

export default function AuthPage({ mode }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, refreshSession } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === 'login';

  useEffect(() => {
    if (searchParams.get('refresh') === '1') {
      refreshSession().then((token) => {
        const redirect = searchParams.get('redirect');
        if (token && redirect?.startsWith('/dashboard')) {
          router.replace(redirect);
        }
      });
    }
  }, [searchParams, refreshSession, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const redirect = searchParams.get('redirect');
      if (isLogin) {
        const res = await login(loginForm.email.trim(), loginForm.password);
        router.push(redirect?.startsWith('/dashboard') ? redirect : res.redirect_to);
      } else {
        if (signupForm.password !== signupForm.confirm) {
          setError('Passwords do not match');
          return;
        }
        const res = await register(signupForm.name.trim(), signupForm.email.trim(), signupForm.password);
        router.push(redirect?.startsWith('/dashboard') ? redirect : res.redirect_to);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-hero" aria-labelledby="auth-hero-title" data-reveal="fade-up" data-reveal-immediate>
        <div className="auth-hero__intro" data-reveal="fade-up" data-reveal-immediate>
          <h1 id="auth-hero-title" className="auth-hero__title">
            {AUTH_HERO_TITLE}
          </h1>
          <p className="auth-hero__subtitle">{AUTH_HERO_SUBTITLE}</p>
        </div>

        <div className="auth-hero__grid">
          <div className="auth-hero__visual" aria-hidden="true" data-reveal="fade-right" data-reveal-immediate data-reveal-delay="80ms">
            <img
              src={ZODIAC_WHEEL_SRC}
              alt=""
              className="auth-zodiac-wheel-img zodiac-wheel-asset"
              width={1000}
              height={1000}
              loading="eager"
              decoding="async"
            />
          </div>

          <div className={`auth-card interactive-card ${!isLogin ? 'auth-card--signup' : ''}`} data-reveal="flip-in" data-reveal-immediate data-reveal-delay="140ms">
            <h2 className="auth-card__title">{isLogin ? 'Login' : 'Sign Up'}</h2>

            <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
              {error ? (
                <p role="alert" style={{ color: '#c62828', fontSize: '0.875rem', marginBottom: '12px' }}>
                  {error}
                </p>
              ) : null}
              {isLogin ? (
                <>
                  <div className="auth-field">
                    <label className="auth-field__label" htmlFor="auth-email">
                      Email/Mobile Number
                    </label>
                    <input
                      id="auth-email"
                      type="text"
                      className="auth-field__input auth-field__input--plain"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="Enter your email or mobile number"
                      autoComplete="username"
                    />
                  </div>

                  <PasswordField
                    id="auth-password"
                    label="Password"
                    value={loginForm.password}
                    onChange={(password) => setLoginForm((f) => ({ ...f, password }))}
                    placeholder="Enter your password"
                  />

                  <a href="#forgot" className="auth-card__forgot">
                    Forgot Password ?
                  </a>

                  <button type="submit" className="auth-card__submit" disabled={submitting}>
                    {submitting ? 'Signing in…' : 'Login'}
                  </button>

                  <p className="auth-card__switch" style={{ marginTop: '14px', fontSize: '12px', color: '#666' }}>
                    Demo: admin@astronext.ai / admin123 · astrologer@astronext.ai / astro123
                  </p>

                  <p className="auth-card__switch">
                    Don&apos;t have an account?{' '}
                    <button type="button" className="auth-card__switch-link" onClick={() => router.push(ROUTES.signup)}>
                      Sign Up
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <div className="auth-field">
                    <label className="auth-field__label" htmlFor="auth-name">
                      Full Name
                    </label>
                    <input
                      id="auth-name"
                      type="text"
                      className="auth-field__input auth-field__input--plain"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                  </div>

                  <div className="auth-field">
                    <label className="auth-field__label" htmlFor="auth-signup-email">
                      Email/Mobile Number
                    </label>
                    <input
                      id="auth-signup-email"
                      type="text"
                      className="auth-field__input auth-field__input--plain"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="Enter your email or mobile number"
                      autoComplete="username"
                    />
                  </div>

                  <PasswordField
                    id="auth-signup-password"
                    label="Password"
                    value={signupForm.password}
                    onChange={(password) => setSignupForm((f) => ({ ...f, password }))}
                    placeholder="Create a password"
                  />

                  <PasswordField
                    id="auth-signup-confirm"
                    label="Confirm Password"
                    value={signupForm.confirm}
                    onChange={(confirm) => setSignupForm((f) => ({ ...f, confirm }))}
                    placeholder="Re-enter your password"
                  />

                  <button type="submit" className="auth-card__submit" disabled={submitting}>
                    {submitting ? 'Creating account…' : 'Sign Up'}
                  </button>

                  <p className="auth-card__switch">
                    Already have an account?{' '}
                    <button type="button" className="auth-card__switch-link" onClick={() => router.push(ROUTES.login)}>
                      Login
                    </button>
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
