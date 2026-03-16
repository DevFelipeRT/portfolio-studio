import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from 'react';
import { cn } from '../../../lib/utils';

export type SectionSurface = 'default' | 'muted' | 'accent' | 'inverse';
export type SectionSpacing = 'sm' | 'md' | 'lg';

type SectionProps<TElement extends ElementType = 'section'> = {
  as?: TElement;
  surface?: SectionSurface;
  bleed?: boolean;
  spacing?: SectionSpacing;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<TElement>, 'as' | 'children' | 'className'>;

const surfaceClassName: Record<SectionSurface, string> = {
  default: 'bg-background text-foreground',
  muted: 'bg-muted/40 text-foreground',
  accent: 'bg-accent/20 text-foreground',
  inverse: 'bg-foreground text-background',
};

const spacingClassName: Record<SectionSpacing, string> = {
  sm: 'py-4 md:py-6',
  md: 'py-6 md:py-8 lg:py-10',
  lg: 'py-8 md:py-12 lg:py-16',
};

export function Section<TElement extends ElementType = 'section'>({
  as,
  bleed = false,
  children,
  className,
  spacing = 'lg',
  surface = 'default',
  ...props
}: SectionProps<TElement>) {
  const Component = as ?? 'section';

  return (
    <Component
      className={cn(
        'w-full',
        surfaceClassName[surface],
        spacingClassName[spacing],
        bleed && 'overflow-x-clip',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
