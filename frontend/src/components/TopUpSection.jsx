import { useEffect, useState } from 'react';
import PackageGrid from './PackageGrid';
import PaymentGrid from './PaymentGrid';
import OrderSummary from './OrderSummary';
import { ConfirmModal, SuccessModal, ProcessingModal } from './Modals';
import { getPackagesApi } from '../api/packages';
import { getPaymentMethodsApi } from '../api/payments';
import { checkPlayerApi } from '../api/player';
import { applyPromoApi } from '../api/promo';
import { createTransactionApi, syncTransactionApi } from '../api/transactions';
import { formatRupiah } from '../utils/format';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function TopUpSection() {
  const { showToast } = useToast();
  const { isLoggedIn } = useAuth();

  const [packages, setPackages] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [checkingId, setCheckingId] = useState(false);

  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [processingOpen, setProcessingOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [pendingTrx, setPendingTrx] = useState(null);

  // Ambil data paket & metode pembayaran dari backend saat komponen dimuat
  useEffect(() => {
    getPackagesApi().then(setPackages).catch(() => showToast('Gagal memuat paket diamond', 'error'));
    getPaymentMethodsApi().then(setPaymentMethods).catch(() => showToast('Gagal memuat metode pembayaran', 'error'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedPackage = packages.find((p) => p.id === selectedPackageId) || null;
  const selectedPayment = paymentMethods.find((p) => p.id === selectedPaymentId) || null;

  const fee = selectedPayment ? selectedPayment.fee : 0;
  const total = selectedPackage
    ? Math.max(selectedPackage.price + fee - discount, 0)
    : 0;

  function handleSelectPackage(id) {
    setSelectedPackageId(id);
    setDiscount(0); // reset promo saat ganti paket, sama seperti versi lama
  }

  async function handleCheckId() {
    if (!userId.trim() || !zoneId.trim()) {
      showToast('⚠️ Masukkan User ID dan Zone ID', 'error');
      return;
    }
    setCheckingId(true);
    try {
      const data = await checkPlayerApi(userId.trim(), zoneId.trim());
      setPlayerName(data.playerName);
      showToast('✅ Akun ditemukan!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal mengecek akun', 'error');
    } finally {
      setCheckingId(false);
    }
  }

  async function handleApplyPromo() {
    if (!promoCode.trim()) return;
    try {
      const res = await applyPromoApi(promoCode.trim(), selectedPackage ? selectedPackage.price : 0);
      setDiscount(res.data.discount);
      showToast(res.message);
    } catch (err) {
      setDiscount(0);
      showToast(err.response?.data?.message || 'Kode promo tidak valid', 'error');
    }
  }

  function handleCheckoutClick() {
    if (!isLoggedIn) {
      showToast('⚠️ Silakan login terlebih dahulu', 'error');
      return;
    }
    if (!selectedPackage || !selectedPayment || !userId.trim()) {
      showToast('⚠️ Lengkapi semua data terlebih dahulu', 'error');
      return;
    }
    setConfirmOpen(true);
  }

  async function handleConfirmPayment() {
    setProcessing(true);
    try {
      const trx = await createTransactionApi({
        packageId: selectedPackage.id,
        paymentMethodId: selectedPayment.id,
        gameUserId: userId.trim(),
        gameZoneId: zoneId.trim(),
        gamePlayerName: playerName || null,
        promoCode: promoCode.trim() || undefined,
      });
      setPendingTrx(trx);
      setConfirmOpen(false);
      setProcessingOpen(true);
      await pollUntilVerified(trx.id);
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal membuat transaksi, silakan coba lagi', 'error');
      setProcessing(false);
    }
  }

  // Polling sederhana ke backend untuk "verifikasi status" transaksi.
  // Statusnya beneran dicek ulang di server tiap kali dipanggil (bukan
  // cuma disulap di frontend) — lihat syncTransactionApi & backend-nya.
  async function pollUntilVerified(trxId, attempt = 0) {
    const MAX_ATTEMPTS = 8;
    try {
      const res = await syncTransactionApi(trxId);
      if (res.data.status === 'paid') {
        setProcessingOpen(false);
        setSuccessOpen(true);
        resetForm();
        setProcessing(false);
        return;
      }
      if (attempt >= MAX_ATTEMPTS) {
        setProcessingOpen(false);
        showToast('Verifikasi masih berjalan, cek statusnya nanti di halaman Riwayat.', 'error');
        setProcessing(false);
        return;
      }
      setTimeout(() => pollUntilVerified(trxId, attempt + 1), 1500);
    } catch {
      setProcessingOpen(false);
      showToast('Gagal memverifikasi status, cek statusnya di halaman Riwayat.', 'error');
      setProcessing(false);
    }
  }

  function resetForm() {
    setSelectedPackageId(null);
    setSelectedPaymentId(null);
    setDiscount(0);
    setPromoCode('');
  }

  const confirmMessage = selectedPackage && selectedPayment
    ? `Kamu akan membeli <strong>${selectedPackage.diamonds} Diamond</strong>
       ${selectedPackage.bonus > 0 ? `+ ${selectedPackage.bonus} Bonus` : ''}
       untuk User ID <strong>${userId}</strong>
       dengan total <strong>${formatRupiah(total)}</strong>
       via <strong>${selectedPayment.name}</strong>.`
    : '';

  return (
    <section className="topup-section" id="topup">
      <div className="container">
        <div className="section-header reveal">
          <img src="/ff-icon.png" alt="Free Fire" className="section-icon" />
          <h2 className="section-title">Pilih Paket Diamond</h2>
        </div>
        <p className="section-subtitle reveal">Pilih nominal diamond yang kamu butuhkan</p>

        <div className="topup-wrapper">
          <div className="topup-form">
            {/* Data Akun */}
            <div className="player-id-card glass-card reveal">
              <h3><img src="/ff-icon.png" alt="" className="inline-icon" /> Data Akun</h3>
              <div className="input-group">
                <div className="input-field">
                  <label htmlFor="userId">User ID</label>
                  <input
                    type="text"
                    id="userId"
                    placeholder="Contoh: 123456789"
                    inputMode="numeric"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <label htmlFor="zoneId">Zone ID</label>
                  <input
                    type="text"
                    id="zoneId"
                    placeholder="Contoh: 2301"
                    inputMode="numeric"
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                  />
                </div>
              </div>
              <button className="btn-check-id" id="btnCheckId" onClick={handleCheckId} disabled={checkingId}>
                {checkingId ? '⏳ Mengecek...' : '🔍 Cek Akun'}
              </button>
              <div className={`player-info${playerName ? ' show' : ''}`} id="playerInfo">
                <span className="check-icon">✅</span>
                <span id="playerName">{playerName || '—'}</span>
              </div>
            </div>

            {/* Pilih Diamond */}
            <div className="diamond-packages reveal">
              <h3>💎 Pilih Diamond</h3>
              <PackageGrid packages={packages} selectedId={selectedPackageId} onSelect={handleSelectPackage} />
            </div>

            {/* Metode Pembayaran */}
            <div className="payment-section reveal">
              <h3>💳 Metode Pembayaran</h3>
              <div className="payment-category">
                <div className="payment-category-title">E-Wallet</div>
                <PaymentGrid methods={paymentMethods} category="ewallet" selectedId={selectedPaymentId} onSelect={setSelectedPaymentId} />
              </div>
              <div className="payment-category">
                <div className="payment-category-title">QRIS</div>
                <PaymentGrid methods={paymentMethods} category="qris" selectedId={selectedPaymentId} onSelect={setSelectedPaymentId} />
              </div>
            </div>
          </div>

          <OrderSummary
            pkg={selectedPackage}
            payment={selectedPayment}
            userId={userId}
            fee={fee}
            discount={discount}
            total={total}
            promoCode={promoCode}
            onPromoCodeChange={setPromoCode}
            onApplyPromo={handleApplyPromo}
            onCheckout={handleCheckoutClick}
            canCheckout={!!(selectedPackage && selectedPayment && userId.trim())}
            isProcessing={processing}
          />
        </div>
      </div>

      <ConfirmModal
        show={confirmOpen}
        message={confirmMessage}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmPayment}
        isProcessing={processing}
      />
      <ProcessingModal show={processingOpen} />
      <SuccessModal
        show={successOpen}
        message="Diamond akan segera masuk ke akun kamu. Terima kasih telah menggunakan ZinzStore!"
        onClose={() => setSuccessOpen(false)}
      />
    </section>
  );
}
