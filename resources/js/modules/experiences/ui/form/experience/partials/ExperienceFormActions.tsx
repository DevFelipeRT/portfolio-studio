import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface ExperienceFormActionsProps {
  cancelHref: string;
  submitLabel: string;
  processing: boolean;
}

export function ExperienceFormActions({
  cancelHref,
  submitLabel,
  processing,
}: ExperienceFormActionsProps) {
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

