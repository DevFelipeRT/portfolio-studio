import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface WebsiteSettingsFormActionsProps {
  cancelHref: string;
  processing: boolean;
  cancelLabel: string;
  submitLabel: string;
}

export function WebsiteSettingsFormActions({
  cancelHref,
  processing,
  cancelLabel,
  submitLabel,
}: WebsiteSettingsFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Link
        href={cancelHref}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        {cancelLabel}
      </Link>
      <Button type="submit" disabled={processing}>
        {submitLabel}
      </Button>
    </div>
  );
}

