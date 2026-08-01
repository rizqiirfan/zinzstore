import { useEffect, useState } from 'react';
import {
  getAdminStatsApi,
  getAdminTransactionsApi,
  updateTransactionStatusApi,
  getAdminUsersApi,
} from '../api/admin';
import { formatRupiah, formatDate, STATUS_LABEL } from '../utils/format';
import { useToast } from '../context/ToastContext';

const STATUS_OPTIONS = ['pending', 'paid', 'failed', 'cancelled', 'expired'];
const TABS = [
  { id: 'overview', label: '📊 Ringkasan' },
  { id: 'transactions', label: '💳 Transaksi' },
  { id: 'users', label: '👥 Pengguna' },
];

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [tab, setTab] = useState('overview');

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [loadingTrx, setLoadingTrx] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    loadStats();
    loadUsers();
  }, []);

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  function loadStats() {
    setLoadingStats(true);
    getAdminStatsApi()
      .then(setStats)
      .catch(() => showToast('Gagal memuat statistik', 'error'))
      .finally(() => setLoadingStats(false));
  }

  function loadTransactions() {
    setLoadingTrx(true);
    getAdminTransactionsApi(statusFilter ? { status: statusFilter } : {})
      .then((res) => setTransactions(res.data))
      .catch(() => showToast('Gagal memuat transaksi', 'error'))
      .finally(() => setLoadingTrx(false));
  }

  function loadUsers() {
    setLoadingUsers(true);
    getAdminUsersApi()
      .then(setUsers)
      .catch(() => showToast('Gagal memuat data pengguna', 'error'))
      .finally(() => setLoadingUsers(false));
  }

  async function handleStatusChange(id, newStatus) {
    setUpdatingId(id);
    try {
      await updateTransactionStatusApi(id, newStatus);
      showToast('Status transaksi diperbarui');
      loadTransactions();
      loadStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal memperbarui status', 'error');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="admin-section">
      <div className="container">
        <div className="section-header">
          <img src="/ff-icon.png" alt="Free Fire" className="section-icon" />
          <h2 className="section-title">Dashboard Admin</h2>
        </div>
        <p className="section-subtitle">Kelola transaksi dan pengguna ZinzStore</p>

        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`admin-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="admin-overview">
            {loadingStats || !stats ? (
              <p className="history-empty">Memuat statistik...</p>
            ) : (
              <>
                <div className="admin-stats-grid">
                  <div className="admin-stat-card glass-card">
                    <div className="admin-stat-label">Total Pengguna</div>
                    <div className="admin-stat-value">{stats.totalUsers}</div>
                  </div>
                  <div className="admin-stat-card glass-card">
                    <div className="admin-stat-label">Total Transaksi</div>
                    <div className="admin-stat-value">{stats.totalTransactions}</div>
                  </div>
                  <div className="admin-stat-card glass-card highlight">
                    <div className="admin-stat-label">Total Pendapatan</div>
                    <div className="admin-stat-value">{formatRupiah(stats.totalRevenue)}</div>
                  </div>
                  <div className="admin-stat-card glass-card">
                    <div className="admin-stat-label">Pendapatan Hari Ini</div>
                    <div className="admin-stat-value">{formatRupiah(stats.todayRevenue)}</div>
                  </div>
                </div>

                <div className="admin-breakdown glass-card">
                  <h3>Status Transaksi</h3>
                  <div className="admin-breakdown-grid">
                    {Object.entries(stats.statusBreakdown).map(([key, count]) => (
                      <div className="admin-breakdown-item" key={key}>
                        <span className={`history-status ${STATUS_LABEL[key]?.className || ''}`}>
                          {STATUS_LABEL[key]?.text || key}
                        </span>
                        <span className="admin-breakdown-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'transactions' && (
          <div className="admin-transactions">
            <div className="admin-filter-row">
              <label htmlFor="statusFilter">Filter Status</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Semua Status</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s]?.text || s}</option>
                ))}
              </select>
            </div>

            {loadingTrx ? (
              <p className="history-empty">Memuat transaksi...</p>
            ) : transactions.length === 0 ? (
              <p className="history-empty">Tidak ada transaksi.</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>User</th>
                      <th>Produk</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((trx) => {
                      const status = STATUS_LABEL[trx.status] || STATUS_LABEL.pending;
                      return (
                        <tr key={trx.id}>
                          <td>{trx.invoice_no}</td>
                          <td>{trx.display_name} <span className="muted">@{trx.username}</span></td>
                          <td>{trx.diamonds} Diamond{trx.bonus > 0 ? ` +${trx.bonus}` : ''}</td>
                          <td>{formatRupiah(trx.total)}</td>
                          <td><span className={`history-status ${status.className}`}>{status.text}</span></td>
                          <td>{formatDate(trx.created_at)}</td>
                          <td>
                            <select
                              value={trx.status}
                              disabled={updatingId === trx.id}
                              onChange={(e) => handleStatusChange(trx.id, e.target.value)}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{STATUS_LABEL[s]?.text || s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'users' && (
          <div className="admin-users">
            {loadingUsers ? (
              <p className="history-empty">Memuat pengguna...</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Nama Tampilan</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Bergabung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.username}</td>
                        <td>{u.display_name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge${u.role === 'admin' ? ' admin' : ''}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>{formatDate(u.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
