import type { ChangeEvent, ComponentPropsWithoutRef, ReactNode } from 'react';
import { useRef } from 'react';
import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type SearchFieldProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'size'
> & {
  buttonLabel?: ReactNode;
  buttonClassName?: string;
};

export function SearchField({
  className,
  buttonLabel = 'Search',
  buttonClassName,
  value,
  onChange,
  ...props
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchValue =
    typeof value === 'string' || typeof value === 'number' ? String(value) : '';
  const hasValue = searchValue.trim() !== '';

  const handleClear = (): void => {
    const input = inputRef.current;

    if (input === null) {
      return;
    }

    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set;

    valueSetter?.call(input, '');

    onChange?.({
      target: input,
      currentTarget: input,
    } as ChangeEvent<HTMLInputElement>);

    requestAnimationFrame(() => {
      input.focus();
      input.form?.requestSubmit();
    });
  };

  return (
    <div className={cn('group relative', className)}>
      <Input
        ref={inputRef}
        className="pr-18 transition-colors placeholder:transition-colors group-hover:text-foreground group-hover:placeholder:text-foreground"
        type="text"
        enterKeyHint="search"
        value={value}
        onChange={onChange}
        {...props}
      />

      {hasValue ? (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-muted-foreground absolute top-1/2 right-8 h-7 w-7 -translate-y-1/2 hover:bg-transparent hover:text-primary focus-visible:bg-transparent focus-visible:text-primary focus-visible:ring-0"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      ) : null}

      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className={cn(
          'text-muted-foreground absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 hover:bg-transparent hover:text-primary focus-visible:bg-transparent focus-visible:text-primary focus-visible:ring-0',
          buttonClassName,
        )}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">{buttonLabel}</span>
      </Button>
    </div>
  );
}
