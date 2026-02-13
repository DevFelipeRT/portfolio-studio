import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

type TranslationModalLayoutProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  maxWidthClassName?: string;
};

export function TranslationModalLayout({
  open,
  onOpenChange,
  title,
  description,
  headerAction,
  footer,
  children,
  maxWidthClassName = 'max-w-4xl',
}: TranslationModalLayoutProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`flex max-h-[90vh] min-h-0 ${maxWidthClassName} flex-col gap-0 p-0`}
      >
        <DialogHeader className="border-b px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <DialogTitle>{title}</DialogTitle>
              {description ? (
                <DialogDescription>{description}</DialogDescription>
              ) : null}
            </div>
            {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0">{children}</div>

        {footer ? (
          <DialogFooter className="border-t px-6 py-4">{footer}</DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

type TranslationModalBodyProps = {
  children: React.ReactNode;
};

export function TranslationModalBody({ children }: TranslationModalBodyProps) {
  return <ScrollArea className="flex-1 min-h-0 px-6 py-4">{children}</ScrollArea>;
}
