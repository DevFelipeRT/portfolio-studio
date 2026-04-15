import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

import type {
  ItemDialogActionsProps,
  ItemDialogBadgesProps,
  ItemDialogBodyProps,
  ItemDialogComponent,
  ItemDialogContentProps,
  ItemDialogDescriptionProps,
  ItemDialogHeadingProps,
  ItemDialogHeaderProps,
  ItemDialogHeaderRowProps,
  ItemDialogMainProps,
  ItemDialogMetadataProps,
  ItemDialogRootProps,
  ItemDialogTitleProps,
} from './types';

function ItemDialogRoot({ children, ...props }: ItemDialogRootProps) {
  return <Dialog {...props}>{children}</Dialog>;
}

function ItemDialogContent({
  className,
  children,
  ...props
}: ItemDialogContentProps) {
  return (
    <DialogContent
      showCloseButton={false}
      className={cn(
        'grid max-h-[90dvh] min-h-0 max-w-xl grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0',
        className,
      )}
      {...props}
    >
      {children}
    </DialogContent>
  );
}

function ItemDialogHeader({
  className,
  ...props
}: ItemDialogHeaderProps) {
  return (
    <DialogHeader
      className={cn('shrink-0 space-y-4 border-b px-6 py-5', className)}
      {...props}
    />
  );
}

function ItemDialogHeaderRow({
  className,
  ...props
}: ItemDialogHeaderRowProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-start md:justify-between',
        className,
      )}
      {...props}
    />
  );
}

function ItemDialogMain({ className, ...props }: ItemDialogMainProps) {
  return <div className={cn('min-w-0 flex-1 space-y-3', className)} {...props} />;
}

function ItemDialogHeading({
  className,
  children,
  ...props
}: ItemDialogHeadingProps) {
  return (
    <div
      className={cn(
        'grid min-w-0 items-start gap-3 grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] sm:gap-x-4',
        className,
      )}
      {...props}
    >
      <div aria-hidden className="hidden size-8 sm:block" />
      <div className="min-w-0 space-y-3 sm:text-center">
        {children}
      </div>
      <DialogClose className="flex size-8 items-center justify-center justify-self-end rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogClose>
    </div>
  );
}

function ItemDialogTitle({ className, ...props }: ItemDialogTitleProps) {
  return (
    <DialogTitle
      className={cn('text-lg leading-tight font-semibold xs:text-xl', className)}
      {...props}
    />
  );
}

function ItemDialogDescription({
  className,
  ...props
}: ItemDialogDescriptionProps) {
  return (
    <DialogDescription
      className={cn('max-w-2xl text-sm leading-6', className)}
      {...props}
    />
  );
}

function ItemDialogBadges({ className, ...props }: ItemDialogBadgesProps) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-1.5 xs:gap-2', className)}
      {...props}
    />
  );
}

function ItemDialogMetadata({
  className,
  ...props
}: ItemDialogMetadataProps) {
  return (
    <div
      className={cn(
        'text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs',
        className,
      )}
      {...props}
    />
  );
}

function ItemDialogActions({ className, ...props }: ItemDialogActionsProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 md:flex-none md:justify-end',
        className,
      )}
      {...props}
    />
  );
}

function ItemDialogBody({ className, ...props }: ItemDialogBodyProps) {
  return (
    <div className={cn('min-h-0 min-w-0 px-6 py-5', className)} {...props} />
  );
}

export const ItemDialog = Object.assign(ItemDialogRoot, {
  Actions: ItemDialogActions,
  Badges: ItemDialogBadges,
  Body: ItemDialogBody,
  Content: ItemDialogContent,
  Description: ItemDialogDescription,
  Heading: ItemDialogHeading,
  Header: ItemDialogHeader,
  HeaderRow: ItemDialogHeaderRow,
  Main: ItemDialogMain,
  Metadata: ItemDialogMetadata,
  Title: ItemDialogTitle,
}) as ItemDialogComponent;
