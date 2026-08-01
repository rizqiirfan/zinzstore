const STEPS = [
  { number: '01', icon: '🎮', title: 'Masukkan ID', desc: 'Masukkan User ID dan Zone ID Free Fire kamu dengan benar' },
  { number: '02', icon: '💎', title: 'Pilih Paket', desc: 'Pilih jumlah diamond yang ingin kamu beli sesuai kebutuhan' },
  { number: '03', icon: '💳', title: 'Bayar', desc: 'Pilih metode pembayaran favoritmu dan selesaikan transaksi' },
  { number: '04', icon: '✅', title: 'Selesai!', desc: 'Diamond langsung masuk ke akun Free Fire kamu secara otomatis' },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works" id="cara-kerja">
      <div className="container">
        <div className="section-header reveal">
          <img src="/ff-icon.png" alt="Free Fire" className="section-icon" />
          <h2 className="section-title">Cara Top Up</h2>
        </div>
        <p className="section-subtitle reveal">Hanya 4 langkah mudah untuk mengisi diamond kamu</p>

        <div className="steps-grid">
          {STEPS.map((s) => (
            <div className="step-card glass-card reveal" key={s.number}>
              <span className="step-number">{s.number}</span>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
