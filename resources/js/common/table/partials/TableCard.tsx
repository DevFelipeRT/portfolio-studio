import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import type { TableCardProps } from '../types';

export function TableCard({
  header,
  title,
  description,
  actions,
  className,
  contentClassName,
  children,
}: TableCardProps) {
  const hasInfo = Boolean(title || description);
  const hasHeader = Boolean(header) || hasInfo || actions;

  return (
    <Card className={cn('overflow-hidden border shadow-sm', className)}>
      {hasHeader ? (
        <>
          <CardHeader
            className={cn(
              header
                ? 'p-4'
                : [
                    'flex gap-4',
                    hasInfo
                      ? 'flex-row items-start justify-between'
                      : 'flex-row items-center justify-end',
                  ],
            )}
          >
            {header ? (
              header
            ) : (
              <>
                {hasInfo ? (
                  <div className="min-w-0 space-y-1">
                    {title ? (
                      <CardTitle className="text-base">{title}</CardTitle>
                    ) : null}
                    {description ? (
                      <p className="text-muted-foreground text-xs">
                        {description}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {actions ? <div className="shrink-0">{actions}</div> : null}
              </>
            )}
          </CardHeader>

          <Separator />
        </>
      ) : null}

      <CardContent className={cn('min-w-0 p-0', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
