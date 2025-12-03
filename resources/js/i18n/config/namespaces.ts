import { Namespace } from '../core/types';

/**
 * Namespaces group translation keys by domain of the interface.
 */
export const NAMESPACES = {
    common: 'common' as Namespace,
    layout: 'layout' as Namespace,
    home: 'home' as Namespace,
    experience: 'experience' as Namespace,
    projects: 'projects' as Namespace,
    courses: 'courses' as Namespace,
    contact: 'contact' as Namespace,
} as const;

export type KnownNamespace = (typeof NAMESPACES)[keyof typeof NAMESPACES];

/**
 * Returns all known namespaces supported by the front-end.
 */
export function getAllNamespaces(): Namespace[] {
    return Object.values(NAMESPACES);
}
