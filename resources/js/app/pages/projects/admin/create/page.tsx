import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead, PageLink } from '@/common/page-runtime';
import {
  CreateProject,
  type CreateProjectProps,
} from '@/modules/projects/admin/management/create';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import React from 'react';

export default function Create(props: CreateProjectProps) {
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );

  return (
    <>
      <PageHead title={tActions('newProject')} />

      <PageContent className="overflow-hidden py-8" pageWidth="default">
        <div className="mb-4">
          <PageLink
            href={route('projects.index')}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            {tActions('backToIndex')}
          </PageLink>
        </div>

        <CreateProject {...props} />
      </PageContent>
    </>
  );
}

Create.i18n = ['projects'];
Create.layout = (page: React.ReactNode) => (
  <AuthenticatedLayout>{page}</AuthenticatedLayout>
);
