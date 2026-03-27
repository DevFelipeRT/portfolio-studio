import { PROJECTS_NAMESPACES, useProjectsTranslation } from '@/modules/projects/i18n';

export const PROJECT_STATUS_VALUES = [
  'completed',
  'in_progress',
  'maintenance',
  'planned',
] as const;

export type ProjectStatusValue = (typeof PROJECT_STATUS_VALUES)[number];

export function isProjectStatusValue(value: string): value is ProjectStatusValue {
  return PROJECT_STATUS_VALUES.includes(value as ProjectStatusValue);
}

export function useProjectStatusOptions(includeEmpty = false) {
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);

  const options = PROJECT_STATUS_VALUES.map((value) => ({
    value,
    label: tForm(`status.${value}`),
  }));

  if (!includeEmpty) {
    return options;
  }

  return [
    {
      value: '__empty__',
      label: tForm('values.empty'),
    },
    ...options,
  ];
}
