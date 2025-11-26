import { ReactNode } from 'react';

interface SectionHeaderProps {
    eyebrow?: string;
    title: string;
    description?: string;
    align?: 'left' | 'center';
    actions?: ReactNode;
}

/**
 * SectionHeader renders a consistent heading block for landing page sections.
 */
export function SectionHeader({
    eyebrow,
    title,
    description,
    align = 'left',
    actions,
}: SectionHeaderProps) {
    const alignment =
        align === 'center'
            ? 'items-center text-center'
            : 'items-start text-left';

    return (
        <header className={`flex flex-col gap-3 ${alignment}`}>
            {eyebrow && (
                <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                    {eyebrow}
                </p>
            )}

            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {title}
                </h2>
                {description && (
                    <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed sm:text-base">
                        {description}
                    </p>
                )}
            </div>

            {actions && (
                <div className="mt-1 flex flex-wrap gap-2">{actions}</div>
            )}
        </header>
    );
}
