import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface ImageFormActionsProps {
  cancelHref: string;
  cancelLabel: string;
  submitLabel: string;
  processing: boolean;
}

export function ImageFormActions({
  cancelHref,
  cancelLabel,
  submitLabel,
  processing,
}: ImageFormActionsProps) {
  return (
    <section className="flex items-center justify-between border-t pt-4">
      <Link
        href={cancelHref}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        {cancelLabel}
      </Link>

      <Button type="submit" disabled={processing}>
        {submitLabel}
      </Button>
    </section>
  );
}

