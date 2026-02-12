import { JSX, ReactNode } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  actions?: ReactNode;
  level?: HeadingLevel;
}

const headingTypographyByLevel: Record<HeadingLevel, string> = {
  1: 'text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight',
  2: 'text-2xl sm:text-3xl font-semibold tracking-tight',
  3: 'text-xl sm:text-2xl font-semibold tracking-tight',
  4: 'text-lg sm:text-xl font-semibold',
  5: 'text-base sm:text-lg font-semibold',
  6: 'text-sm sm:text-base font-semibold',
};

const descriptionTypographyByLevel: Record<HeadingLevel, string> = {
  1: 'text-muted-foreground max-w-3xl text-base md:text-lg leading-relaxed',
  2: 'text-muted-foreground max-w-2xl text-sm sm:text-base leading-relaxed',
  3: 'text-muted-foreground max-w-xl text-sm leading-relaxed',
  4: 'text-muted-foreground max-w-lg text-xs sm:text-sm leading-relaxed',
  5: 'text-muted-foreground max-w-md text-xs sm:text-sm leading-relaxed',
  6: 'text-muted-foreground max-w-md text-xs leading-relaxed',
};

/**
 * SectionHeader renders a consistent heading block for landing page sections.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  actions,
  level = 2,
}: SectionHeaderProps) {
  const alignment =
    align === 'center' ? 'items-center text-center' : 'items-start text-left';

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  const headingClassName = headingTypographyByLevel[level];
  const descriptionClassName = descriptionTypographyByLevel[level];

  return (
    <header className={`flex flex-col gap-3 ${alignment}`}>
      {eyebrow && (
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
          {eyebrow}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <HeadingTag className={headingClassName}>{title}</HeadingTag>

        {description && <p className={descriptionClassName}>{description}</p>}
      </div>

      {actions && <div className="mt-1 flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
