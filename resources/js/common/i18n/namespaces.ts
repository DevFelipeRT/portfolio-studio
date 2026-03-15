import type { Namespace } from './types';

/**
 * Well-known translation namespaces used by shared UI code.
 */
export const I18N_NAMESPACES = {
  accessibility: 'accessibility' as Namespace,
  actions: 'actions' as Namespace,
  dateTime: 'dateTime' as Namespace,
  dialog: 'dialog' as Namespace,
  feedback: 'feedback' as Namespace,
  form: 'form' as Namespace,
  i18n: 'i18n' as Namespace,
  labels: 'labels' as Namespace,
  languageSelector: 'languageSelector' as Namespace,
  pagination: 'pagination' as Namespace,
  state: 'state' as Namespace,
  table: 'table' as Namespace,
  themeToggle: 'themeToggle' as Namespace,
  validation: 'validation' as Namespace,
} as const;
