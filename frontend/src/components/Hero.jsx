export default function Hero() {
  return (
    <section className="hero" id="beranda">
      <div className="hero-bg">
        <img src="/hero-banner.png" alt="Free Fire Banner" />
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="pulse-dot"></span>
          Server Online — Proses Instan
        </div>

        <img src="/icons/logo zs store.png" alt="ZS Store" className="hero-game-icon" />
        <h1>
          Top Up <span className="highlight">Diamond</span><br />
          Free Fire Tercepat
        </h1>

        <p>Isi diamond Free Fire kamu dengan harga termurah. Proses otomatis kurang dari 1 menit, tersedia 24/7.</p>

        <a href="#topup" className="hero-cta">💎 Mulai Top Up Sekarang</a>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-value">2.5M+</div>
            <div className="stat-label">Transaksi Sukses</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">&lt; 30dtk</div>
            <div className="stat-label">Rata-rata Proses</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">4.9 ⭐</div>
            <div className="stat-label">Rating Pengguna</div>
          </div>
        </div>
      </div>
    </section>
  );
}
