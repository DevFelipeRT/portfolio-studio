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
import { ChevronDown, ExternalLink, Github } from 'lucide-react';
import { useState } from 'react';
import type { Project } from '@/modules/projects/core/types';
import { ProjectImageCarousel } from './ProjectImageCarousel';
import { RichTextRenderer } from '@/common/rich-text/RichTextRenderer';

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
}: Project) {
    const hasImages = Array.isArray(images) && images.length > 0;
    const hasTech = Array.isArray(skills) && skills.length > 0;
    const hasActions = Boolean(repository_url || live_url);
    const [isOpen, setIsOpen] = useState(false);

    const displayName =
        typeof name === 'string' && name.trim().length > 0
            ? name
            : 'Untitled project';

    const displayShortDescription =
        typeof summary === 'string' && summary.trim().length > 0
            ? summary
            : 'No summary available.';

    const effectiveTechStack = hasTech
        ? skills.map((skill) => skill.name)
        : ['No skills listed yet.'];

    const shouldRenderLongDescription =
        typeof description === 'string' && description.trim().length > 0;

    return (
        <Card className="flex h-full flex-col overflow-hidden">
            {hasImages && (
                <ProjectImageCarousel images={images!} title={displayName} />
            )}

            <div className="flex flex-1 flex-col">
                <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <CardTitle className="text-base font-semibold sm:text-lg">
                                {displayName}
                            </CardTitle>

                            {status && status.trim().length > 0 && (
                                <p className="text-muted-foreground text-[0.7rem] font-medium tracking-wide uppercase">
                                    {status}
                                </p>
                            )}
                        </div>
                    </div>

                    <CardDescription className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                        {displayShortDescription}
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
                                            Repository
                                        </a>
                                    </Button>
                                )}

                                {live_url && (
                                    <Button asChild size="sm" variant="outline">
                                        <a
                                            href={live_url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <ExternalLink className="mr-1.5 h-4 w-4" />
                                            Live site
                                        </a>
                                    </Button>
                                )}
                            </div>

                            <Separator />
                        </>
                    )}

                    {shouldRenderLongDescription && (
                        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                            <CollapsibleContent className="text-muted-foreground data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up mt-3 overflow-hidden text-xs leading-relaxed sm:text-sm">
                                <div className="mb-3">
                                    <RichTextRenderer value={description} />
                                </div>
                            </CollapsibleContent>

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
                                                ? 'Hide details'
                                                : 'Show details'}
                                        </span>
                                        <ChevronDown
                                            className={`text-muted-foreground hover:shadow-primary group-hover:text-primary group-hover:drop-shadow-primary h-4 w-4 transition-transform group-hover:drop-shadow-sm ${
                                                isOpen ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                        </Collapsible>
                    )}
                </CardFooter>
            </div>
        </Card>
    );
}
