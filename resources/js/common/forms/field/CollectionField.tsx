import { FieldError } from '@/common/forms/field/error/FieldError';
import { resolveFieldErrorMessage } from '@/common/forms/field/error/fieldErrorMessage';
import type { FormErrors } from '@/common/forms/types';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CollectionFieldProps<Item> {
  name: string;
  items: Item[];
  errors: FormErrors<string>;
  renderItem: (item: Item, index: number) => ReactNode;
  emptyState?: ReactNode;
  actions?: ReactNode;
  errorId?: string;
  className?: string;
}

/**
 * Renders a collection of fields with a shared group error.
 */
export function CollectionField<Item>({
  name,
  items,
  errors,
  renderItem,
  emptyState,
  actions,
  errorId = `${name}-error`,
  className,
}: CollectionFieldProps<Item>) {
  const error = resolveFieldErrorMessage(errors, name);

  return (
    <div className={cn('space-y-3', className)}>
      {items.length === 0 && emptyState}
      {items.map((item, index) => renderItem(item, index))}
      {actions}
      <FieldError id={errorId} message={error} />
    </div>
  );
}
