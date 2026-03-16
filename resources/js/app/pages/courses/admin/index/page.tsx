import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead } from '@/common/page-runtime';
import type { Course } from '@/modules/courses/core/types';
import { CourseOverlay } from '@/modules/courses/ui/CourseOverlay';
import { CoursesEmptyState } from '@/modules/courses/ui/CoursesEmptyState';
import { CoursesHeader } from '@/modules/courses/ui/CoursesHeader';
import { CoursesTable } from '@/modules/courses/ui/table/CoursesTable';
import React from 'react';

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
    <AuthenticatedLayout>
      <PageHead title="Courses" />

      <PageContent className="overflow-hidden py-8" pageWidth="container">
        <CoursesHeader />

        {!hasCourses && <CoursesEmptyState />}

        {hasCourses && <CoursesTable items={items} onRowClick={handleRowClick} />}
      </PageContent>

      <CourseOverlay
        open={isOverlayOpen}
        course={selectedCourse}
        onOpenChange={handleOverlayOpenChange}
      />
    </AuthenticatedLayout>
  );
}

Index.i18n = ['courses'];
