import {
    SectionHeader,
    useFieldValueResolver,
} from '@/modules/content-management/features/page-rendering';
import type { SectionDataValue } from '@/modules/content-management/types';
import { ProjectCarousel } from '@/modules/projects/ui/ProjectCarousel';
import type { Project } from '@/modules/projects/core/types';
import {
    PROJECTS_NAMESPACES,
    useProjectsTranslation,
} from '@/modules/projects/i18n';
import { JSX } from 'react';

type CapabilityProject = {
    id: number;
    name: string;
    summary?: string | null;
    description?: string | null;
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
export function ProjectHighlightListSection(): JSX.Element | null {
    const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
    const { translate: tSections } = useProjectsTranslation(
        PROJECTS_NAMESPACES.sections,
    );
    const fieldResolver = useFieldValueResolver();

    const highlightOnly =
        fieldResolver.getFieldValue<boolean>('highlight_only') ??
        fieldResolver.getFieldValue<boolean>('highlightOnly') ??
        undefined;

    const eyebrow = (() => {
        const fromData = fieldResolver.getFieldValue<string>('eyebrow');

        if (fromData) {
            return fromData;
        }

        if (highlightOnly === true) {
            return tSections('public.highlightEyebrow');
        }

        return undefined;
    })();

    const title = fieldResolver.getFieldValue<string>('title') ?? '';

    const description =
        fieldResolver.getFieldValue<string>('subtitle') ??
        fieldResolver.getFieldValue<string>('description') ??
        undefined;

    const maxItems =
        fieldResolver.getFieldValue<number>('max_items') ??
        fieldResolver.getFieldValue<number>('maxItems') ??
        undefined;

    const rawProjects = fieldResolver.getFieldValue<SectionDataValue>('projects');

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

    return (
        <div className="flex flex-col gap-8" aria-label={ariaLabel}>
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
                    {tForm('emptyState.publicSection')}
                </p>
            )}
        </div>
    );
}
