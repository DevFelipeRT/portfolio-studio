import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import type { TableDetailDialogProps } from '../types';

export function TableDetailDialog({
  open,
  onOpenChange,
  title,
  description,
  className,
  children,
  ...props
}: TableDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('max-w-xl', className)} {...props}>
        {title || description ? (
          <DialogHeader>
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>
        ) : null}

        {children}
      </DialogContent>
    </Dialog>
  );
}
