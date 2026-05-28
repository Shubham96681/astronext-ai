'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { ROUTES } from '../routes/paths';
import { ZODIAC_WHEEL_SRC } from '@/lib/imageSrc';
import { AUTH_HERO_SUBTITLE, AUTH_HERO_TITLE } from '../content/siteCopy';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';

type Step = 'choose' | 'mobile' | 'otp';

function normalizeRedirect(raw: string | null): string | null {
  if (!raw || !raw.startsWith('/')) return null;
  if (raw.startsWith('//') || raw.startsWith('/api')) return null;
  return raw;
}

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const digits = Array.from({ length: 4 }, (_, i) => value[i] ?? '');
  return (
    <div className="auth-otp-boxes">
      {digits.map((d, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="auth-otp-box"
          value={d}
          onChange={(e) => {
            const next = value.split('');
            next[i] = e.target.value.replace(/\D/, '');
            onChange(next.join('').slice(0, 4));
            if (e.target.value && i < 3) {
              (e.target.nextElementSibling as HTMLInputElement | null)?.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !digits[i] && i > 0) {
              (e.currentTarget.previousElementSibling as HTMLInputElement | null)?.focus();
            }
          }}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

export default function AuthPage({ mode: _mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, sendOtp, verifyOtp, loginWithGoogle } = useAuth();
  const redirect = normalizeRedirect(searchParams.get('redirect'));

  // Redirect already-logged-in users away from the login page
  useEffect(() => {
    if (!isLoading && user) {
      router.replace(redirect ?? ROUTES.home);
    }
  }, [user, isLoading, redirect, router]);

  const [step, setStep] = useState<Step>('choose');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const afterLogin = () => router.push(redirect ?? ROUTES.home);

  const startResendTimer = () => {
    setResendCountdown(30);
    const id = setInterval(() => {
      setResendCountdown((c) => {
        if (c <= 1) { clearInterval(id); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = mobile.trim().replace(/\D/g, '').slice(-10);
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setSubmitting(true);
    try {
      await sendOtp(cleaned);
      setStep('otp');
      startResendTimer();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send OTP. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp.length !== 4) { setError('Enter the 4-digit OTP'); return; }
    setSubmitting(true);
    try {
      await verifyOtp(mobile.trim().replace(/\D/g, '').slice(-10), otp);
      afterLogin();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Incorrect OTP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setError(null);
    setOtp('');
    const cleaned = mobile.trim().replace(/\D/g, '').slice(-10);
    try {
      await sendOtp(cleaned);
      startResendTimer();
    } catch {
      setError('Failed to resend OTP');
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
      afterLogin();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Google sign-in failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-hero" aria-labelledby="auth-hero-title" data-reveal="fade-up" data-reveal-immediate>
        <div className="auth-hero__intro" data-reveal="fade-up" data-reveal-immediate>
          <h1 id="auth-hero-title" className="auth-hero__title">{AUTH_HERO_TITLE}</h1>
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

          <div className="auth-card interactive-card" data-reveal="flip-in" data-reveal-immediate data-reveal-delay="140ms">

            {/* ── Step: choose ── */}
            {step === 'choose' && (
              <>
                <h2 className="auth-card__title">Welcome Back</h2>
                {error && <p role="alert" className="auth-error">{error}</p>}

                <button
                  type="button"
                  className="auth-google-btn"
                  onClick={handleGoogle}
                  disabled={submitting}
                >
                  <svg className="auth-google-btn__icon" viewBox="0 0 24 24" aria-hidden>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {submitting ? 'Signing in…' : 'Continue with Google'}
                </button>

                <div className="auth-divider"><span>or</span></div>

                <button
                  type="button"
                  className="auth-card__submit"
                  onClick={() => { setError(null); setStep('mobile'); }}
                >
                  Login with Mobile Number
                </button>
              </>
            )}

            {/* ── Step: mobile ── */}
            {step === 'mobile' && (
              <>
                <button type="button" className="auth-back-btn" onClick={() => { setStep('choose'); setError(null); }}>
                  <ChevronLeft size={16} /> Back
                </button>
                <h2 className="auth-card__title">Enter Mobile</h2>
                {error && <p role="alert" className="auth-error">{error}</p>}

                <form onSubmit={handleSendOtp} noValidate>
                  <div className="auth-field">
                    <label className="auth-field__label" htmlFor="auth-mobile">Mobile Number</label>
                    <div className="auth-mobile-row">
                      <span className="auth-mobile-prefix">+91</span>
                      <input
                        id="auth-mobile"
                        type="tel"
                        className="auth-field__input auth-field__input--plain"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit number"
                        autoComplete="tel-national"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  <button type="submit" className="auth-card__submit" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send OTP on WhatsApp'}
                  </button>
                </form>
              </>
            )}

            {/* ── Step: otp ── */}
            {step === 'otp' && (
              <>
                <button type="button" className="auth-back-btn" onClick={() => { setStep('mobile'); setError(null); setOtp(''); }}>
                  <ChevronLeft size={16} /> Back
                </button>
                <h2 className="auth-card__title">Verify OTP</h2>
                <p className="auth-otp-hint">
                  We sent a 4-digit OTP to WhatsApp<br />
                  <strong>+91 {mobile}</strong>
                </p>
                {error && <p role="alert" className="auth-error">{error}</p>}

                <form onSubmit={handleVerifyOtp} noValidate>
                  <OtpInput value={otp} onChange={setOtp} />
                  <button type="submit" className="auth-card__submit" disabled={submitting || otp.length < 4} style={{ marginTop: '24px' }}>
                    {submitting ? 'Verifying…' : 'Verify & Login'}
                  </button>
                </form>

                <p className="auth-card__switch" style={{ marginTop: '18px' }}>
                  Didn&apos;t receive it?{' '}
                  <button
                    type="button"
                    className="auth-card__switch-link"
                    onClick={handleResend}
                    disabled={resendCountdown > 0}
                    style={{ opacity: resendCountdown > 0 ? 0.5 : 1 }}
                  >
                    {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend OTP'}
                  </button>
                </p>
              </>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
