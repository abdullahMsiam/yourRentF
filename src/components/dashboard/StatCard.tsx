import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  accent?: 'default' | 'indigo' | 'emerald' | 'rose' | 'amber';
}

const ACCENT_CLASSES: Record<NonNullable<StatCardProps['accent']>, string> = {
  default: 'text-slate-400',
  indigo: 'text-indigo-500',
  emerald: 'text-emerald-500',
  rose: 'text-rose-500',
  amber: 'text-amber-500',
};

export default function StatCard({
  label,
  value,
  icon,
  accent = 'default',
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between">
        <p
          className={`text-xs font-bold uppercase tracking-wider ${ACCENT_CLASSES[accent]}`}
        >
          {label}
        </p>
        {icon && <span className="text-slate-300">{icon}</span>}
      </div>
      <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{value}</p>
    </div>
  );
}
