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
    <div className={cn('group relative', className)}>
      <Input
        className="pr-11 transition-colors placeholder:transition-colors group-hover:text-foreground group-hover:placeholder:text-foreground group-focus-within:text-foreground group-focus-within:placeholder:text-foreground"
        type="search"
        {...props}
      />

      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className={cn(
          'text-muted-foreground absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 hover:bg-transparent hover:text-primary focus-visible:bg-transparent focus-visible:text-primary focus-visible:ring-0 group-hover:text-foreground group-focus-within:text-foreground',
          buttonClassName,
        )}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">{buttonLabel}</span>
      </Button>
    </div>
  );
}
