import { Link } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';

/**
 * CoursesHeader renders the page header, description, and the action button to create a new course.
 */
export function CoursesHeader() {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-muted-foreground mt-1 text-sm">
                    Manage the courses displayed on your portfolio.
                </p>
            </div>

            <Link
                href={route('courses.create')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                New course
            </Link>
        </div>
    );
}
