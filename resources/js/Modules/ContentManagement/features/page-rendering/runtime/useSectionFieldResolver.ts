import { useContext } from 'react';
import { SectionFieldResolverContext } from './sectionFieldResolverProvider';
import { SectionFieldResolver } from '../types';

/**
 * Returns the field resolver for the current content-managed section.
 *
 * Components must use this hook to access CMS values with the correct
 * precedence between persisted data and template defaults.
 */
export function useSectionFieldResolver(): SectionFieldResolver {
  const resolver = useContext(SectionFieldResolverContext);

  if (!resolver) {
    throw new Error(
      'useSectionFieldResolver must be used within a SectionFieldResolverProvider.',
    );
  }

  return resolver;
}
