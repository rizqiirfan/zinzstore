export default function PaymentGrid({ methods, category, selectedId, onSelect }) {
  const filtered = methods.filter((m) => m.category === category);

  return (
    <div className="payment-grid" id={category === 'ewallet' ? 'ewalletGrid' : 'qrisGrid'}>
      {filtered.map((m) => (
        <div
          key={m.id}
          className={`payment-option glass-card${selectedId === m.id ? ' selected' : ''}`}
          data-payment-id={m.id}
          onClick={() => onSelect(m.id)}
        >
          <img src={`/${m.icon}`} alt={m.name} className="payment-img-icon" />
          <span className="payment-name">{m.name}</span>
        </div>
      ))}
    </div>
  );
}
