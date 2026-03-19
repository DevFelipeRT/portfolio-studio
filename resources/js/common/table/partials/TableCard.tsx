import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import type { TableCardProps } from '../types';

export function TableCard({
  title,
  description,
  actions,
  className,
  contentClassName,
  children,
}: TableCardProps) {
  const hasHeader = title || description || actions;

  return (
    <Card className={cn('overflow-hidden border shadow-sm', className)}>
      {hasHeader ? (
        <>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              {title ? <CardTitle className="text-base">{title}</CardTitle> : null}
              {description ? (
                <p className="text-muted-foreground text-xs">{description}</p>
              ) : null}
            </div>

            {actions ? <div className="shrink-0">{actions}</div> : null}
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
