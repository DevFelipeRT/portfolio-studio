import { createContext, type JSX, type ReactNode } from 'react';
import { SectionFieldResolver } from '../types';

export const SectionFieldResolverContext = createContext<
  SectionFieldResolver | undefined
>(undefined);

interface SectionFieldResolverProviderProps {
  resolver: SectionFieldResolver;
  children: ReactNode;
}

/**
 * Provides a field resolver for a specific content-managed section.
 */
export function SectionFieldResolverProvider({
  resolver,
  children,
}: SectionFieldResolverProviderProps): JSX.Element {
  return (
    <SectionFieldResolverContext.Provider value={resolver}>
      {children}
    </SectionFieldResolverContext.Provider>
  );
}
