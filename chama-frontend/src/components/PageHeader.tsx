import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from '../utils/cn';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  showBackButton?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  action,
  className,
  showBackButton,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3',
        className
      )}
    >
      <div className='flex items-start gap-4'>
        {showBackButton && (
          <Button
            variant='outline'
            size='sm'
            className='w-9 h-9 p-0 rounded-full flex items-center justify-center shrink-0 border-border bg-background mt-1'
            onClick={() => navigate(-1)}
            title='Go back'
          >
            <ArrowLeft className='w-4 h-4' />
          </Button>
        )}
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight text-foreground m-0'>
            {title}
          </h1>
          {subtitle && (
            <p className='text-sm text-muted-foreground m-0'>{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className='flex items-center gap-2'>{action}</div>}
    </div>
  );
}
