import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { ROUTES } from '../routes/paths';
import authZodiacWheel from '../assets/auth-zodiac-wheel.png';
import { AUTH_HERO_SUBTITLE, AUTH_HERO_TITLE } from '../content/siteCopy';
import { useScrollReveal } from '../hooks/useScrollReveal';

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
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });

  const isLogin = mode === 'login';

  useScrollReveal([mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
              src={authZodiacWheel}
              alt=""
              className="auth-zodiac-wheel-img"
              width={460}
              height={460}
              loading="eager"
              decoding="async"
            />
          </div>

          <div className={`auth-card ${!isLogin ? 'auth-card--signup' : ''}`} data-reveal="fade-left" data-reveal-immediate data-reveal-delay="140ms">
            <h2 className="auth-card__title">{isLogin ? 'Login' : 'Sign Up'}</h2>

            <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
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

                  <button type="submit" className="auth-card__submit">
                    Login
                  </button>

                  <p className="auth-card__switch">
                    Don&apos;t have an account?{' '}
                    <button type="button" className="auth-card__switch-link" onClick={() => navigate(ROUTES.signup)}>
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

                  <button type="submit" className="auth-card__submit">
                    Sign Up
                  </button>

                  <p className="auth-card__switch">
                    Already have an account?{' '}
                    <button type="button" className="auth-card__switch-link" onClick={() => navigate(ROUTES.login)}>
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
