import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color?: 'blue' | 'emerald' | 'rose' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color = 'blue'
}) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        {change && <p className="text-xs text-slate-400 mt-1">{change}</p>}
      </div>
      <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
