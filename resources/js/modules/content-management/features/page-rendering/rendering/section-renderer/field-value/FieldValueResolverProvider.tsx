import { createContext, type JSX, type ReactNode } from 'react';
import { FieldValueResolver } from '../../../types';

export const FieldValueResolverContext = createContext<
  FieldValueResolver | undefined
>(undefined);

interface FieldValueResolverProviderProps {
  resolver: FieldValueResolver;
  children: ReactNode;
}

/**
 * Provides a value resolver for a specific content-managed section.
 */
export function FieldValueResolverProvider({
  resolver,
  children,
}: FieldValueResolverProviderProps): JSX.Element {
  return (
    <FieldValueResolverContext.Provider value={resolver}>
      {children}
    </FieldValueResolverContext.Provider>
  );
}
