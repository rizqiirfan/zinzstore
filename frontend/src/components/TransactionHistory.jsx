import { useEffect, useState } from 'react';
import { getMyTransactionsApi, syncTransactionApi } from '../api/transactions';
import { formatRupiah, formatDate, STATUS_LABEL } from '../utils/format';
import { useToast } from '../context/ToastContext';

export default function TransactionHistory() {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  function loadTransactions() {
    setLoading(true);
    getMyTransactionsApi()
      .then(setTransactions)
      .catch(() => showToast('Gagal memuat riwayat transaksi', 'error'))
      .finally(() => setLoading(false));
  }

  async function handleSync(id) {
    setSyncingId(id);
    try {
      await syncTransactionApi(id);
      showToast('Status transaksi diperbarui');
      loadTransactions();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal memperbarui status', 'error');
    } finally {
      setSyncingId(null);
    }
  }

  return (
    <section className="history-section">
      <div className="container">
        <div className="section-header">
          <img src="/ff-icon.png" alt="Free Fire" className="section-icon" />
          <h2 className="section-title">Riwayat Transaksi</h2>
        </div>
        <p className="section-subtitle">Semua transaksi top up kamu ada di sini</p>

        {loading ? (
          <p className="history-empty">Memuat riwayat transaksi...</p>
        ) : transactions.length === 0 ? (
          <p className="history-empty">Kamu belum punya transaksi. Yuk mulai top up! 💎</p>
        ) : (
          <div className="history-list">
            {transactions.map((trx) => {
              const status = STATUS_LABEL[trx.status] || STATUS_LABEL.pending;
              return (
                <div className="history-card glass-card" key={trx.id}>
                  <div className="history-card-top">
                    <div>
                      <div className="history-invoice">{trx.invoice_no}</div>
                      <div className="history-date">{formatDate(trx.created_at)}</div>
                    </div>
                    <span className={`history-status ${status.className}`}>{status.text}</span>
                  </div>

                  <div className="history-card-body">
                    <div className="history-row">
                      <span className="label">Produk</span>
                      <span className="value">
                        {trx.diamonds} Diamond{trx.bonus > 0 ? ` + ${trx.bonus} Bonus` : ''}
                      </span>
                    </div>
                    <div className="history-row">
                      <span className="label">User ID / Zone ID</span>
                      <span className="value">{trx.game_user_id} / {trx.game_zone_id}</span>
                    </div>
                    <div className="history-row">
                      <span className="label">Metode Pembayaran</span>
                      <span className="value">{trx.payment_name}</span>
                    </div>
                    <div className="history-row total">
                      <span className="label">Total</span>
                      <span className="value">{formatRupiah(trx.total)}</span>
                    </div>
                  </div>

                  {trx.status === 'pending' && (
                    <div className="history-card-actions">
                      <button
                        className="btn-history-action secondary"
                        onClick={() => handleSync(trx.id)}
                        disabled={syncingId === trx.id}
                      >
                        {syncingId === trx.id ? '⏳ Mengecek...' : '🔄 Cek Status'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
