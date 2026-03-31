import { forwardRef } from 'react';

import { TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

import type { InteractiveTableRowKeyboardEvent, InteractiveTableRowMouseEvent, InteractiveTableRowProps } from '../types';
import { surfaceVariantClassName } from './TableSurfaceRow';

export const InteractiveTableRow = forwardRef<
  HTMLTableRowElement,
  InteractiveTableRowProps
>(function InteractiveTableRow(
  {
    active = false,
    className,
    interactive = false,
    onActivate,
    onClick,
    onKeyDown,
    tabIndex,
    variant = 'default',
    ...props
  },
  ref,
) {
  const isInteractive = interactive && typeof onActivate === 'function';

  function handleClick(event: InteractiveTableRowMouseEvent) {
    onClick?.(event);

    if (event.defaultPrevented || !isInteractive || !isRowActivationEvent(event)) {
      return;
    }

    onActivate?.();
  }

  function handleKeyDown(event: InteractiveTableRowKeyboardEvent) {
    onKeyDown?.(event);

    if (
      event.defaultPrevented ||
      !isInteractive ||
      !isRowActivationEvent(event)
    ) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate?.();
    }
  }

  return (
    <TableRow
      ref={ref}
      className={cn(
        surfaceVariantClassName(variant, active),
        isInteractive &&
          'group cursor-pointer focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        className,
      )}
      tabIndex={isInteractive ? (tabIndex ?? 0) : tabIndex}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
});

InteractiveTableRow.displayName = 'InteractiveTableRow';

function isRowActivationEvent(
  event: InteractiveTableRowMouseEvent | InteractiveTableRowKeyboardEvent,
): boolean {
  const currentElement = event.currentTarget as HTMLElement | null;
  const targetElement = event.target as HTMLElement | null;

  if (!currentElement || !targetElement) {
    return false;
  }

  const interactiveAncestor = targetElement.closest(
    [
      'a',
      'button',
      'input',
      'select',
      'textarea',
      '[role="button"]',
      '[role="link"]',
      '[role="checkbox"]',
      '[role="menuitem"]',
      '[data-row-action]',
    ].join(','),
  );

  if (interactiveAncestor && interactiveAncestor !== currentElement) {
    return false;
  }

  const activeElement = document.activeElement;

  return activeElement === null || activeElement === currentElement;
}
