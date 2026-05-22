import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className, onClick }: CardProps) => (
  <div
    className={cn(
      'bg-white rounded-xl border border-gray-200 shadow-sm',
      onClick && 'cursor-pointer hover:shadow-md transition-shadow',
      className
    )}
    onClick={onClick}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('px-5 py-4 border-b border-gray-100', className)}>{children}</div>
);

export const CardBody = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('px-5 py-4', className)}>{children}</div>
);
