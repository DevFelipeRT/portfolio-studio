import React from 'react';

/**
 * Controls the open state for the "create section" dialog.
 *
 * Kept separate from the dialog state hook so callers can manage selection/opening
 * without importing internal dialog implementation details.
 */
export function useCreateSectionDialogController() {
  const [open, setOpen] = React.useState(false);

  const openDialog = React.useCallback(() => {
    setOpen(true);
  }, []);

  return {
    open,
    setOpen,
    openDialog,
  };
}
