import type { PageSectionDto } from '@/Modules/ContentManagement/types';
import React from 'react';

/**
 * Controls the open state + selected section for the "edit section" dialog.
 */
export function useEditSectionDialogController() {
  const [open, setOpen] = React.useState(false);
  const [section, setSection] = React.useState<PageSectionDto | null>(null);

  const openFor = React.useCallback((nextSection: PageSectionDto) => {
    setSection(nextSection);
    setOpen(true);
  }, []);

  const onOpenChange = React.useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSection(null);
    }
  }, []);

  return {
    open,
    section,
    openFor,
    onOpenChange,
  };
}
