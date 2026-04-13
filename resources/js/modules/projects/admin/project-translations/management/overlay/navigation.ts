import React from 'react';
import type { OverlayView } from './types';

export function useOverlayNavigation() {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<OverlayView>('list');
  const [activeLocale, setActiveLocale] = React.useState<string | null>(null);

  const reset = React.useCallback((): void => {
    setView('list');
    setActiveLocale(null);
  }, []);

  const close = React.useCallback((): void => {
    reset();
    setOpen(false);
  }, [reset]);

  const openTranslations = React.useCallback((): void => {
    reset();
    setOpen(true);
  }, [reset]);

  const onOpenChange = React.useCallback(
    (nextOpen: boolean): void => {
      if (!nextOpen) {
        close();
        return;
      }

      setOpen(true);
    },
    [close],
  );

  const backToList = React.useCallback((): void => {
    setView('list');
    setActiveLocale(null);
  }, []);

  const openAdd = React.useCallback((): void => {
    setView('add');
    setActiveLocale(null);
  }, []);

  const openEdit = React.useCallback((locale: string): void => {
    setView('edit');
    setActiveLocale(locale);
  }, []);

  return {
    open,
    view,
    activeLocale,
    close,
    openTranslations,
    onOpenChange,
    backToList,
    openAdd,
    openEdit,
  };
}
