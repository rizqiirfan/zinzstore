import { createContext, useContext, useEffect, useState } from 'react';
import { loginApi, registerApi, getMeApi } from '../api/auth';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);
const TOKEN_KEY = 'zinzstore_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Saat pertama load, cek apakah ada token tersimpan lalu validasi ke backend
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    getMeApi()
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password, remember) {
    try {
      const res = await loginApi(username, password);
      const { user: u, token } = res.data;

      // Token selalu disimpan agar sesi aktif selama browser tab terbuka;
      // "Ingat saya" hanya memengaruhi apakah tersimpan permanen.
      if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(TOKEN_KEY, token); // client.js baca dari localStorage
      }

      setUser(u);
      showToast(`👋 Selamat datang, ${u.displayName}!`);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Username atau password salah!';
      return { success: false, message };
    }
  }

  async function register(payload) {
    try {
      const res = await registerApi(payload);
      const { user: u, token } = res.data;

      // Setelah daftar, langsung login-kan user (sesi tersimpan seperti login biasa)
      localStorage.setItem(TOKEN_KEY, token);

      setUser(u);
      showToast(`🎉 Akun berhasil dibuat! Selamat datang, ${u.displayName}!`);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registrasi gagal, silakan coba lagi.';
      return { success: false, message };
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setUser(null);
    showToast('👋 Kamu sudah logout. Sampai jumpa!');
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
