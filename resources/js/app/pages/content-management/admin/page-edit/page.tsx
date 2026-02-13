import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import {
  PageForm,
  type PageFormData,
} from '@/modules/content-management/features/page-management/page/PageForm';
import {
  useCreateSection,
  useDeleteSection,
  useToggleSectionActive,
  useUpdateSection,
} from '@/modules/content-management/features/page-management/section/hooks';
import { collectSectionNavigationGroups } from '@/modules/content-management/features/page-management/section/navigation';
import {
  CreateSectionDialog,
  type CreateSectionPayload,
  EditSectionDialog,
  type EditSectionPayload,
  SectionList,
  useCreateSectionDialogController,
  useEditSectionDialogController,
  useSectionListController,
} from '@/modules/content-management/features/page-management/section/operations';
import type {
  PageEditViewModelProps,
  PageSectionDto,
} from '@/modules/content-management/types';
import { defaultStringNormalizer } from '@/modules/content-management/utils/strings';
import type { FormDataValues } from '@inertiajs/core';
import { Head, router, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import React from 'react';

/**
 * Administrative screen for editing a content-managed page.
 *
 * Responsibilities:
 * - Manage the page metadata form and persist changes via Inertia.
 * - Wire section CRUD dialogs (create/edit) and per-row actions (toggle/delete).
 * - Render the sections list using the listing controller hook for reorder orchestration.
 */
export default function PageEdit({
  page,
  sections,
  availableTemplates,
}: PageEditViewModelProps) {
  const { data, setData, put, processing, errors } = useForm<PageFormData>({
    slug: page.slug,
    internal_name: page.internal_name,
    title: page.title,
    meta_title: page.meta_title ?? '',
    meta_description: page.meta_description ?? '',
    layout_key: page.layout_key ?? '',
    locale: page.locale,
    is_published: page.is_published,
    is_indexable: page.is_indexable,
  });

  const createDialog = useCreateSectionDialogController();
  const editDialog = useEditSectionDialogController();

  const navigationGroups = React.useMemo(() => {
    return collectSectionNavigationGroups(sections, defaultStringNormalizer);
  }, [sections]);

  const createSection = useCreateSection(page.id);
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();
  const toggleSectionActive = useToggleSectionActive();

  const sectionsList = useSectionListController({
    pageId: page.id,
    sections,
  });

  const handleChange = <K extends keyof PageFormData>(
    field: K,
    value: PageFormData[K],
  ): void => {
    setData(field, value as FormDataValues<PageFormData, K>);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    put(route('admin.content.pages.update', page.id));
  };

  const handleDeletePage = (): void => {
    if (
      !window.confirm(
        'Are you sure you want to delete this page and all its sections?',
      )
    ) {
      return;
    }

    router.delete(route('admin.content.pages.destroy', page.id));
  };

  /** Sections: create */
  const handleCreateSection = (): void => {
    createDialog.openDialog();
  };

  const handleCreateSectionSubmit = (payload: CreateSectionPayload): void => {
    createSection(payload);
  };

  /** Sections: edit */
  const handleEditSection = (section: PageSectionDto): void => {
    editDialog.openFor(section);
  };

  const handleEditSectionSubmit = (payload: EditSectionPayload): void => {
    if (!editDialog.section) {
      return;
    }

    updateSection(editDialog.section.id, payload);
  };

  /** Sections: toggle active */
  const handleToggleSectionActive = (section: PageSectionDto): void => {
    toggleSectionActive(section.id, !section.is_active);
  };

  /** Sections: delete */
  const handleRemoveSection = (section: PageSectionDto): void => {
    if (!window.confirm('Are you sure you want to delete this section?')) {
      return;
    }

    deleteSection(section.id);
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Edit content page
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Update this page metadata and manage its sections.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="text-destructive gap-2"
            onClick={handleDeletePage}
          >
            <Trash2 className="h-4 w-4" />
            Delete page
          </Button>
        </div>
      }
    >
      <Head title={`Edit page – ${page.title}`} />

      <div className="mx-auto flex max-w-5xl flex-col gap-6 pb-10">
        <PageForm
          mode="edit"
          page={page}
          data={data}
          errors={errors}
          processing={processing}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        <SectionList
          sections={sectionsList.sections}
          templates={availableTemplates}
          reorderLocked={sectionsList.reorderLocked}
          sensors={sectionsList.sensors}
          onDragEnd={sectionsList.onDragEnd}
          onCreateSection={handleCreateSection}
          onEditSection={handleEditSection}
          onToggleActive={handleToggleSectionActive}
          onRemoveSection={handleRemoveSection}
          onReorder={sectionsList.onReorder}
        />
      </div>

      <CreateSectionDialog
        open={createDialog.open}
        onOpenChange={createDialog.setOpen}
        templates={availableTemplates}
        defaultLocale={page.locale}
        navigationGroups={navigationGroups}
        onSubmit={handleCreateSectionSubmit}
      />

      <EditSectionDialog
        open={editDialog.open}
        onOpenChange={editDialog.onOpenChange}
        section={editDialog.section}
        templates={availableTemplates}
        navigationGroups={navigationGroups}
        allowTemplateChange
        onSubmit={handleEditSectionSubmit}
      />
    </AuthenticatedLayout>
  );
}
