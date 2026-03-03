'use client';

import type { ReactNode } from 'react';

type LoadingOverlayProps = {
  open: boolean;
  content?: ReactNode;
};

export function LoadingOverlay({ open, content }: LoadingOverlayProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="bg-background/70 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      aria-busy="true"
      aria-live="polite"
    >
      {content ?? (
        <div className="text-muted-foreground rounded-md bg-background px-3 py-2 text-sm shadow">
          Loading…
        </div>
      )}
    </div>
  );
}

