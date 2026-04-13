import { Carousel } from '@/components/ui/carousel';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type { Project } from '@/modules/projects/types';
import { useMemo, useState } from 'react';
import { ProjectCard } from './ProjectCard';

interface ProjectCarouselProps {
  projects: Project[];
}

/**
 * ProjectCarousel renders a horizontal slider of project cards using the shared carousel primitive.
 */
export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const [collapsedHeights, setCollapsedHeights] = useState<
    Record<number, number>
  >({});

  const collapsedMinHeight = useMemo(() => {
    const heights = Object.values(collapsedHeights);

    if (!heights.length) {
      return undefined;
    }

    return Math.max(...heights);
  }, [collapsedHeights]);

  if (!projects.length) {
    return null;
  }

  function handleCollapsedHeightChange(
    projectId: number,
    height: number,
  ): void {
    setCollapsedHeights((current) => {
      if (current[projectId] === height) {
        return current;
      }

      return {
        ...current,
        [projectId]: height,
      };
    });
  }

  return (
    <Carousel
      items={projects}
      getItemKey={(project) => project.id}
      previousButtonLabel={tActions('previousProject')}
      nextButtonLabel={tActions('nextProject')}
      renderProgress={({ activeIndex, totalItems }) =>
        tForm('carousel.progress', {
          current: activeIndex + 1,
          total: totalItems,
        })
      }
      renderItem={(project) => (
        <div className="w-[80vw] max-w-md sm:w-[60vw] md:w-[420px] lg:w-[460px]">
          <ProjectCard
            name={project.name}
            summary={project.summary}
            description={project.description}
            skills={project.skills}
            status={project.status}
            images={project.images}
            repository_url={project.repository_url}
            live_url={project.live_url}
            collapsedMinHeight={collapsedMinHeight}
            onCollapsedHeightChange={(height) =>
              handleCollapsedHeightChange(project.id, height)
            }
          />
        </div>
      )}
    />
  );
}
