// Home/Partials/ProjectSection.tsx
import { Project } from '@/Pages/types';
import { ProjectCarousel } from '../Partials/ProjectCarousel';
import { SectionHeader } from '../Partials/SectionHeader';

export interface ProjectProps {
    projects?: Project[];
}

/**
 * ProjectSection renders a landing section with a project card slider.
 */
export function ProjectSection({ projects }: ProjectProps) {
    return (
        <section
            id="projects"
            className="flex flex-col gap-8 border-t pt-12 md:pt-16"
        >
            {projects && projects.length > 0 ? (
                <>
                    <SectionHeader
                        eyebrow="Projects"
                        title="Selected projects with technical focus."
                        description="These projects illustrate how I approach architecture, domain modeling and user-facing implementation."
                        align="left"
                    />
                    <ProjectCarousel projects={projects} />
                </>
            ) : null}
        </section>
    );
}
