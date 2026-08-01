import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginOverlay() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  return (
    <div className="login-overlay" id="loginOverlay">
      <div className="login-bg">
        <img src="/login-bg.png" alt="Login Background" />
      </div>

      <div className="login-particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="particle" key={i}></div>
        ))}
      </div>

      <div className="login-card">
        <div className="login-logo">
          <img src="/ff-icon.png" alt="ZinzStore" />
          <h2>
            <span className="brand-zinz">Zinz</span>
            <span className="brand-store">Store</span>
          </h2>
          <p>
            {mode === 'login'
              ? 'Masuk ke akun kamu untuk mulai top up'
              : 'Buat akun baru untuk mulai top up'}
          </p>
        </div>

        {mode === 'login' ? (
          <LoginForm login={login} onSwitchToRegister={() => setMode('register')} />
        ) : (
          <RegisterForm register={register} onSwitchToLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}

function LoginForm({ login, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Username dan password harus diisi!');
      return;
    }

    setSubmitting(true);
    const result = await login(username.trim(), password, remember);
    setSubmitting(false);

    if (!result.success) {
      setError(result.message);
      setTimeout(() => setError(''), 3000);
    }
  }

  return (
    <form className="login-form" id="loginForm" onSubmit={handleSubmit}>
      <div className={`login-error${error ? ' show' : ''}`} id="loginError">
        {error || 'Username atau password salah!'}
      </div>

      <div className="login-field">
        <label htmlFor="loginUsername">Username / Email</label>
        <input
          type="text"
          id="loginUsername"
          placeholder="Masukkan username atau email"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="login-field">
        <label htmlFor="loginPassword">Password</label>
        <input
          type="password"
          id="loginPassword"
          placeholder="Masukkan password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="login-options">
        <label className="remember-me">
          <input
            type="checkbox"
            id="rememberMe"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />{' '}
          Ingat saya
        </label>
        <a href="#" className="forgot-link">Lupa password?</a>
      </div>

      <button type="submit" className="btn-login" id="btnLogin" disabled={submitting}>
        {submitting ? '⏳ Memproses...' : '🔐 Masuk'}
      </button>

      <div className="login-divider">atau masuk dengan</div>

      <div className="social-login">
        <button type="button" className="btn-social" id="btnGoogle" disabled>
          <span className="social-icon">🔵</span> Google
        </button>
        <button type="button" className="btn-social" id="btnFacebook" disabled>
          <span className="social-icon">📘</span> Facebook
        </button>
      </div>

      <div className="login-footer">
        Belum punya akun?{' '}
        <a
          href="#"
          id="linkRegister"
          onClick={(e) => {
            e.preventDefault();
            onSwitchToRegister();
          }}
        >
          Daftar sekarang
        </a>
      </div>

      <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', opacity: 0.7, textAlign: 'center' }}>
        Demo: demo / demo &nbsp;•&nbsp; admin / admin
      </p>
    </form>
  );
}

function RegisterForm({ register, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      return 'Semua kolom wajib diisi (kecuali nama tampilan)!';
    }
    if (username.trim().length < 3) {
      return 'Username minimal 3 karakter.';
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(username.trim())) {
      return 'Username hanya boleh huruf, angka, titik, dan underscore.';
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return 'Format email tidak valid.';
    }
    if (password.length < 4) {
      return 'Password minimal 4 karakter.';
    }
    if (password !== confirmPassword) {
      return 'Konfirmasi password tidak cocok!';
    }
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const validationMessage = validate();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSubmitting(true);
    const result = await register({
      username: username.trim(),
      email: email.trim(),
      password,
      displayName: displayName.trim() || undefined,
    });
    setSubmitting(false);

    if (!result.success) {
      setError(result.message);
      setTimeout(() => setError(''), 3000);
    }
  }

  return (
    <form className="login-form" id="registerForm" onSubmit={handleSubmit}>
      <div className={`login-error${error ? ' show' : ''}`} id="registerError">
        {error || 'Registrasi gagal, periksa kembali data kamu.'}
      </div>

      <div className="login-field">
        <label htmlFor="registerUsername">Username</label>
        <input
          type="text"
          id="registerUsername"
          placeholder="Contoh: zinzgamer"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="login-field">
        <label htmlFor="registerEmail">Email</label>
        <input
          type="email"
          id="registerEmail"
          placeholder="Contoh: kamu@email.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="login-field">
        <label htmlFor="registerDisplayName">Nama Tampilan (opsional)</label>
        <input
          type="text"
          id="registerDisplayName"
          placeholder="Contoh: Zinz Gamer"
          autoComplete="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      <div className="login-field">
        <label htmlFor="registerPassword">Password</label>
        <input
          type="password"
          id="registerPassword"
          placeholder="Minimal 4 karakter"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="login-field">
        <label htmlFor="registerConfirmPassword">Konfirmasi Password</label>
        <input
          type="password"
          id="registerConfirmPassword"
          placeholder="Ulangi password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn-login" id="btnRegister" disabled={submitting}>
        {submitting ? '⏳ Memproses...' : '📝 Daftar'}
      </button>

      <div className="login-footer">
        Sudah punya akun?{' '}
        <a
          href="#"
          id="linkLogin"
          onClick={(e) => {
            e.preventDefault();
            onSwitchToLogin();
          }}
        >
          Masuk di sini
        </a>
      </div>
    </form>
  );
}
