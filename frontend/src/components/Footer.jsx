export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="navbar-brand">
              <div className="logo-icon">
                <img src="/ff-icon.png" alt="Free Fire" className="brand-icon" />
              </div>
              <span className="brand-text">Zinz<span>Store</span></span>
            </a>
            <p>ZinzStore — Platform top up game terpercaya #1 di Indonesia. Cepat, aman, dan harga terjangkau untuk semua gamer.</p>
          </div>

          <div className="footer-col">
            <h4>Produk</h4>
            <a href="#">Free Fire Diamond</a>
            <a href="#">Free Fire Membership</a>
            <a href="#">PUBG Mobile UC</a>
            <a href="#">Mobile Legends Diamond</a>
          </div>

          <div className="footer-col">
            <h4>Bantuan</h4>
            <a href="#">Cara Top Up</a>
            <a href="#">FAQ</a>
            <a href="#">Hubungi Kami</a>
            <a href="#">Syarat & Ketentuan</a>
          </div>

          <div className="footer-col">
            <h4>Ikuti Kami</h4>
            <a href="#">📘 Facebook</a>
            <a href="#">📸 Instagram</a>
            <a href="#">🐦 Twitter</a>
            <a href="#">📺 YouTube</a>
          </div>
        </div>

        <div className="footer-bottom">
          &copy; 2026 ZinzStore. All rights reserved. Tidak berafiliasi dengan Garena.
        </div>
      </div>
    </footer>
  );
}
