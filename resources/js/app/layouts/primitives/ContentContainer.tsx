import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from 'react';
import { cn } from '../../../lib/utils';

export type ContentWidth = 'reading' | 'default' | 'wide' | 'full';

type ContentContainerProps<TElement extends ElementType = 'div'> = {
  as?: TElement;
  contentWidth?: ContentWidth;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<TElement>, 'as' | 'children' | 'className'>;

const contentWidthClassName: Record<ContentWidth, string> = {
  reading: 'max-w-3xl',
  default: 'max-w-7xl',
  wide: 'max-w-screen-2xl',
  full: 'max-w-none',
};

export function ContentContainer<TElement extends ElementType = 'div'>({
  as,
  children,
  className,
  contentWidth = 'default',
  ...props
}: ContentContainerProps<TElement>) {
  const Component = as ?? 'div';

  return (
    <Component
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        contentWidthClassName[contentWidth],
        contentWidth === 'full' && 'px-0',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

