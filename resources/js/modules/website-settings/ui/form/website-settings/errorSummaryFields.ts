import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';

export function getErrorSummaryFields(errors: FormErrors) {
  return collectErroredFieldLabels(errors, [
    { name: 'site_name', label: 'Nome do site' },
    { name: 'site_description', label: 'Descrição do site' },
    { name: 'owner_name', label: 'Responsável / Owner' },
    { name: 'default_locale', label: 'Locale padrão' },
    { name: 'fallback_locale', label: 'Locale fallback' },
    { name: 'canonical_base_url', label: 'Canonical base URL' },
    { name: 'meta_title_template', label: 'Template de meta title' },
    { name: 'default_meta_title', label: 'Meta title padrão' },
    { name: 'default_meta_description', label: 'Meta description padrão' },
    { name: 'default_meta_image_id', label: 'Meta image ID' },
    { name: 'default_og_image_id', label: 'OG image ID' },
    { name: 'default_twitter_image_id', label: 'Twitter image ID' },
    { name: 'robots', label: 'Robots' },
    { name: 'system_pages', label: 'Páginas do sistema' },
    { name: 'institutional_links', label: 'Links institucionais' },
    { name: 'public_scope_enabled', label: 'Escopo público' },
    { name: 'private_scope_enabled', label: 'Escopo privado' },
  ] as const);
}

