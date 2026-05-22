import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar = ({ value, max = 100, className, color = 'bg-blue-500', showLabel, label }: ProgressBarProps) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{label ?? '進捗'}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn('h-2 rounded-full transition-all duration-500', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
