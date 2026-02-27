import { FieldError as ShadcnFieldError } from '@/components/ui/field';

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
    <ShadcnFieldError id={id} className={className}>
      {message}
    </ShadcnFieldError>
  );
}
