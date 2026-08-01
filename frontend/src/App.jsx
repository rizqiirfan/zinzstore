import { useState } from 'react';
import './styles/style.css';
import { useAuth } from './context/AuthContext';
import { useScrollEffects } from './utils/useScrollEffects';

import LoginOverlay from './components/LoginOverlay';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import TopUpSection from './components/TopUpSection';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import TransactionHistory from './components/TransactionHistory';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const { user, isLoggedIn, loading } = useAuth();
  const [page, setPage] = useState('site'); // 'site' | 'history' | 'admin'
  useScrollEffects();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: '1.2rem',
      }}>
        Memuat...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginOverlay />;
  }

  const showAdmin = page === 'admin' && user?.role === 'admin';
  const showHistory = page === 'history';

  return (
    <div className="main-content" id="mainContent">
      <Navbar page={page} onNavigate={setPage} />

      {showAdmin ? (
        <AdminDashboard />
      ) : showHistory ? (
        <TransactionHistory />
      ) : (
        <>
          <Hero />
          <HowItWorks />
          <TopUpSection />
          <Testimonials />
        </>
      )}

      <Footer />
    </div>
  );
}
