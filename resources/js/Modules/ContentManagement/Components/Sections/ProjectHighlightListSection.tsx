import { SectionHeader } from '@/Layouts/Partials/SectionHeader';
import type { SectionComponentProps } from '@/Modules/ContentManagement/config/sectionComponents';
import { useSectionFieldResolver } from '@/Modules/ContentManagement/context/SectionFieldResolverContext';
import type { SectionDataValue } from '@/Modules/ContentManagement/types';
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
    skills?: unknown;
};

/**
 * Renders a project highlight list section for a content-managed page.
 *
 * Primary source for all content is the section field resolver.
 */
export function ProjectHighlightListSection({
    section,
    className,
}: SectionComponentProps): JSX.Element | null {
    const fieldResolver = useSectionFieldResolver();

    const targetId = section.anchor || `projects-${section.id}`;

    const highlightOnly =
        fieldResolver.getValue<boolean>('highlight_only') ??
        fieldResolver.getValue<boolean>('highlightOnly') ??
        undefined;

    const eyebrow = (() => {
        const fromData = fieldResolver.getValue<string>('eyebrow');

        if (fromData) {
            return fromData;
        }

        if (highlightOnly === true) {
            return 'Projetos em destaque';
        }

        return undefined;
    })();

    const title = fieldResolver.getValue<string>('title') ?? '';

    const description =
        fieldResolver.getValue<string>('subtitle') ??
        fieldResolver.getValue<string>('description') ??
        undefined;

    const maxItems =
        fieldResolver.getValue<number>('max_items') ??
        fieldResolver.getValue<number>('maxItems') ??
        undefined;

    const rawProjects = fieldResolver.getValue<SectionDataValue>('projects');

    const projectsArray = Array.isArray(rawProjects) ? rawProjects : [];

    const allProjects: CapabilityProject[] = projectsArray
        .filter(
            (item) =>
                item !== null &&
                typeof item === 'object' &&
                !Array.isArray(item),
        )
        .map((item) => item as CapabilityProject);

    const limitedProjects: Project[] =
        typeof maxItems === 'number' && maxItems > 0
            ? (allProjects.slice(0, maxItems) as unknown as Project[])
            : (allProjects as unknown as Project[]);

    const hasProjects = limitedProjects.length > 0;

    if (!title && !description && !hasProjects) {
        return null;
    }

    const ariaLabel = title || description || undefined;

    const baseSectionClassName = 'flex flex-col gap-8';

    const resolvedSectionClasses = [baseSectionClassName, className]
        .filter(Boolean)
        .join(' ')
        .trim();

    return (
        <section
            id={targetId}
            className={resolvedSectionClasses}
            aria-label={ariaLabel}
        >
            <SectionHeader
                eyebrow={eyebrow}
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
