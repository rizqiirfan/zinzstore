import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

export default function Navbar({ page, onNavigate }) {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function goToSection(e, id) {
    e.preventDefault();
    setMenuOpen(false);
    if (page !== 'site') {
      onNavigate('site');
      // Tunggu section-nya ke-mount dulu sebelum discroll
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function goToPage(pageId) {
    setMenuOpen(false);
    onNavigate(pageId);
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="container">
        <a href="#" className="navbar-brand" onClick={(e) => goToSection(e, 'beranda')}>
          <div className="logo-icon">
            <img src="/ff-icon.png" alt="Free Fire" className="brand-icon" />
          </div>
          <span className="brand-text">Zinz<span>Store</span></span>
        </a>

        <ul className={`navbar-nav${menuOpen ? ' active' : ''}`} id="navMenu">
          <li><a href="#beranda" onClick={(e) => goToSection(e, 'beranda')}>Beranda</a></li>
          <li><a href="#cara-kerja" onClick={(e) => goToSection(e, 'cara-kerja')}>Cara Kerja</a></li>
          <li><a href="#topup" onClick={(e) => goToSection(e, 'topup')}>Top Up</a></li>
          <li><a href="#ulasan" onClick={(e) => goToSection(e, 'ulasan')}>Ulasan</a></li>
          {user && (
            <li>
              <a
                href="#"
                className={page === 'history' ? 'nav-active' : ''}
                onClick={(e) => { e.preventDefault(); goToPage('history'); }}
              >
                Riwayat
              </a>
            </li>
          )}
          {user?.role === 'admin' && (
            <li>
              <a
                href="#"
                className={page === 'admin' ? 'nav-active' : ''}
                onClick={(e) => { e.preventDefault(); goToPage('admin'); }}
              >
                Dashboard Admin
              </a>
            </li>
          )}
        </ul>

        {user && (
          <div className="navbar-user" id="navbarUser" style={{ display: 'flex' }}>
            <div className="navbar-avatar" id="navAvatar">{getInitials(user.displayName)}</div>
            <span className="navbar-username" id="navUsername">{user.displayName}</span>
            <button className="btn-logout" id="btnLogout" onClick={logout}>Logout</button>
          </div>
        )}

        <button
          className="menu-toggle"
          id="menuToggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
