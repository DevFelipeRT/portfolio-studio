import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';

export function getErrorSummaryFields(
  errors: FormErrors,
  t: (key: string) => string,
) {
  return collectErroredFieldLabels(errors, [
    { name: 'site_name', label: t('fields.site_name.label') },
    { name: 'site_description', label: t('fields.site_description.label') },
    { name: 'owner_name', label: t('fields.owner_name.label') },
    { name: 'default_locale', label: t('fields.default_locale.label') },
    { name: 'fallback_locale', label: t('fields.fallback_locale.label') },
    { name: 'canonical_base_url', label: t('fields.canonical_base_url.label') },
    { name: 'meta_title_template', label: t('fields.meta_title_template.label') },
    { name: 'default_meta_title', label: t('fields.default_meta_title.label') },
    {
      name: 'default_meta_description',
      label: t('fields.default_meta_description.label'),
    },
    { name: 'default_meta_image_id', label: t('fields.default_meta_image_id.label') },
    { name: 'default_og_image_id', label: t('fields.default_og_image_id.label') },
    {
      name: 'default_twitter_image_id',
      label: t('fields.default_twitter_image_id.label'),
    },
    { name: 'robots', label: 'Robots' },
    { name: 'system_pages', label: t('sections.systemPages.title') },
    { name: 'institutional_links', label: t('sections.institutionalLinks.title') },
    {
      name: 'public_scope_enabled',
      label: t('fields.public_scope_enabled.label'),
    },
    {
      name: 'private_scope_enabled',
      label: t('fields.private_scope_enabled.label'),
    },
  ] as const);
}
