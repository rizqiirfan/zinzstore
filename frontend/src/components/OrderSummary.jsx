import { formatRupiah } from '../utils/format';

export default function OrderSummary({
  pkg,
  payment,
  userId,
  fee,
  discount,
  total,
  promoCode,
  onPromoCodeChange,
  onApplyPromo,
  onCheckout,
  canCheckout,
  isProcessing,
}) {
  return (
    <div className="order-summary glass-card reveal">
      <h3><img src="/ff-icon.png" alt="" className="inline-icon" /> Ringkasan Pesanan</h3>

      <div className="summary-row">
        <span className="label">Produk</span>
        <span className="value" id="summaryProduct">
          {pkg ? `${pkg.diamonds} Diamond${pkg.bonus > 0 ? ` + ${pkg.bonus} Bonus` : ''}` : '—'}
        </span>
      </div>
      <div className="summary-row">
        <span className="label">User ID</span>
        <span className="value" id="summaryUserId">{userId || '—'}</span>
      </div>
      <div className="summary-row">
        <span className="label">Pembayaran</span>
        <span className="value" id="summaryPayment">{payment ? payment.name : '—'}</span>
      </div>
      <div className="summary-row">
        <span className="label">Harga</span>
        <span className="value" id="summaryPrice">{formatRupiah(pkg ? pkg.price : 0)}</span>
      </div>
      <div className="summary-row">
        <span className="label">Biaya Admin</span>
        <span className="value" id="summaryFee">{formatRupiah(fee)}</span>
      </div>
      {discount > 0 && (
        <div className="summary-row">
          <span className="label">Diskon</span>
          <span className="value">-{formatRupiah(discount)}</span>
        </div>
      )}
      <div className="summary-row total">
        <span className="label">Total Bayar</span>
        <span className="value" id="summaryTotal">{formatRupiah(total)}</span>
      </div>

      <div className="promo-input">
        <input
          type="text"
          id="promoCode"
          placeholder="Kode Promo"
          value={promoCode}
          onChange={(e) => onPromoCodeChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onApplyPromo();
            }
          }}
        />
        <button id="btnApplyPromo" onClick={onApplyPromo}>Pakai</button>
      </div>

      <button className="btn-checkout" id="btnCheckout" disabled={!canCheckout || isProcessing} onClick={onCheckout}>
        {isProcessing ? '⏳ Memproses...' : '🔒 Bayar Sekarang'}
      </button>
      <p className="checkout-note">Transaksi aman & terenkripsi SSL 256-bit</p>
    </div>
  );
}
