import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead } from '@/common/page-runtime';
import {
  ListProjects,
  type ListProjectsProps,
} from '@/modules/projects/admin/management/list/ListProjects';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type { ReactNode } from 'react';

type ProjectsListPageProps = Omit<ListProjectsProps, 'statusValues'> & {
  status_values: string[];
};

export default function Index({
  projects,
  status_values,
  filters,
}: ProjectsListPageProps) {
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const { translate: tSections } = useProjectsTranslation(
    PROJECTS_NAMESPACES.sections,
  );
  const title = tSections('managementTitle');

  return (
    <>
      <PageHead title={title} />

      <PageContent className="overflow-hidden py-8" pageWidth="container">
        <div className="mb-6">
          <div>
            <h1 className="text-xl leading-tight font-semibold">{title}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {tForm('help.managementSubtitle')}
            </p>
          </div>
        </div>

        <ListProjects
          projects={projects}
          statusValues={status_values}
          filters={filters}
        />
      </PageContent>
    </>
  );
}

Index.i18n = ['projects'];
Index.layout = (page: ReactNode) => (
  <AuthenticatedLayout>{page}</AuthenticatedLayout>
);
