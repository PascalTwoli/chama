import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { cn } from '../utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string; // e.g. "63% paid"
  trend?: 'up' | 'down' | 'neutral';
  status?: 'success' | 'warning' | 'destructive' | 'default'; // For icon color or badge
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  subtext,
  status = 'default',
  className,
}: StatsCardProps) {
  const statusStyles = {
    success:
      'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    warning:
      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    destructive: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    default: 'bg-muted text-muted-foreground',
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className='p-6 flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-muted-foreground m-0'>
            {title}
          </p>
          <div className='flex items-baseline gap-2'>
            <h2 className='text-2xl font-bold tracking-tight m-0'>{value}</h2>
          </div>
          {subtext && (
            <p
              className={cn(
                'text-xs font-medium m-0 mt-1',
                status === 'success' && 'text-success',
                status === 'warning' && 'text-warning',
                status === 'destructive' && 'text-destructive',
                status === 'default' && 'text-muted-foreground'
              )}
            >
              {subtext}
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg', // Design uses rounded-lg for icons
            statusStyles[status]
          )}
        >
          <Icon className='h-6 w-6' />
        </div>
      </CardContent>
    </Card>
  );
}
