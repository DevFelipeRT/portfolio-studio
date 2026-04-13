import type { TablePaginated } from '@/common/table';
import { PROJECT_LIST_CONFIG } from './config';
import { useProjectListFilters } from './filtering/useProjectListFilters';
import { useDeleteProject } from './mutations/useDeleteProject';
import { ProjectOverlay } from './overlay/ProjectOverlay';
import { useProjectOverlay } from './overlay/useProjectOverlay';
import { ProjectsListToolbar } from './table/ProjectsListToolbar';
import { ProjectsTable } from './table/ProjectsTable';
import type { ProjectListItem } from './types';

type ProjectListFilters = {
  per_page?: number | null;
  search?: string | null;
  status?: string | null;
  visibility?: string | null;
  sort?: string | null;
  direction?: string | null;
};

export type ListProjectsProps = {
  projects: TablePaginated<ProjectListItem>;
  statusValues: readonly string[];
  filters: ProjectListFilters;
};

export function ListProjects({
  projects,
  statusValues,
  filters,
}: ListProjectsProps) {
  const filtering = useProjectListFilters({ projects, statusValues, filters });
  const overlay = useProjectOverlay();
  const deletion = useDeleteProject({
    selectedProjectId: overlay.selectedProject?.id ?? null,
    onDeletedSelectedProject: overlay.closeProject,
  });

  return (
    <>
      <ProjectsTable
        projects={projects}
        onRowClick={overlay.openProject}
        onDelete={deletion.deleteProject}
        header={
          <ProjectsListToolbar
            draftSearch={filtering.draftFilters.search}
            draftStatus={filtering.draftFilters.status}
            draftVisibility={filtering.draftFilters.visibility}
            statusOptions={filtering.statusOptions}
            hasAppliedFilters={filtering.hasAppliedFilters}
            onDraftSearchChange={(value) =>
              filtering.setDraftValue('search', value)
            }
            onDraftStatusChange={(value) =>
              filtering.applyPartialDraftFilters({ status: value })
            }
            onDraftVisibilityChange={(value) =>
              filtering.applyPartialDraftFilters({ visibility: value })
            }
            onSubmit={filtering.handleSubmit}
            onResetFilters={filtering.handleReset}
          />
        }
        emptyStateMessage={filtering.emptyStateMessage}
        onPageChange={filtering.handlePageChange}
        onPerPageChange={filtering.handlePerPageChange}
        onSortChange={filtering.handleSortChange}
        perPageOptions={PROJECT_LIST_CONFIG.perPageOptions}
        sort={filtering.sortState}
        sortableColumns={PROJECT_LIST_CONFIG.sortableColumns}
      />

      <ProjectOverlay
        open={overlay.overlayOpen}
        project={overlay.selectedProject}
        onOpenChange={overlay.handleOverlayChange}
      />
    </>
  );
}
