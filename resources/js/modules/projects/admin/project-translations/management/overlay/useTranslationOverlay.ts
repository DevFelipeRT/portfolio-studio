import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import React from 'react';
import type { ProjectTranslationRecord } from '../types';
import { getErrorMessage, normalizeError, type OverlayError } from './error';
import { loadTranslationOverlayData } from './load';
import { useOverlayNavigation } from './navigation';
import type { ProjectTranslationOverlayProps } from './ProjectTranslationOverlay';
import {
  addTranslation,
  findActiveTranslation,
  getAvailableLocales,
  removeTranslation,
  replaceTranslation,
} from './state';
import { useDeleteTranslation } from './useDeleteTranslation';

type Params = {
  projectId: number;
  projectLabel: string;
  baseLocale: string;
};

export function useTranslationOverlay({
  projectId,
  projectLabel,
  baseLocale,
}: Params) {
  const { translate: t } = useProjectsTranslation(
    PROJECTS_NAMESPACES.translations,
  );
  const overlay = useOverlayNavigation();
  const {
    open,
    view,
    activeLocale,
    close,
    openTranslations,
    onOpenChange,
    backToList,
    openAdd,
    openEdit,
  } = overlay;
  const [error, setError] = React.useState<OverlayError | null>(null);
  const [supportedLocales, setSupportedLocales] = React.useState<string[]>([]);
  const [translations, setTranslations] = React.useState<ProjectTranslationRecord[]>(
    [],
  );
  const [loading, setLoading] = React.useState(false);

  const refresh = React.useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      const data = await loadTranslationOverlayData(projectId);
      setSupportedLocales(data.supportedLocales);
      setTranslations(data.translations);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const availableLocales = React.useMemo(
    () => getAvailableLocales(supportedLocales, translations, baseLocale),
    [baseLocale, supportedLocales, translations],
  );

  const add = React.useCallback((translation: ProjectTranslationRecord): void => {
    setTranslations((current) => addTranslation(current, translation));
  }, []);

  const replace = React.useCallback(
    (translation: ProjectTranslationRecord): void => {
      setTranslations((current) => replaceTranslation(current, translation));
    },
    [],
  );

  const remove = React.useCallback((locale: string): void => {
    setTranslations((current) => removeTranslation(current, locale));
  }, []);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    setError(null);

    void refresh().catch((error) => {
      setError(normalizeError(error));
    });
  }, [open, refresh]);

  const activeTranslation = React.useMemo(
    () => findActiveTranslation(translations, activeLocale),
    [activeLocale, translations],
  );

  React.useEffect(() => {
    if (view === 'edit' && activeLocale && !activeTranslation) {
      backToList();
    }
  }, [activeLocale, activeTranslation, backToList, view]);

  const errorMessage = getErrorMessage(error, t);

  const handleClose = React.useCallback(() => {
    setError(null);
    close();
  }, [close]);

  const handleBackToList = React.useCallback(() => {
    setError(null);
    backToList();
  }, [backToList]);

  const handleOpenAdd = React.useCallback(() => {
    setError(null);
    openAdd();
  }, [openAdd]);

  const handleOpenEdit = React.useCallback(
    (locale: string) => {
      setError(null);
      openEdit(locale);
    },
    [openEdit],
  );

  const { deleting, deleteTranslation } = useDeleteTranslation({
    projectId,
    getConfirmMessage: (locale) => t('confirmDelete', { locale }),
    onDeleted: remove,
    onError: setError,
  });

  const overlayProps: ProjectTranslationOverlayProps = {
    open,
    onOpenChange,
    projectId,
    projectLabel,
    loading,
    saving: deleting,
    errorMessage,
    view,
    translations,
    availableLocales,
    activeTranslation,
    onCreated: add,
    replace,
    onOpenAdd: handleOpenAdd,
    onOpenEdit: handleOpenEdit,
    onBackToList: handleBackToList,
    onDelete: deleteTranslation,
  };

  return {
    openTranslations,
    closeTranslations: handleClose,
    overlayProps,
  };
}
