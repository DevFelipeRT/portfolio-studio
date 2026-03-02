import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { useFormSubmit, type FormErrors } from '@/common/forms';
import type { CourseFormData } from '@/modules/courses/core/forms';
import { CoursesI18nProvider } from '@/modules/courses/i18n';
import { CourseForm } from '@/modules/courses/ui/form/course';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
const defaultCourseFormData: CourseFormData = {
  locale: '',
  name: '',
  institution: '',
  category: '',
  summary: '',
  description: '',
  started_at: null,
  completed_at: null,
  display: false,
};

export default function Create({ course_categories }: CreateCourseProps) {
  const { data, setData, post, processing } = useForm<CourseFormData>(
    'courses.create',
    defaultCourseFormData,
  );
  const submitForm = useFormSubmit();
  const { errors: formErrors } = usePage().props as {
    errors: FormErrors<keyof CourseFormData>;
  };

  /**
   * Submits the new course data to the backend.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    submitForm(event, post, route('courses.store'));
  };

  /**
   * Navigates back to the course index page.
   */
  const cancelHref = route('courses.index');

  return (
    <AuthenticatedLayout
      header={
        <h1 className="text-xl leading-tight font-semibold">New Course</h1>
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

          <CoursesI18nProvider>
            <CourseForm
              data={data}
              errors={formErrors}
              processing={processing}
              categories={course_categories ?? {}}
              onChange={setData}
              onSubmit={handleSubmit}
              cancelHref={cancelHref}
            />
          </CoursesI18nProvider>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
