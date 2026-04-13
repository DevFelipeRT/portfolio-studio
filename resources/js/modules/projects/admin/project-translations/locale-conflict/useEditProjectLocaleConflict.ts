import { listProjectTranslations } from '@/modules/projects/api/translations';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import React from 'react';

type UseEditProjectLocaleConflictParams = {
  projectId: number;
  currentLocale: string;
  setLocale: (locale: string) => void;
  setConfirmSwap: (value: boolean) => void;
};

/**
 * Owns the locale-conflict concern inside the edit overlay surface: checking
 * whether a selected base locale already exists in translations and driving
 * the swap dialog state.
 */
export function useEditProjectLocaleConflict({
  projectId,
  currentLocale,
  setLocale,
  setConfirmSwap,
}: UseEditProjectLocaleConflictParams) {
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const [swapDialogOpen, setSwapDialogOpen] = React.useState(false);
  const [pendingLocale, setPendingLocale] = React.useState<string | null>(null);
  const [translationLocales, setTranslationLocales] = React.useState<string[]>(
    [],
  );
  const [loadingTranslations, setLoadingTranslations] = React.useState(false);
  const [hasLocalesLoadError, setHasLocalesLoadError] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    const loadTranslations = async (): Promise<void> => {
      setLoadingTranslations(true);
      setHasLocalesLoadError(false);

      try {
        const items = await listProjectTranslations(projectId);

        if (mounted) {
          setTranslationLocales(
            items.map((item) => item.locale).filter(Boolean),
          );
        }
      } catch {
        if (mounted) {
          setHasLocalesLoadError(true);
        }
      } finally {
        if (mounted) {
          setLoadingTranslations(false);
        }
      }
    };

    void loadTranslations();

    return () => {
      mounted = false;
    };
  }, [projectId]);

  const handleLocaleChange = (nextLocale: string): void => {
    if (
      nextLocale !== currentLocale &&
      translationLocales.includes(nextLocale)
    ) {
      setPendingLocale(nextLocale);
      setSwapDialogOpen(true);
      return;
    }

    setConfirmSwap(false);
    setLocale(nextLocale);
  };

  const handleConfirmSwap = (): void => {
    if (!pendingLocale) {
      return;
    }

    setConfirmSwap(true);
    setLocale(pendingLocale);
    setSwapDialogOpen(false);
    setPendingLocale(null);
  };

  const handleConfirmNoSwap = (): void => {
    if (!pendingLocale) {
      return;
    }

    setConfirmSwap(false);
    setLocale(pendingLocale);
    setSwapDialogOpen(false);
    setPendingLocale(null);
  };

  const handleCancelSwap = (): void => {
    setSwapDialogOpen(false);
    setPendingLocale(null);
  };

  return {
    localeDisabled: loadingTranslations || hasLocalesLoadError,
    localeNote: hasLocalesLoadError ? tForm('errors.translationsLoad') : null,
    pendingLocale,
    swapDialogOpen,
    handleLocaleChange,
    handleConfirmSwap,
    handleConfirmNoSwap,
    handleCancelSwap,
  };
}
