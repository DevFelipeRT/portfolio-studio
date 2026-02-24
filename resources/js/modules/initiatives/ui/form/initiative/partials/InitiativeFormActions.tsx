import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface InitiativeFormActionsProps {
  cancelHref: string;
  processing: boolean;
  submitLabel: string;
}

export function InitiativeFormActions({
  cancelHref,
  processing,
  submitLabel,
}: InitiativeFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Link
        href={cancelHref}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        Cancel
      </Link>

      <Button type="submit" disabled={processing}>
        {submitLabel}
      </Button>
    </div>
  );
}

