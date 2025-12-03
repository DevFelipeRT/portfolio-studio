import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CourseForm, {
    CourseEntryData,
} from '@/Pages/Courses/Partials/CourseForm';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { Course } from '../types';

/**
 * Defines the props received from the backend controller.
 */
interface EditCourseProps {
    course: Course;
    course_categories: Record<string, string>;
}

/**
 * Page component for editing an existing course entry.
 * Initializes the form state with the provided course data.
 */
export default function Edit({ course, course_categories }: EditCourseProps) {
    const { data, setData, put, processing, errors } = useForm<CourseEntryData>(
        {
            name: course.name,
            institution: course.institution,
            category: course.category,
            summary: course.summary,
            description: course.description,
            started_at: course.started_at,
            completed_at: course.completed_at ?? '',
            display: Boolean(course.display),
        },
    );

    /**
     * Submits the updated course data to the backend.
     */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        put(route('courses.update', course.id));
    };

    /**
     * Navigates back to the course index page.
     */
    const handleCancel = (): void => {
        router.visit(route('courses.index'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl leading-tight font-semibold">
                    Edit Course:{` ${data.name}`}
                </h1>
            }
        >
            <Head title={`Edit - ${data.name}`} />

            <div className="overflow-hidden">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('courses.index')}
                            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition-colors"
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Back to courses
                        </Link>
                    </div>

                    <CourseForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        categories={course_categories ?? {}}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
