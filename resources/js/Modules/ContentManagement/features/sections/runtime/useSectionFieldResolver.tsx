import type { SectionFieldResolver } from '@/Modules/ContentManagement/features/sections/lib/sectionFieldResolver';
import { createContext, useContext, type JSX, type ReactNode } from 'react';

const SectionFieldResolverContext = createContext<
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
