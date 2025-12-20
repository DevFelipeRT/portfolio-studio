import { SectionHeader } from '@/Layouts/Partials/SectionHeader';
import type { SectionComponentProps } from '@/Modules/ContentManagement/config/sectionComponents';
import type { SectionData } from '@/Modules/ContentManagement/types';
import { ProjectCarousel } from '@/Pages/Home/Partials/ProjectCarousel';
import type { Project } from '@/Pages/types';
import { JSX } from 'react';

type CapabilityProject = {
    id: number;
    name: string;
    short_description?: string | null;
    long_description?: string | null;
    repository_url?: string | null;
    live_url?: string | null;
    images?: unknown;
    technologies?: unknown;
};

/**
 * Renders a project highlight list section for a content-managed page.
 *
 * Primary source for all content is the section data, with template
 * metadata used as a fallback when applicable.
 */
export function ProjectHighlightListSection({
    section,
    template,
}: SectionComponentProps): JSX.Element | null {
    const data = (section.data ?? {}) as SectionData;

    const getString = (key: string): string | undefined => {
        const value = data[key];

        if (typeof value === 'string') {
            return value;
        }

        return undefined;
    };

    const getNumber = (key: string): number | undefined => {
        const value = data[key];

        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }

        return undefined;
    };

    const getBoolean = (key: string): boolean | undefined => {
        const value = data[key];

        if (typeof value === 'boolean') {
            return value;
        }

        return undefined;
    };

    const highlightOnly =
        getBoolean('highlight_only') ??
        getBoolean('highlightOnly') ??
        undefined;

    const eyebrow = (): string | undefined => {
        const fromData = getString('eyebrow');

        if (fromData) {
            return fromData;
        }

        if (highlightOnly === true) {
            return 'Projetos em destaque';
        }

        return undefined;
    };

    const titleFromData = getString('title');
    const titleFallbackFromTemplate = template?.label;
    const title = titleFromData ?? titleFallbackFromTemplate ?? '';

    const descriptionFromData =
        getString('subtitle') ?? getString('description');
    const descriptionFallbackFromTemplate = template?.description ?? undefined;
    const description = descriptionFromData ?? descriptionFallbackFromTemplate;

    const maxItems =
        getNumber('max_items') ?? getNumber('maxItems') ?? undefined;

    const rawProjects = data['projects'] as unknown;

    const allProjects: CapabilityProject[] = Array.isArray(rawProjects)
        ? rawProjects.filter(
              (item): item is CapabilityProject =>
                  item !== null && typeof item === 'object',
          )
        : [];

    const limitedProjects: Project[] =
        typeof maxItems === 'number' && maxItems > 0
            ? (allProjects.slice(0, maxItems) as unknown as Project[])
            : (allProjects as unknown as Project[]);

    const hasProjects = limitedProjects.length > 0;

    if (!title && !description && !hasProjects) {
        return null;
    }

    const ariaLabel =
        title ||
        description ||
        template?.label ||
        template?.description ||
        undefined;

    return (
        <section
            className="flex flex-col gap-8 border-t pt-12 md:pt-16"
            aria-label={ariaLabel}
        >
            <SectionHeader
                eyebrow={eyebrow()}
                title={title}
                description={description}
                align="left"
                level={2}
            />

            {hasProjects ? (
                <ProjectCarousel projects={limitedProjects} />
            ) : (
                <p className="text-muted-foreground text-sm">
                    Nenhum projeto retornado para esta seção.
                </p>
            )}
        </section>
    );
}
