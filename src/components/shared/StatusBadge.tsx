import { RentalStatus } from '@/types';

export function StatusBadge({ status }: { status: RentalStatus }) {
  const styles: Record<RentalStatus, string> = {
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    APPROVED: 'bg-blue-100 text-blue-800 border-blue-200',
    REJECTED: 'bg-rose-100 text-rose-800 border-rose-200',
    ACTIVE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    COMPLETED: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
}