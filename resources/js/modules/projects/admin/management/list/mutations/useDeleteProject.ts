import { pageRouter } from '@/common/page-runtime';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type { ProjectListItem } from '../types';
import type { MouseEvent } from 'react';

type UseDeleteProjectParams = {
  selectedProjectId: ProjectListItem['id'] | null;
  onDeletedSelectedProject: () => void;
};

/**
 * Performs project deletion and coordinates follow-up UI cleanup when the
 * removed item is currently selected in the overlay.
 */
export function useDeleteProject({
  selectedProjectId,
  onDeletedSelectedProject,
}: UseDeleteProjectParams) {
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );

  const deleteProject = (
    project: ProjectListItem,
    event?: MouseEvent,
  ): void => {
    event?.stopPropagation();

    if (!window.confirm(tActions('confirmDelete'))) {
      return;
    }

    pageRouter.delete(route('projects.destroy', project.id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        if (selectedProjectId === project.id) {
          onDeletedSelectedProject();
        }
      },
    });
  };

  return {
    deleteProject,
  };
}
