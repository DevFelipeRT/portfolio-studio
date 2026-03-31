import type { TranslationTree } from '@/common/i18n/types';

const pages: TranslationTree = {
  index: {
    headTitle: 'Paginas de conteudo',
    title: 'Paginas de conteudo',
    description:
      'Gerencie paginas CMS, seus metadados e a composicao de secoes.',
  },
  create: {
    headTitle: 'Criar pagina',
    title: 'Criar pagina de conteudo',
    description:
      'Defina uma nova pagina CMS antes de compor suas secoes.',
  },
  edit: {
    headTitle: 'Editar pagina - {{title}}',
    title: 'Editar pagina de conteudo',
    description: 'Atualize os metadados desta pagina e gerencie suas secoes.',
    deleteCta: 'Excluir pagina',
    deleteConfirm:
      'Tem certeza de que deseja excluir esta pagina e todas as suas secoes?',
  },
  form: {
    createTitle: 'Criar pagina',
    editTitle: 'Editar pagina',
    createDescription:
      'Configure os metadados basicos de uma nova pagina CMS.',
    editDescription:
      'Atualize os metadados e o comportamento desta pagina CMS.',
    internalIdentifier: 'Identificador interno:',
    fields: {
      title: 'Titulo',
      slug: 'Slug',
      internalName: 'Nome interno',
      locale: 'Locale',
      layoutKey: 'Chave de layout',
      metaTitle: 'Meta title',
      metaDescription: 'Meta description',
      published: 'Publicada',
      indexable: 'Indexavel',
      allowIndexing: 'Permitir indexacao',
    },
    placeholders: {
      title: 'Pagina inicial',
      slug: 'home, about, portfolio',
      internalName: 'landing_home, about_me',
      locale: 'pt_BR, en_US',
      layoutKey: 'default, landing_full',
      metaTitle: 'Titulo de SEO desta pagina',
      metaDescription:
        'Descricao curta usada para SEO e compartilhamento social.',
    },
    submitCreate: 'Criar pagina',
  },
  filters: {
    search: 'Buscar',
    submitSearch: 'Buscar paginas',
    status: 'Status',
    locale: 'Locale',
    searchPlaceholder: 'Filtrar por titulo, nome interno ou slug',
    allStatuses: 'Todos os status',
    allLocales: 'Todos os locales',
    draft: 'Rascunho',
    published: 'Publicada',
    archived: 'Arquivada',
  },
  listing: {
    columns: {
      name: 'Nome',
      title: 'Titulo',
      slug: 'Slug',
      locale: 'Locale',
      status: 'Status',
      lastUpdated: 'Atualizado em',
      rowActions: 'Acoes da linha',
    },
    empty: 'Nenhuma pagina encontrada para os filtros atuais.',
    openNewTab: 'Abrir pagina em nova aba',
    home: 'Inicial',
    draft: 'Rascunho',
    published: 'Publicada',
    archived: 'Arquivada',
    deleteConfirm: 'Excluir "{{title}}"? Esta acao nao pode ser desfeita.',
  },
  info: {
    title: 'Detalhes da pagina',
    description:
      'Resumo dos metadados atuais da pagina retornados pelo backend.',
    badges: {
      published: 'Publicada',
      draft: 'Rascunho',
      archived: 'Arquivada',
      indexable: 'Indexavel',
      noindex: 'Noindex',
    },
    fields: {
      title: 'Titulo',
      internalName: 'Nome interno',
      slug: 'Slug',
      layoutKey: 'Chave de layout',
      metaTitle: 'Meta title',
      metaDescription: 'Meta description',
      metaImageUrl: 'URL da meta imagem',
      publishedAt: 'Publicada em',
      createdAt: 'Criada em',
      updatedAt: 'Atualizada em',
    },
  },
};

export default pages;
