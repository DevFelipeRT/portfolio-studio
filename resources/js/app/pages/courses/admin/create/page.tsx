import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { useFormSubmit, type FormErrors } from '@/common/forms';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import type { CourseFormData } from '@/modules/courses/core/forms';
import { CourseForm } from '@/modules/courses/ui/form/course';
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
  const { data, setData, post, processing } = usePageForm<CourseFormData>(
    'courses.create',
    defaultCourseFormData,
  );
  const submitForm = useFormSubmit();
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof CourseFormData>;
  }>();

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
    <AuthenticatedLayout>
      <PageHead title="New Course" />

      <PageContent className="overflow-hidden py-8" pageWidth="default">
        <div className="mb-6">
          <h1 className="text-xl leading-tight font-semibold">New Course</h1>
        </div>

        <div className="mb-4">
          <PageLink
            href={route('courses.index')}
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to courses
          </PageLink>
        </div>

        <CourseForm
          data={data}
          errors={formErrors}
          processing={processing}
          categories={course_categories ?? {}}
          onChange={setData}
          onSubmit={handleSubmit}
          cancelHref={cancelHref}
        />
      </PageContent>
    </AuthenticatedLayout>
  );
}

Create.i18n = ['courses'];
