import { createContext, JSX, useContext, type ReactNode } from 'react';
import {
    createDefaultSectionEnvironment,
    type SectionEnvironment,
} from '../types/sectionEnvironment';

const SectionEnvironmentContext = createContext<SectionEnvironment>(
    createDefaultSectionEnvironment(),
);

interface SectionEnvironmentProviderProps {
    value: SectionEnvironment;
    children: ReactNode;
}

/**
 * Provides ambient front-only data for content-managed sections.
 */
export function SectionEnvironmentProvider({
    value,
    children,
}: SectionEnvironmentProviderProps): JSX.Element {
    return (
        <SectionEnvironmentContext.Provider value={value}>
            {children}
        </SectionEnvironmentContext.Provider>
    );
}

/**
 * Returns the current section environment for content-managed sections.
 */
export function useSectionEnvironment(): SectionEnvironment {
    return useContext(SectionEnvironmentContext);
}
