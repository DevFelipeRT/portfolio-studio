import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import type { FormErrors } from '@/common/forms';
import { LocaleSwapDialog } from '@/common/LocaleSwapDialog';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import { Button } from '@/components/ui/button';
import { listCourseTranslations } from '@/modules/courses/core/api/translations';
import type { CourseFormData } from '@/modules/courses/core/forms';
import type { Course } from '@/modules/courses/core/types';
import {
  COURSES_NAMESPACES,
  useCoursesTranslation,
} from '@/modules/courses/i18n';
import { CourseForm } from '@/modules/courses/ui/form/course';
import { TranslationModal } from '@/modules/courses/ui/translation-modal/TranslationModal';
import { ChevronLeft } from 'lucide-react';
import React from 'react';

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
  const { data, setData, put, processing } = usePageForm<CourseFormData>({
    locale: course.locale,
    confirm_swap: false,
    name: course.name,
    institution: course.institution,
    category: course.category,
    summary: course.summary,
    description: course.description,
    started_at: course.started_at,
    completed_at: course.completed_at ?? null,
    display: Boolean(course.display),
  });
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof CourseFormData>;
  }>();

  /**
   * Submits the updated course data to the backend.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    put(route('courses.update', course.id), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  /**
   * Navigates back to the course index page.
   */
  const cancelHref = route('courses.index');

  const [translationOpen, setTranslationOpen] = React.useState(false);
  const [swapDialogOpen, setSwapDialogOpen] = React.useState(false);
  const [pendingLocale, setPendingLocale] = React.useState<string | null>(null);
  const [translationLocales, setTranslationLocales] = React.useState<string[]>(
    [],
  );
  const [loadingTranslations, setLoadingTranslations] = React.useState(false);
  const [localesLoadError, setLocalesLoadError] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    let mounted = true;

    const loadTranslations = async (): Promise<void> => {
      setLoadingTranslations(true);
      setLocalesLoadError(null);
      try {
        const items = await listCourseTranslations(course.id);
        if (mounted) {
          setTranslationLocales(
            items.map((item) => item.locale).filter(Boolean),
          );
        }
      } catch {
        if (mounted) {
          setLocalesLoadError(
            'Unable to load translations for locale conflict checks.',
          );
        }
      } finally {
        if (mounted) {
          setLoadingTranslations(false);
        }
      }
    };

    void loadTranslations();

    return () => {
      mounted = false;
    };
  }, [course.id]);

  const handleLocaleChange = (nextLocale: string): void => {
    if (nextLocale !== data.locale && translationLocales.includes(nextLocale)) {
      setPendingLocale(nextLocale);
      setSwapDialogOpen(true);
      return;
    }

    setData('confirm_swap', false);
    setData('locale', nextLocale);
  };

  return (
    <AuthenticatedLayout>
      <PageHead title={`Edit - ${data.name}`} />

      <EditCourseI18nContent
        data={data}
        formErrors={formErrors}
        processing={processing}
        categories={course_categories ?? {}}
        cancelHref={cancelHref}
        loadingTranslations={loadingTranslations}
        localesLoadError={localesLoadError}
        onChange={setData}
        onSubmit={handleSubmit}
        onLocaleChange={handleLocaleChange}
        onOpenTranslations={() => setTranslationOpen(true)}
      />

      <TranslationModal
        open={translationOpen}
        onClose={() => setTranslationOpen(false)}
        courseId={course.id}
        courseLabel={course.name}
        baseLocale={data.locale}
      />

      {pendingLocale && (
        <LocaleSwapDialog
          open={swapDialogOpen}
          currentLocale={data.locale}
          nextLocale={pendingLocale}
          onConfirmSwap={() => {
            setData('confirm_swap', true);
            setData('locale', pendingLocale);
            setSwapDialogOpen(false);
            setPendingLocale(null);
          }}
          onConfirmNoSwap={() => {
            setData('confirm_swap', false);
            setData('locale', pendingLocale);
            setSwapDialogOpen(false);
            setPendingLocale(null);
          }}
          onCancel={() => {
            setSwapDialogOpen(false);
            setPendingLocale(null);
          }}
        />
      )}
    </AuthenticatedLayout>
  );
}

Edit.i18n = ['courses'];

type EditCourseI18nContentProps = {
  data: CourseFormData;
  formErrors: FormErrors<keyof CourseFormData>;
  processing: boolean;
  categories: Record<string, string>;
  cancelHref: string;
  loadingTranslations: boolean;
  localesLoadError: string | null;
  onChange: (key: keyof CourseFormData, value: string | boolean | null) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onLocaleChange: (locale: string) => void;
  onOpenTranslations: () => void;
};

function EditCourseI18nContent({
  data,
  formErrors,
  processing,
  categories,
  cancelHref,
  loadingTranslations,
  localesLoadError,
  onChange,
  onSubmit,
  onLocaleChange,
  onOpenTranslations,
}: EditCourseI18nContentProps) {
  const { translate: tTranslations } = useCoursesTranslation(
    COURSES_NAMESPACES.translations,
  );

  return (
    <PageContent className="overflow-hidden py-8" pageWidth="default">
      <div className="mb-6">
        <h1 className="text-xl leading-tight font-semibold">
          Edit Course:{` ${data.name}`}
        </h1>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <PageLink
          href={route('courses.index')}
          className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to courses
        </PageLink>

        <Button type="button" variant="secondary" onClick={onOpenTranslations}>
          {tTranslations('manage')}
        </Button>
      </div>

      <CourseForm
        data={data}
        errors={formErrors}
        processing={processing}
        categories={categories}
        onChange={onChange}
        onSubmit={onSubmit}
        cancelHref={cancelHref}
        onLocaleChange={onLocaleChange}
        localeDisabled={loadingTranslations || Boolean(localesLoadError)}
      />
    </PageContent>
  );
}
