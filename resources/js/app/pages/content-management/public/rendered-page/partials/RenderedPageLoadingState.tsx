'use client';

import { I18N_NAMESPACES, useTranslation } from '@/common/i18n';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

type RenderedPageLoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function RenderedPageLoadingState({
  title,
  description,
  className,
}: RenderedPageLoadingStateProps) {
  const { translate: tState } = useTranslation(I18N_NAMESPACES.state);

  const resolvedTitle =
    title ?? tState('loadingContent', 'Loading content…');
  const resolvedDescription =
    description ?? tState('loadingPleaseWait', 'Please wait a moment.');

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex h-full w-full flex-1 items-center justify-center px-6 py-10 text-center',
        className,
      )}
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-3">
        <div className="bg-primary-muted/50 flex size-12 items-center justify-center rounded-full">
          <Spinner
            aria-hidden="true"
            focusable="false"
            className="text-primary size-5"
          />
        </div>

        <div className="space-y-1">
          <div className="text-foreground text-base font-semibold leading-6 tracking-tight sm:text-lg">
            {resolvedTitle}
          </div>
          {resolvedDescription ? (
            <div className="text-muted-foreground text-sm leading-6">
              {resolvedDescription}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
