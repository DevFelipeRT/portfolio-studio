import type { ProjectListItem } from '../types';
import { useState } from 'react';

/**
 * Owns row selection and overlay visibility for the Projects admin list.
 */
export function useProjectOverlay() {
  const [selectedProject, setSelectedProject] =
    useState<ProjectListItem | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const openProject = (project: ProjectListItem): void => {
    setSelectedProject(project);
    setOverlayOpen(true);
  };

  const closeProject = (): void => {
    setOverlayOpen(false);
    setSelectedProject(null);
  };

  const handleOverlayChange = (open: boolean): void => {
    if (open) {
      setOverlayOpen(true);
      return;
    }

    closeProject();
  };

  return {
    selectedProject,
    overlayOpen,
    openProject,
    closeProject,
    handleOverlayChange,
  };
}
