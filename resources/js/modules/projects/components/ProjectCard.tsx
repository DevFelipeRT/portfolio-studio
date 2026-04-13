import { RichTextRenderer } from '@/common/rich-text/RichTextRenderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type { Project } from '@/modules/projects/types';
import { ChevronDown, ExternalLink, Github } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ProjectImageCarousel } from './ProjectImageCarousel';
import { useProjectStatusLabel } from './ProjectStatusBadge';

export interface ProjectCardProps {
  name: Project['name'];
  summary: Project['summary'];
  description: Project['description'];
  skills: Project['skills'];
  status: Project['status'];
  images: Project['images'];
  repository_url: Project['repository_url'];
  live_url: Project['live_url'];
  className?: string;
  collapsedMinHeight?: number;
  onCollapsedHeightChange?: (height: number) => void;
}

/**
 * ProjectCard renders a project card with image carousel, links and expandable details.
 */
export function ProjectCard({
  name,
  summary,
  description,
  skills,
  status,
  images,
  repository_url,
  live_url,
  className,
  collapsedMinHeight,
  onCollapsedHeightChange,
}: ProjectCardProps) {
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const statusLabel = useProjectStatusLabel(status);
  const collapsedContentRef = useRef<HTMLDivElement | null>(null);
  const hasImages = Array.isArray(images) && images.length > 0;
  const hasTech = Array.isArray(skills) && skills.length > 0;
  const hasActions = Boolean(repository_url || live_url);
  const [isOpen, setIsOpen] = useState(false);

  const displayName =
    typeof name === 'string' && name.trim().length > 0
      ? name
      : tForm('card.untitled');

  const displaySummary =
    typeof summary === 'string' && summary.trim().length > 0
      ? summary
      : tForm('card.noSummary');

  const effectiveTechStack = hasTech
    ? skills.map((skill) => skill.name)
    : [tForm('card.noSkills')];

  const shouldRenderLongDescription =
    typeof description === 'string' && description.trim().length > 0;

  useEffect(() => {
    const element = collapsedContentRef.current;

    if (!element || !onCollapsedHeightChange) {
      return;
    }

    const reportHeight = () => {
      onCollapsedHeightChange(
        Math.ceil(element.getBoundingClientRect().height),
      );
    };

    reportHeight();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      reportHeight();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [onCollapsedHeightChange]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card
        className={cn('flex h-full flex-col overflow-hidden', className)}
        style={
          collapsedMinHeight
            ? { minHeight: `${collapsedMinHeight}px` }
            : undefined
        }
      >
        <div ref={collapsedContentRef} className="flex flex-1 flex-col">
          {hasImages && (
            <ProjectImageCarousel images={images!} title={displayName} />
          )}

          <div className="flex flex-1 flex-col">
            <CardHeader className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-semibold sm:text-lg">
                    {displayName}
                  </CardTitle>

                  {status && (
                    <p className="text-muted-foreground text-[0.7rem] font-medium tracking-wide uppercase">
                      {statusLabel}
                    </p>
                  )}
                </div>
              </div>

              <CardDescription className="text-muted-foreground flex-1 text-xs leading-relaxed sm:text-sm">
                {displaySummary}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1.5">
                {effectiveTechStack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="rounded-full px-2.5 py-0.5 text-[0.7rem] font-normal"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="mt-auto flex flex-col gap-3 pt-4">
              {hasActions && (
                <>
                  <Separator />

                  <div className="flex flex-wrap items-center gap-2">
                    {repository_url && (
                      <Button asChild size="sm" variant="outline">
                        <a
                          href={repository_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Github className="mr-1.5 h-4 w-4" />
                          {tActions('repository')}
                        </a>
                      </Button>
                    )}

                    {live_url && (
                      <Button asChild size="sm" variant="outline">
                        <a href={live_url} target="_blank" rel="noreferrer">
                          <ExternalLink className="mr-1.5 h-4 w-4" />
                          {tActions('liveSite')}
                        </a>
                      </Button>
                    )}
                  </div>

                  <Separator />
                </>
              )}

              {shouldRenderLongDescription && (
                <div className="flex justify-center">
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="group focus-visible:text-foreground mx-auto gap-1.5 border-0 px-0 text-xs font-medium shadow-none focus-within:ring-0 hover:bg-transparent focus-visible:bg-transparent"
                    >
                      <span className="text-muted-foreground group-hover:text-foreground/80 focus:text-foreground">
                        {isOpen
                          ? tActions('hideDetails')
                          : tActions('showDetails')}
                      </span>
                      <ChevronDown
                        className={`text-muted-foreground hover:shadow-primary group-hover:text-primary group-hover:drop-shadow-primary h-4 w-4 transition-transform group-hover:drop-shadow-sm ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              )}
            </CardFooter>
          </div>
        </div>

        {shouldRenderLongDescription && (
          <CollapsibleContent className="text-muted-foreground data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden text-xs leading-relaxed sm:text-sm">
            <div className="border-border/60 mx-6 mt-3 mb-6 border-t pt-3">
              <RichTextRenderer value={description} />
            </div>
          </CollapsibleContent>
        )}
      </Card>
    </Collapsible>
  );
}
