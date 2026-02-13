import { createContext, JSX, useContext, type ReactNode } from 'react';
import {
  createDefaultPageRenderingContext,
  getPageRenderingContextValue,
  type PageRenderingContext,
} from './pageRenderingContext';

const PageRenderingContextValue = createContext<PageRenderingContext>(
  createDefaultPageRenderingContext(),
);

interface PageRenderingContextProviderProps {
  value: PageRenderingContext;
  children: ReactNode;
}

/**
 * Provides ambient front-only data for content-managed sections.
 */
export function PageRenderingContextProvider({
  value,
  children,
}: PageRenderingContextProviderProps): JSX.Element {
  return (
    <PageRenderingContextValue.Provider value={value}>
      {children}
    </PageRenderingContextValue.Provider>
  );
}

/**
 * Returns the current page rendering context.
 */
export function usePageRenderingContext(): PageRenderingContext {
  return useContext(PageRenderingContextValue);
}

/**
 * Returns one namespaced value from the current page rendering context.
 */
export function usePageRenderingContextValue<TValue = unknown>(
  namespace: string,
): TValue | undefined {
  const context = usePageRenderingContext();
  return getPageRenderingContextValue<TValue>(context, namespace);
}
