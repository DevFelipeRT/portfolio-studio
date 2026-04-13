import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead, PageLink } from '@/common/page-runtime';
import {
  EditProject,
  type EditProjectProps,
} from '@/modules/projects/admin/management/edit';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import React from 'react';

export default function Edit(props: EditProjectProps) {
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );

  return (
    <>
      <PageHead title={tActions('editProjectTitle', { name: props.project.name })} />

      <PageContent className="overflow-hidden py-8" pageWidth="default">
        <div className="mb-4">
          <PageLink
            href={route('projects.index')}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            {tActions('backToIndex')}
          </PageLink>
        </div>

        <EditProject {...props} />
      </PageContent>
    </>
  );
}

Edit.i18n = ['projects'];
Edit.layout = (page: React.ReactNode) => (
  <AuthenticatedLayout>{page}</AuthenticatedLayout>
);
