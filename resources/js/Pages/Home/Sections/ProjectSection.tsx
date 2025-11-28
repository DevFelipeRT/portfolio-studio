// resources/js/Pages/Home/Sections/ProjectSection.tsx
import { Project } from '@/Pages/types';
import { useTranslation } from '@/i18n';
import { ProjectCarousel } from '../Partials/ProjectCarousel';
import { SectionHeader } from '../Partials/SectionHeader';

export interface ProjectProps {
    projects?: Project[];
}

/**
 * ProjectSection renders a landing section with a project card slider.
 */
export function ProjectSection({ projects }: ProjectProps) {
    const { translate } = useTranslation('home');

    const hasProjects = !!projects && projects.length > 0;

    const sectionLabel = translate(
        'projects.sectionLabel',
        'Highlighted portfolio projects',
    );

    const eyebrow = translate('projects.header.eyebrow', 'Projects');
    const title = translate(
        'projects.header.title',
        'Selected projects with technical focus.',
    );
    const description = translate(
        'projects.header.description',
        'These projects illustrate how I approach architecture, domain modeling and user-facing implementation.',
    );

    return (
        <section
            id="projects"
            className="flex flex-col gap-8 border-t pt-12 md:pt-16"
            aria-label={sectionLabel}
        >
            {hasProjects ? (
                <>
                    <SectionHeader
                        eyebrow={eyebrow}
                        title={title}
                        description={description}
                        align="left"
                    />
                    <ProjectCarousel projects={projects} />
                </>
            ) : null}
        </section>
    );
}
