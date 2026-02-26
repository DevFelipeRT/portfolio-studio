import { cn } from '@/lib/utils';

interface FieldErrorProps {
  id?: string;
  message?: string | null;
  className?: string;
}

/**
 * Renders a field-level error message when a message is provided.
 */
export function FieldError({
  id,
  message,
  className,
}: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      id={id}
      role="alert"
      aria-atomic="true"
      className={cn('text-destructive text-sm font-medium', className)}
    >
      {message}
    </p>
  );
}
