import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import type { TableSearchFieldProps } from '../types';

export function TableSearchField({
  className,
  buttonLabel = 'Search',
  buttonClassName,
  ...props
}: TableSearchFieldProps) {
  return (
    <div className={cn('relative', className)}>
      <Input className="pr-11" type="search" {...props} />

      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className={cn(
          'absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2',
          buttonClassName,
        )}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">{buttonLabel}</span>
      </Button>
    </div>
  );
}
