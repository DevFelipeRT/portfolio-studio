import type { Course } from '@/modules/courses/core/types';

import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, CheckCircle2, CircleDashed } from 'lucide-react';
import { JSX } from 'react';

interface CourseOverlayProps {
    open: boolean;
    course: Course | null;
    onOpenChange: (open: boolean) => void;
}

/**
 * CourseOverlay displays the full details of a course entry in a modal dialog.
 */
export function CourseOverlay({
    open,
    course,
    onOpenChange,
}: CourseOverlayProps) {
    if (!course) {
        return null;
    }

    // Alias 'course' to 'details' to ensure TypeScript narrowing persists
    // correctly inside closures (like renderStatus) and JSX.
    const details = course;

    /**
     * Renders the status badge based on the course dates.
     */
    function renderStatus(): JSX.Element {
        if (!details.completed_at) {
            return (
                <Badge
                    variant="secondary"
                    className="gap-1 border-transparent bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300"
                >
                    <CircleDashed className="h-3 w-3" />
                    In Progress
                </Badge>
            );
        }

        const endDate = new Date(details.completed_at);
        const today = new Date();

        if (endDate < today) {
            return (
                <Badge
                    variant="secondary"
                    className="gap-1 border-transparent bg-green-100 text-green-700 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-300"
                >
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                </Badge>
            );
        }

        return (
            <Badge
                variant="secondary"
                className="gap-1 border-transparent bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300"
            >
                <CircleDashed className="h-3 w-3" />
                In Progress
            </Badge>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex flex-wrap items-center gap-2 text-base leading-none">
                        <span className="font-semibold">{details.name}</span>
                        <Badge
                            variant="outline"
                            className="text-xs font-normal"
                        >
                            {details.institution}
                        </Badge>
                    </DialogTitle>

                    {/*
                        Use asChild to render a div instead of the default p tag,
                        preventing "div cannot appear as a descendant of p" warnings.
                    */}
                    <DialogDescription
                        className="text-muted-foreground mt-2 space-y-2 text-xs"
                        asChild
                    >
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                {renderStatus()}

                                <div className="bg-muted flex items-center gap-1.5 rounded-md px-2 py-0.5">
                                    <CalendarDays className="h-3.5 w-3.5 opacity-70" />
                                    <span>
                                        {details.started_at}
                                        {details.completed_at
                                            ? ` – ${details.completed_at}`
                                            : ' – Present'}
                                    </span>
                                </div>

                                <Badge
                                    variant={
                                        details.display ? 'default' : 'outline'
                                    }
                                >
                                    {details.display ? 'Public' : 'Hidden'}
                                </Badge>
                            </div>

                            {details.summary && (
                                <p className="text-foreground/80 mt-2 font-medium text-balance">
                                    {details.summary}
                                </p>
                            )}
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <Separator className="my-2" />

                <div className="max-h-[60vh] overflow-y-auto text-sm leading-relaxed">
                    <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                        About the course
                    </p>

                    <div className="text-foreground whitespace-pre-line">
                        {details.description || (
                            <span className="text-muted-foreground italic">
                                No detailed description provided.
                            </span>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
