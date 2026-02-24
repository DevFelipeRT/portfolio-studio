import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

interface CourseFormActionsProps {
  cancelHref: string;
  processing: boolean;
  cancelLabel: string;
  saveLabel: string;
  savingLabel: string;
}

export function CourseFormActions({
  cancelHref,
  processing,
  cancelLabel,
  saveLabel,
  savingLabel,
}: CourseFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Button asChild type="button" variant="ghost" disabled={processing}>
        <Link href={cancelHref}>{cancelLabel}</Link>
      </Button>

      <Button type="submit" disabled={processing}>
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {savingLabel}
          </>
        ) : (
          saveLabel
        )}
      </Button>
    </div>
  );
}

