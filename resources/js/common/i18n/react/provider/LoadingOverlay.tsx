'use client';

import type { ReactNode } from 'react';

type LoadingOverlayProps = {
    open: boolean;
    content?: ReactNode;
};

/**
 * Default overlay content rendered when no `content` is provided.
 */
function DefaultContent() {
    return (
        <div className="rounded-md border bg-background/90 px-4 py-2 shadow">
            <div className="flex items-center gap-2 text-sm">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/70" />
                <span>Loading…</span>
            </div>
        </div>
    );
}

/**
 * Renders a full-screen overlay while `open` is true.
 */
export function LoadingOverlay({ open, content }: LoadingOverlayProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
            <div className="absolute inset-0 flex items-center justify-center">
                {content ?? <DefaultContent />}
            </div>
        </div>
    );
}
