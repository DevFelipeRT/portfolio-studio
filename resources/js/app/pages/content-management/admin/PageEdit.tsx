import { Head, router, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { Button } from '@/Components/Ui/button';
import {
  CreateSectionDialog,
  type CreateSectionPayload,
  useCreateSectionDialogController,
} from '@/Modules/ContentManagement/features/page-management/section/dialogs/create';
import {
  EditSectionDialog,
  type EditSectionPayload,
  useEditSectionDialogController,
} from '@/Modules/ContentManagement/features/page-management/section/dialogs/edit';
import { SectionsList } from '@/Modules/ContentManagement/features/page-management/section/listing/SectionsList';
import {
  useCreateSection,
  useDeleteSection,
  useToggleSectionActive,
  useUpdateSection,
} from '@/Modules/ContentManagement/features/page-management/section/hooks';
import {
  orderedFromIds,
  swappedIds,
  useReorderSections,
} from '@/Modules/ContentManagement/features/page-management/section/reordering';
import {
  PageForm,
  type PageFormData,
} from '@/Modules/ContentManagement/features/page-management/page/PageForm';
import {
  collectSectionNavigationGroups,
  sortSectionsByPosition,
  validateHeroFirstOrder,
} from '@/Modules/ContentManagement/features/page-rendering';
import { defaultStringNormalizer } from '@/Modules/ContentManagement/shared/strings';
import type {
  PageEditViewModelProps,
  PageSectionDto,
} from '@/Modules/ContentManagement/types';

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

  const sortedSections = React.useMemo(
    () => sortSectionsByPosition(sections),
    [sections],
  );
  const navigationGroups = React.useMemo(() => {
    return collectSectionNavigationGroups(sections, defaultStringNormalizer);
  }, [sections]);

  const createSection = useCreateSection(page.id);
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();
  const toggleSectionActive = useToggleSectionActive();
  const reorderSections = useReorderSections();

  const validateSectionsOrder = (
    orderedSections: PageSectionDto[],
  ): boolean => {
    const result = validateHeroFirstOrder(orderedSections);

    if (!result.ok) {
      toast.error(result.message);
      return false;
    }

    return true;
  };

  const handleChange = (field: keyof PageFormData, value: unknown): void => {
    setData(field, value as never);
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

  /**
   * Sections: create
   */
  const handleCreateSection = (): void => {
    createDialog.openDialog();
  };

  const handleCreateSectionSubmit = (payload: CreateSectionPayload): void => {
    createSection(payload);
  };

  /**
   * Sections: edit
   */
  const handleEditSection = (section: PageSectionDto): void => {
    editDialog.openFor(section);
  };

  const handleEditSectionSubmit = (payload: EditSectionPayload): void => {
    if (!editDialog.section) {
      return;
    }

    updateSection(editDialog.section.id, payload);
  };

  /**
   * Sections: toggle active
   */
  const handleToggleSectionActive = (section: PageSectionDto): void => {
    toggleSectionActive(section.id, !section.is_active);
  };

  /**
   * Sections: delete
   */
  const handleRemoveSection = (section: PageSectionDto): void => {
    if (!window.confirm('Are you sure you want to delete this section?')) {
      return;
    }

    deleteSection(section.id);
  };

  /**
   * Sections: reorder
   */
  const handleReorderSections = (
    orderedIds: Array<PageSectionDto['id']>,
  ): void => {
    const orderedSections = orderedFromIds(sortedSections, orderedIds);

    if (!validateSectionsOrder(orderedSections)) {
      return;
    }

    reorderSections(page.id, orderedIds);
  };

  const handleReorderSection = (
    section: PageSectionDto,
    direction: 'up' | 'down',
  ): void => {
    const nextIds = swappedIds(sortedSections, section.id, direction);
    handleReorderSections(nextIds);
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

        <SectionsList
          sections={sortedSections}
          templates={availableTemplates}
          onCreateSection={handleCreateSection}
          onEditSection={handleEditSection}
          onToggleActive={handleToggleSectionActive}
          onRemoveSection={handleRemoveSection}
          onReorder={handleReorderSection}
          onReorderIds={handleReorderSections}
          onValidateReorder={validateSectionsOrder}
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
