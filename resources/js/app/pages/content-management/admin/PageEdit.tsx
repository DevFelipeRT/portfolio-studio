import { Head, router, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { Button } from '@/Components/Ui/button';
import {
  CreateSectionDialog,
  type CreateSectionPayload,
} from '@/Modules/ContentManagement/features/content-pages/admin/edit/section-dialogs/create/CreateSectionDialog';
import {
  EditSectionDialog,
  type EditSectionPayload,
} from '@/Modules/ContentManagement/features/content-pages/admin/edit/section-dialogs/edit/EditSectionDialog';
import { SectionsList } from '@/Modules/ContentManagement/features/content-pages/admin/edit/sections/SectionsList';
import {
  PageForm,
  type PageFormData,
} from '@/Modules/ContentManagement/features/content-pages/admin/form/PageForm';
import {
  collectSectionNavigationGroups,
  sortSectionsByPosition,
  validateHeroFirstOrder,
} from '@/Modules/ContentManagement/features/sections';
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

  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] =
    React.useState<PageSectionDto | null>(null);
  const sortedSections = React.useMemo(
    () => sortSectionsByPosition(sections),
    [sections],
  );
  const navigationGroups = React.useMemo(() => {
    return collectSectionNavigationGroups(sections, defaultStringNormalizer);
  }, [sections]);

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
    setIsCreateDialogOpen(true);
  };

  const handleCreateSectionSubmit = (payload: CreateSectionPayload): void => {
    router.post(
      route('admin.content.sections.store'),
      {
        page_id: page.id,
        template_key: payload.template_key,
        slot: payload.slot,
        anchor: payload.anchor,
        navigation_label: payload.navigation_label,
        is_active: payload.is_active,
        locale: payload.locale,
        data: payload.data,
      },
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  /**
   * Sections: edit
   */
  const handleEditSection = (section: PageSectionDto): void => {
    setSelectedSection(section);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogOpenChange = (open: boolean): void => {
    setIsEditDialogOpen(open);

    if (!open) {
      setSelectedSection(null);
    }
  };

  const handleEditSectionSubmit = (payload: EditSectionPayload): void => {
    if (!selectedSection) {
      return;
    }

    router.put(
      route('admin.content.sections.update', selectedSection.id),
      {
        template_key: payload.template_key,
        slot: payload.slot,
        anchor: payload.anchor,
        navigation_label: payload.navigation_label,
        is_active: payload.is_active,
        locale: payload.locale,
        data: payload.data,
      },
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  /**
   * Sections: toggle active
   */
  const handleToggleSectionActive = (section: PageSectionDto): void => {
    router.post(
      route('admin.content.sections.toggle-active', section.id),
      {
        is_active: !section.is_active,
      },
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  /**
   * Sections: delete
   */
  const handleRemoveSection = (section: PageSectionDto): void => {
    if (!window.confirm('Are you sure you want to delete this section?')) {
      return;
    }

    router.delete(route('admin.content.sections.destroy', section.id), {
      preserveScroll: true,
      preserveState: true,
    });
  };

  /**
   * Sections: reorder
   */
  const handleReorderSections = (
    orderedIds: Array<PageSectionDto['id']>,
  ): void => {
    const orderedSections = orderedIds
      .map((id) => sortedSections.find((section) => section.id === id))
      .filter((section): section is PageSectionDto => Boolean(section));

    if (!validateSectionsOrder(orderedSections)) {
      return;
    }

    router.post(
      route('admin.content.sections.reorder'),
      {
        page_id: page.id,
        ordered_ids: orderedIds,
      },
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const handleReorderSection = (
    section: PageSectionDto,
    direction: 'up' | 'down',
  ): void => {
    const index = sortedSections.findIndex((item) => item.id === section.id);

    if (index === -1) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= sortedSections.length) {
      return;
    }

    const swapped = [...sortedSections];
    const temp = swapped[index];
    swapped[index] = swapped[targetIndex];
    swapped[targetIndex] = temp;

    const orderedIds = swapped.map((item) => item.id);

    if (!validateSectionsOrder(swapped)) {
      return;
    }

    handleReorderSections(orderedIds);
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
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        templates={availableTemplates}
        defaultLocale={page.locale}
        navigationGroups={navigationGroups}
        onSubmit={handleCreateSectionSubmit}
      />

      <EditSectionDialog
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogOpenChange}
        section={selectedSection}
        templates={availableTemplates}
        navigationGroups={navigationGroups}
        allowTemplateChange
        onSubmit={handleEditSectionSubmit}
      />
    </AuthenticatedLayout>
  );
}
