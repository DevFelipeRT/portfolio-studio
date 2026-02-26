'use client';

import { useFormsTranslation } from '@/common/forms/hooks/useFormsTranslation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

type FormActionsAlign = 'right' | 'split';
type CancelVariant = 'link' | 'ghostButton';
type DeleteVisibility = 'always' | 'splitOnly';
type ContainerElement = 'div' | 'section';

type FormActionsProps = {
  cancelHref: string;
  submitLabel: ReactNode;
  processing?: boolean;
  cancelLabel?: ReactNode;
  align?: FormActionsAlign;
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
  align = 'right',
  deleteHref,
  deleteLabel,
  showDeleteWhen = 'splitOnly',
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

  const isSplit = align === 'split';
  const showDelete =
    Boolean(deleteHref) && (showDeleteWhen === 'always' || isSplit);

  const Container = as;

  const containerClassName = cn(
    'flex items-center gap-3',
    isSplit ? 'justify-between' : 'justify-end',
    borderedTop ? 'border-t pt-4' : null,
    className,
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
    <Button type="submit" disabled={processing}>
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

  if (isSplit) {
    return (
      <Container className={containerClassName}>
        {cancelControl}

        <div className="flex items-center gap-3">
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

          {submitControl}
        </div>
      </Container>
    );
  }

  return (
    <Container className={containerClassName}>
      {cancelControl}
      {submitControl}
    </Container>
  );
}

