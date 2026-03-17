export default {
  sections: {
    identity: {
      title: 'Identidade do site',
      description: 'Informações públicas e responsáveis pelo branding global.',
      emptyLocales:
        'Nenhum locale encontrado no CMS. Crie uma página pública para habilitar campos localizados.',
    },
    locales: {
      title: 'Locales',
      description:
        'Define o locale padrão (fixo ou automático) e o fallback usado quando não há conteúdo.',
    },
    seo: {
      title: 'SEO global',
      description: 'Templates e fallbacks globais para metadados.',
      metaTitleHint:
        'Tags suportadas: {{pageTitleTag}}, {{ownerTag}}, {{siteTag}}, {{localeTag}}.',
    },
    scopes: {
      title: 'Escopos',
      description: 'Habilite ou desabilite escopos globais.',
    },
    systemPages: {
      title: 'Páginas do sistema',
      description: 'Slugs ou identificadores de páginas transversais.',
    },
    institutionalLinks: {
      title: 'Links institucionais',
      description: 'Links globais usados no site inteiro.',
      empty: 'Nenhum link cadastrado.',
    },
  },
  fields: {
    site_name: { label: 'Nome do site', placeholder: 'Nome do site' },
    site_description: {
      label: 'Descrição do site',
      placeholder: 'Descrição curta',
    },
    owner_name: {
      label: 'Responsável / Owner',
      placeholder: 'Nome do responsável',
    },
    default_locale: {
      label: 'Locale padrão',
      placeholder: 'Selecione',
    },
    fallback_locale: {
      label: 'Locale fallback',
      placeholder: 'Selecione',
    },
    canonical_base_url: {
      label: 'Canonical base URL',
      placeholder: 'https://meusite.com',
    },
    meta_title_template: {
      label: 'Template de title',
      placeholder: '{page_title} | {owner} | {site}',
    },
    default_meta_title: {
      label: 'Meta title padrão',
      placeholder: 'Título padrão',
    },
    default_meta_description: {
      label: 'Meta description padrão',
      placeholder: 'Descrição padrão',
    },
    default_meta_image_id: { label: 'Meta image ID' },
    default_og_image_id: { label: 'OG image ID' },
    default_twitter_image_id: { label: 'Twitter image ID' },
    public_scope_enabled: { label: 'Escopo público' },
    private_scope_enabled: { label: 'Escopo privado' },
    robots_public: {
      label: 'Robots público',
      hint: 'Configuração global para páginas públicas.',
    },
    robots_private: {
      label: 'Robots privado',
      hint: 'Configuração global para páginas privadas.',
    },
    robots_index: { label: 'Index' },
    robots_follow: { label: 'Follow' },
    system_pages_not_found: {
      label: '404',
      placeholder: 'slug-404',
    },
    system_pages_maintenance: {
      label: 'Manutenção',
      placeholder: 'slug-manutencao',
    },
    system_pages_policies: {
      label: 'Políticas',
      placeholder: 'slug-politicas',
    },
    institutional_link_label: {
      label: 'Label',
      placeholder: 'Suporte',
    },
    institutional_link_url: {
      label: 'URL',
      placeholder: 'https://meusite.com/suporte',
    },
  },
  options: {
    auto: 'Automático',
  },
  actions: {
    addLink: 'Adicionar link',
    remove: 'Remover',
  },
};
