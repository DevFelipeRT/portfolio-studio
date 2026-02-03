import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CourseForm from '@/Modules/Courses/ui/CourseForm';
import { TranslationModal } from '@/Modules/Courses/ui/TranslationModal';
import type { CourseFormData } from '@/Modules/Courses/core/forms';
import { Button } from '@/Components/Ui/button';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import type { Course } from '@/Modules/Courses/core/types';
import { useTranslation } from '@/Common/i18n';

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
    const { translate: t } = useTranslation('courses');
    const { data, setData, put, processing, errors } =
        useForm<CourseFormData>(
        {
            name: course.name,
            institution: course.institution,
            category: course.category,
            summary: course.summary,
            description: course.description,
            started_at: course.started_at,
            completed_at: course.completed_at ?? null,
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

    const [translationOpen, setTranslationOpen] = React.useState(false);

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
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <Link
                            href={route('courses.index')}
                            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition-colors"
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Back to courses
                        </Link>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setTranslationOpen(true)}
                        >
                            {t('translations.manage')}
                        </Button>
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

            <TranslationModal
                open={translationOpen}
                onClose={() => setTranslationOpen(false)}
                courseId={course.id}
                courseLabel={course.name}
            />
        </AuthenticatedLayout>
    );
}
