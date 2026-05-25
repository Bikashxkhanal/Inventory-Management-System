const STYLES = {
  draft: 'bg-amber-100 text-amber-800 ring-amber-200',
  completed: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  rejected: 'bg-red-100 text-red-800 ring-red-200',
};

const LABELS = {
  draft: 'Pending review',
  completed: 'Completed',
  rejected: 'Rejected',
};

const PurchaseStatusBadge = ({ status }) => {
  const key = String(status ?? 'draft').toLowerCase();
  const style = STYLES[key] ?? 'bg-slate-100 text-slate-700 ring-slate-200';
  const label = LABELS[key] ?? status;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style}`}
    >
      {label}
    </span>
  );
};

export default PurchaseStatusBadge;
