import { cn } from '@/utils/cn';
import { CheckCircle2 } from 'lucide-react';

interface RepetitionBadgeProps {
  count: number;
  size?: 'sm' | 'md';
}

export const RepetitionBadge = ({ count, size = 'md' }: RepetitionBadgeProps) => {
  const boxes = [1, 2, 3];
  const isMastered = count >= 3;

  if (isMastered) {
    return (
      <span className={cn('inline-flex items-center gap-1 text-green-600 font-medium', size === 'sm' ? 'text-xs' : 'text-sm')}>
        <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
        習得済み
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-0.5">
      {boxes.map((n) => (
        <span
          key={n}
          className={cn(
            'rounded border transition-colors',
            size === 'sm' ? 'w-3 h-3' : 'w-4 h-4',
            n <= count ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
          )}
        />
      ))}
      <span className={cn('ml-1 text-gray-500', size === 'sm' ? 'text-xs' : 'text-xs')}>
        {count}/3回
      </span>
    </span>
  );
};
