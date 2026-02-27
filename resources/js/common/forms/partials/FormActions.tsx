'use client';

import { useFormsTranslation } from '@/common/forms/hooks/useFormsTranslation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

type CancelVariant = 'link' | 'ghostButton';
type DeleteVisibility = 'always' | 'never';
type ContainerElement = 'div' | 'section';

type FormActionsProps = {
  cancelHref: string;
  submitLabel: ReactNode;
  processing?: boolean;
  cancelLabel?: ReactNode;
  deleteHref?: string;
  deleteLabel?: ReactNode;
  showDeleteWhen?: DeleteVisibility;
  cancelVariant?: CancelVariant;
  disableCancelWhenProcessing?: boolean;
  submittingLabel?: ReactNode;
  showSpinnerWhenProcessing?: boolean;
  borderedTop?: boolean;
  as?: ContainerElement;
  className?: string;
};

export function FormActions({
  cancelHref,
  submitLabel,
  processing = false,
  cancelLabel,
  deleteHref,
  deleteLabel,
  showDeleteWhen = 'always',
  cancelVariant = 'link',
  disableCancelWhenProcessing = false,
  submittingLabel,
  showSpinnerWhenProcessing = false,
  borderedTop = false,
  as = 'div',
  className,
}: FormActionsProps) {
  const { translate } = useFormsTranslation();

  const resolvedCancelLabel =
    cancelLabel ?? translate('actions.cancel', 'Cancel');
  const resolvedDeleteLabel =
    deleteLabel ?? translate('actions.delete', 'Delete');

  const showDelete = Boolean(deleteHref) && showDeleteWhen === 'always';

  const Container = as;

  const containerClassName = cn(
    'flex flex-col-reverse items-center gap-3 sm:flex-row sm:items-center',
    showDelete ? 'sm:justify-between' : 'sm:justify-end',
    borderedTop ? 'border-t pt-4' : null,
    className,
  );

  const rightGroupClassName = cn(
    'flex flex-col-reverse items-center gap-3 sm:flex-row sm:items-center sm:justify-end',
    'w-full sm:w-auto',
  );

  const cancelControl =
    cancelVariant === 'ghostButton' ? (
      <Button
        asChild
        type="button"
        variant="ghost"
        disabled={disableCancelWhenProcessing && processing}
      >
        <Link href={cancelHref}>{resolvedCancelLabel}</Link>
      </Button>
    ) : (
      <Link
        href={cancelHref}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        {resolvedCancelLabel}
      </Link>
    );

  const submitControl = (
    <Button type="submit" disabled={processing} className="w-full sm:w-auto">
      {processing && submittingLabel ? (
        <>
          {showSpinnerWhenProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {submittingLabel}
        </>
      ) : (
        submitLabel
      )}
    </Button>
  );

  return (
    <Container className={containerClassName}>
      {showDelete ? (
        <Link
          href={deleteHref!}
          method="delete"
          as="button"
          className="text-destructive text-sm hover:underline"
        >
          {resolvedDeleteLabel}
        </Link>
      ) : null}

      <div className={rightGroupClassName}>
        {cancelControl}
        {submitControl}
      </div>
    </Container>
  );
}
