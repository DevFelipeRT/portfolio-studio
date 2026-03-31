import type { ReactNode } from 'react';
import type { ContentWidth } from './ContentContainer';
import { ContentContainer } from './ContentContainer';
import { cn } from '@/lib/utils';

export type PageWidth =
  | 'container'
  | 'form'
  | 'detail'
  | 'editor'
  | 'default'
  | 'wide';

export type PageContentProps = {
  contentWidth?: ContentWidth;
  pageWidth?: PageWidth;
  className?: string;
  children: ReactNode;
};

const pageWidthClassName: Record<PageWidth, string> = {
  container: 'max-w-none',
  form: 'max-w-xl',
  detail: 'max-w-3xl',
  editor: 'max-w-4xl',
  default: 'max-w-5xl',
  wide: 'max-w-6xl',
};

export function PageContent({
  children,
  className,
  contentWidth = 'default',
  pageWidth = 'container',
}: PageContentProps) {
  return (
    <ContentContainer contentWidth={contentWidth}>
      <div
        className={cn(
          'mx-auto w-full',
          pageWidthClassName[pageWidth],
          className,
        )}
      >
        {children}
      </div>
    </ContentContainer>
  );
}
