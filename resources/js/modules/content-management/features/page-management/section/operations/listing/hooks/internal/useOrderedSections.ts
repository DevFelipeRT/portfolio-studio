import React from 'react';

import type { PageSectionDto } from '@/modules/content-management/types';

/**
 * Keeps a local "ordered sections" state that mirrors the latest server-provided
 * `sections` input.
 *
 * This is useful for optimistic UI (drag ordering) without mutating the prop.
 */
export function useOrderedSections(sections: PageSectionDto[]) {
  const [orderedSections, setOrderedSections] = React.useState(sections);

  React.useEffect(() => {
    setOrderedSections(sections);
  }, [sections]);

  return { orderedSections, setOrderedSections };
}
