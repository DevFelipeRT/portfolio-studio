import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { Project } from '@/modules/projects/core/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { ProjectCard } from './ProjectCard';

interface ProjectCarouselProps {
    projects: Project[];
}

/**
 * ProjectCarousel renders a horizontal slider of project cards using shadcn ScrollArea.
 */
export function ProjectCarousel({ projects }: ProjectCarouselProps) {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    if (!projects.length) {
        return null;
    }

    function scrollToIndex(index: number): void {
        const viewport = viewportRef.current;
        if (!viewport) {
            return;
        }

        const slide = viewport.querySelector<HTMLDivElement>(
            `[data-slide-index="${index}"]`,
        );
        if (!slide) {
            return;
        }

        slide.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
        });
    }

    function handlePrevious(): void {
        setActiveIndex((current) => {
            const nextIndex = current === 0 ? 0 : current - 1;
            scrollToIndex(nextIndex);
            return nextIndex;
        });
    }

    function handleNext(): void {
        setActiveIndex((current) => {
            const lastIndex = projects.length - 1;
            const nextIndex = current === lastIndex ? lastIndex : current + 1;
            scrollToIndex(nextIndex);
            return nextIndex;
        });
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <p className="text-muted-foreground text-xs">
                    {activeIndex + 1} of {projects.length}
                </p>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={activeIndex === 0}
                        onClick={handlePrevious}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={activeIndex === projects.length - 1}
                        onClick={handleNext}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <ScrollArea className="w-full">
                <div ref={viewportRef} className="flex w-max gap-4">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            data-slide-index={index}
                            className="snap-center"
                        >
                            <div className="w-[80vw] max-w-md sm:w-[60vw] md:w-[420px] lg:w-[460px]">
                                <ProjectCard {...project} />
                            </div>
                        </div>
                    ))}
                </div>

                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
