import { deleteProjectTranslation } from '@/modules/projects/api/translations';
import React from 'react';
import type { ProjectTranslationRecord } from '../types';
import { normalizeError, type OverlayError } from './error';

type Params = {
  projectId: number;
  getConfirmMessage: (locale: string) => string;
  onDeleted: (locale: string) => void;
  onError: (error: OverlayError) => void;
};

export function useDeleteTranslation({
  projectId,
  getConfirmMessage,
  onDeleted,
  onError,
}: Params) {
  const [deleting, setDeleting] = React.useState(false);

  const deleteTranslation = React.useCallback(
    async (item: ProjectTranslationRecord) => {
      if (!window.confirm(getConfirmMessage(item.locale))) {
        return;
      }

      setDeleting(true);

      try {
        await deleteProjectTranslation(projectId, item.locale);
        onDeleted(item.locale);
      } catch (error) {
        onError(normalizeError(error));
      } finally {
        setDeleting(false);
      }
    },
    [getConfirmMessage, onDeleted, onError, projectId],
  );

  return {
    deleting,
    deleteTranslation,
  };
}
