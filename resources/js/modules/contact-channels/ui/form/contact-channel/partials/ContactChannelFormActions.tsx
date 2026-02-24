import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

import type { ContactChannelFormAlignment } from '../types';

interface ContactChannelFormActionsProps {
  cancelHref: string;
  submitLabel: string;
  processing: boolean;
  deleteHref?: string;
  deleteLabel: string;
  alignActions: ContactChannelFormAlignment;
}

export function ContactChannelFormActions({
  cancelHref,
  submitLabel,
  processing,
  deleteHref,
  deleteLabel,
  alignActions,
}: ContactChannelFormActionsProps) {
  if (alignActions === 'split') {
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
              {deleteLabel}
            </Link>
          )}

          <Button type="submit" disabled={processing}>
            {submitLabel}
          </Button>
        </div>
      </div>
    );
  }

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

