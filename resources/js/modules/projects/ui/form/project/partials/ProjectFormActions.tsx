import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface ProjectFormActionsProps {
  processing: boolean;
  submitLabel: string;
  cancelHref: string;
  deleteHref?: string;
}

export function ProjectFormActions({
  processing,
  submitLabel,
  cancelHref,
  deleteHref,
}: ProjectFormActionsProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Link
        href={cancelHref}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        Cancel
      </Link>

      <div className="flex items-center gap-3">
        {deleteHref && (
          <Link
            href={deleteHref}
            method="delete"
            as="button"
            className="text-destructive text-sm hover:underline"
          >
            Delete
          </Link>
        )}

        <Button type="submit" disabled={processing}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}

