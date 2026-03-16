import type { ReactNode } from 'react';
import type { ContentWidth } from './ContentContainer';
import { ContentContainer } from './ContentContainer';

export type SectionContentProps = {
  contentWidth?: Exclude<ContentWidth, 'full'>;
  className?: string;
  children: ReactNode;
};

export function SectionContent({
  children,
  className,
  contentWidth = 'default',
}: SectionContentProps) {
  return (
    <ContentContainer className={className} contentWidth={contentWidth}>
      {children}
    </ContentContainer>
  );
}

