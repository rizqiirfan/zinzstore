export function formatRupiah(amount) {
  return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const STATUS_LABEL = {
  pending: { text: 'Menunggu Pembayaran', className: 'pending' },
  paid: { text: 'Berhasil', className: 'paid' },
  failed: { text: 'Gagal', className: 'failed' },
  cancelled: { text: 'Dibatalkan', className: 'cancelled' },
  expired: { text: 'Kedaluwarsa', className: 'expired' },
};
