export function ConfirmModal({ show, message, onCancel, onConfirm, isProcessing }) {
  return (
    <div className={`modal-overlay${show ? ' active' : ''}`} id="confirmModal" onClick={(e) => e.target.id === 'confirmModal' && onCancel()}>
      <div className="modal">
        <div className="modal-icon warning">⚡</div>
        <h3>Konfirmasi Pembayaran</h3>
        <p id="confirmMessage" dangerouslySetInnerHTML={{ __html: message }} />
        <div className="modal-actions">
          <button className="btn-cancel" id="btnModalCancel" onClick={onCancel}>Batal</button>
          <button className="btn-confirm" id="btnModalConfirm" onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? 'Memproses...' : 'Ya, Bayar!'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SuccessModal({ show, message, onClose }) {
  return (
    <div className={`modal-overlay${show ? ' active' : ''}`} id="successModal" onClick={(e) => e.target.id === 'successModal' && onClose()}>
      <div className="modal">
        <div className="modal-icon success">🎉</div>
        <h3>Pembayaran Berhasil!</h3>
        <p id="successMessage">{message}</p>
        <div className="modal-actions">
          <button className="btn-confirm" id="btnSuccessClose" onClick={onClose}>Kembali</button>
        </div>
      </div>
    </div>
  );
}

// Modal simulasi "sedang memverifikasi pembayaran" — dipakai saat checkout,
// supaya alurnya tetap terasa seperti payment gateway asli (ada jeda proses +
// verifikasi status), walau di balik layar disimulasikan sendiri oleh backend.
export function ProcessingModal({ show, message }) {
  return (
    <div className={`modal-overlay${show ? ' active' : ''}`} id="processingModal">
      <div className="modal">
        <div className="modal-spinner" aria-hidden="true"></div>
        <h3>Memverifikasi Pembayaran</h3>
        <p>{message || 'Mohon tunggu sebentar, kami sedang mengecek status pembayaran kamu...'}</p>
      </div>
    </div>
  );
}
