import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageLink } from '@/common/page-runtime';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

interface CourseRowActionsProps {
    courseId: number;
}

export function CoursesRowActions({ courseId }: CourseRowActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:bg-primary hover:text-primary-foreground h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="min-w-40"
                onClick={(e) => e.stopPropagation()}
            >
                <DropdownMenuItem asChild>
                    <PageLink
                        href={route('courses.edit', courseId)}
                        className="cursor-pointer"
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit course</span>
                    </PageLink>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <PageLink
                        href={route('courses.destroy', courseId)}
                        method="delete"
                        as="button"
                        className="text-destructive focus:text-destructive w-full cursor-pointer"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete course</span>
                    </PageLink>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
