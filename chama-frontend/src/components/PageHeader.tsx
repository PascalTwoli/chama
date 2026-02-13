import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from '../utils/cn';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  action,
  className,
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
        {/* <Button
          variant='outline'
          size='sm' // size-sm was invalid? I think user removed it. Just checking button.tsx. It has sizes. I'll rely on default or h-9.
          className='w-9 h-9 p-0 rounded-full flex items-center justify-center shrink-0 border-border bg-background'
          onClick={() => navigate(-1)}
          title='Go back'
        >
          <ArrowLeft className='w-4 h-4' />
        </Button> */}
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
