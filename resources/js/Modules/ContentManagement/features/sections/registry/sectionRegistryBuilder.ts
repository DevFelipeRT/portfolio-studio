import type {
    SectionComponentRegistry,
    SectionRegistryProvider,
} from '@/Modules/ContentManagement/features/sections/registry/sectionRegistry';

function collectDuplicateKeys(
    baseRegistry: SectionComponentRegistry,
    providers: SectionRegistryProvider[],
): string[] {
    const occurrences = new Map<string, number>();
    const track = (key: string) => {
        occurrences.set(key, (occurrences.get(key) ?? 0) + 1);
    };

    Object.keys(baseRegistry).forEach(track);
    providers.forEach((provider) => {
        Object.keys(provider.getSectionRegistry()).forEach(track);
    });

    return Array.from(occurrences.entries())
        .filter(([, count]) => count > 1)
        .map(([key]) => key);
}

export function buildSectionRegistry(
    baseRegistry: SectionComponentRegistry,
    providers: SectionRegistryProvider[],
): SectionComponentRegistry {
    const duplicates = collectDuplicateKeys(baseRegistry, providers);

    if (duplicates.length) {
        throw new Error(
            `Duplicate section registry keys found: ${duplicates.join(', ')}`,
        );
    }

    return providers.reduce((registry, provider) => {
        return {
            ...registry,
            ...provider.getSectionRegistry(),
        };
    }, { ...baseRegistry });
}
