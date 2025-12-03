import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { CourseOverlay } from '@/Pages/Courses/Partials/CourseOverlay';
import { CoursesEmptyState } from '@/Pages/Courses/Partials/CoursesEmptyState';
import { CoursesHeader } from '@/Pages/Courses/Partials/CoursesHeader';
import { CoursesTable } from '@/Pages/Courses/Partials/CoursesTable';
import { Head } from '@inertiajs/react';
import React from 'react';
import { Course } from '../types';

interface CoursesIndexProps {
    courses: {
        data: Course[];
    };
}

export default function Index({ courses }: CoursesIndexProps) {
    const items = courses.data ?? [];
    const hasCourses = items.length > 0;

    // State for the overlay
    const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(
        null,
    );
    const [isOverlayOpen, setIsOverlayOpen] = React.useState(false);

    /**
     * Opens the course details overlay.
     */
    const handleRowClick = (course: Course) => {
        setSelectedCourse(course);
        setIsOverlayOpen(true);
    };

    /**
     * Closes the course details overlay.
     */
    const handleOverlayOpenChange = (open: boolean) => {
        setIsOverlayOpen(open);
        if (!open) {
            // Short delay to allow animation to finish before clearing data
            setTimeout(() => setSelectedCourse(null), 200);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl leading-tight font-semibold">
                    Course management
                </h1>
            }
        >
            <Head title="Courses" />

            <div className="overflow-hidden">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <CoursesHeader />

                    {!hasCourses && <CoursesEmptyState />}

                    {hasCourses && (
                        <CoursesTable
                            items={items}
                            onRowClick={handleRowClick}
                        />
                    )}
                </div>
            </div>

            <CourseOverlay
                open={isOverlayOpen}
                course={selectedCourse}
                onOpenChange={handleOverlayOpenChange}
            />
        </AuthenticatedLayout>
    );
}
