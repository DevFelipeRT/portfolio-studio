export default {
  sections: {
    identity: {
      title: 'Site identity',
      description: 'Public information responsible for the global branding.',
      emptyLocales:
        'No locale was found in the CMS. Create a public page to enable localized fields.',
    },
    locales: {
      title: 'Locales',
      description:
        'Defines the default locale (fixed or automatic) and the fallback used when content is missing.',
    },
    seo: {
      title: 'Global SEO',
      description: 'Global templates and fallbacks for metadata.',
      metaTitleHint:
        'Supported tags: {{pageTitleTag}}, {{ownerTag}}, {{siteTag}}, {{localeTag}}.',
    },
    scopes: {
      title: 'Scopes',
      description: 'Enable or disable global scopes.',
    },
    systemPages: {
      title: 'System pages',
      description: 'Slugs or identifiers for cross-cutting pages.',
    },
    institutionalLinks: {
      title: 'Institutional links',
      description: 'Global links used across the entire site.',
      empty: 'No links added yet.',
    },
  },
  fields: {
    site_name: { label: 'Site name', placeholder: 'Site name' },
    site_description: {
      label: 'Site description',
      placeholder: 'Short description',
    },
    owner_name: {
      label: 'Owner / Responsible',
      placeholder: 'Owner name',
    },
    default_locale: {
      label: 'Default locale',
      placeholder: 'Select',
    },
    fallback_locale: {
      label: 'Fallback locale',
      placeholder: 'Select',
    },
    canonical_base_url: {
      label: 'Canonical base URL',
      placeholder: 'https://mysite.com',
    },
    meta_title_template: {
      label: 'Meta title template',
      placeholder: '{page_title} | {owner} | {site}',
    },
    default_meta_title: {
      label: 'Default meta title',
      placeholder: 'Default title',
    },
    default_meta_description: {
      label: 'Default meta description',
      placeholder: 'Default description',
    },
    default_meta_image_id: { label: 'Meta image ID' },
    default_og_image_id: { label: 'OG image ID' },
    default_twitter_image_id: { label: 'Twitter image ID' },
    public_scope_enabled: { label: 'Public scope' },
    private_scope_enabled: { label: 'Private scope' },
    robots_public: {
      label: 'Public robots',
      hint: 'Global configuration for public pages.',
    },
    robots_private: {
      label: 'Private robots',
      hint: 'Global configuration for private pages.',
    },
    robots_index: { label: 'Index' },
    robots_follow: { label: 'Follow' },
    system_pages_not_found: {
      label: '404',
      placeholder: 'slug-404',
    },
    system_pages_maintenance: {
      label: 'Maintenance',
      placeholder: 'maintenance-slug',
    },
    system_pages_policies: {
      label: 'Policies',
      placeholder: 'policies-slug',
    },
    institutional_link_label: {
      label: 'Label',
      placeholder: 'Support',
    },
    institutional_link_url: {
      label: 'URL',
      placeholder: 'https://mysite.com/support',
    },
  },
  options: {
    auto: 'Automatic',
  },
  actions: {
    addLink: 'Add link',
    remove: 'Remove',
  },
};
