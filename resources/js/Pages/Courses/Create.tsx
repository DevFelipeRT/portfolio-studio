import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CourseForm, {
    CourseEntryData,
} from '@/Pages/Courses/Partials/CourseForm';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import React from 'react';

/**
 * Defines the props received from the backend controller.
 */
interface CreateCourseProps {
    course_categories: Record<string, string>;
}

/**
 * Page component for registering a new course entry in the portfolio.
 */
export default function Create({ course_categories }: CreateCourseProps) {
    const { data, setData, post, processing, errors } =
        useForm<CourseEntryData>({
            name: '',
            institution: '',
            category: '',
            summary: '',
            description: '',
            started_at: '',
            completed_at: '',
            display: false,
        });

    /**
     * Submits the new course data to the backend.
     */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        post(route('courses.store'));
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
                    New Course
                </h1>
            }
        >
            <Head title="New Course" />

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
