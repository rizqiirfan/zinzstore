import { formatRupiah } from '../utils/format';

export default function PackageGrid({ packages, selectedId, onSelect }) {
  return (
    <div className="packages-grid" id="packagesGrid">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className={`package-card glass-card${selectedId === pkg.id ? ' selected' : ''}`}
          data-package-id={pkg.id}
          onClick={() => onSelect(pkg.id)}
        >
          {pkg.label && <span className="package-badge">{pkg.label}</span>}
          <div className="diamond-count">💎 {pkg.diamonds}</div>
          {pkg.bonus > 0 && <div className="diamond-bonus">+{pkg.bonus} Bonus</div>}
          <div className="diamond-price">{formatRupiah(pkg.price)}</div>
        </div>
      ))}
    </div>
  );
}
