import { useContext } from 'react';
import { FieldValueResolver } from '../../../types';
import { FieldValueResolverContext } from './FieldValueResolverProvider';

/**
 * Returns the value resolver for the current content-managed section.
 *
 * Components must use this hook to access CMS values with the correct
 * precedence between persisted data and template defaults.
 */
export function useFieldValueResolver(): FieldValueResolver {
  const resolver = useContext(FieldValueResolverContext);

  if (!resolver) {
    throw new Error(
      'useFieldValueResolver must be used within a FieldValueResolverProvider.',
    );
  }

  return resolver;
}
