const TESTIMONIALS = [
  {
    text: '"Gila cepet banget, baru bayar langsung masuk diamond-nya. Harga juga paling murah dibanding yang lain!"',
    initials: 'RA', name: 'Rizky Andi', rank: 'Heroic Player',
  },
  {
    text: '"Udah langganan di sini dari dulu. Nggak pernah ada masalah, CS-nya juga fast respon. Recommended banget!"',
    initials: 'SP', name: 'Sari Putri', rank: 'Grandmaster',
  },
  {
    text: '"Pertama kali coba langsung ketagihan. Proses cepat, harga bersaing, dan bisa bayar pakai DANA. Top!"',
    initials: 'MF', name: 'Muhammad Fajar', rank: 'Diamond Rank',
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials" id="ulasan">
      <div className="container">
        <div className="section-header reveal">
          <img src="/ff-icon.png" alt="Free Fire" className="section-icon" />
          <h2 className="section-title">Apa Kata Mereka?</h2>
        </div>
        <p className="section-subtitle reveal">Ribuan gamer sudah mempercayai ZinzStore</p>

        <div className="testimonial-grid">
          {TESTIMONIALS.map((t) => (
            <div className="testimonial-card glass-card reveal" key={t.initials}>
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-rank">{t.rank}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
