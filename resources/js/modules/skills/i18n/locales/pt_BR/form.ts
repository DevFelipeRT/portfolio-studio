export default {
  fields: {
    locale: { label: 'Locale', placeholder: 'Selecione um locale' },
    name: { label: 'Nome' },
    category: {
      label: 'Categoria',
      placeholder: 'Selecione uma categoria',
      uncategorized: 'Sem categoria',
    },
    slug: { label: 'Slug', placeholder: 'Deixe em branco para gerar automaticamente' },
    created_at: { label: 'Criado em' },
    updated_at: { label: 'Atualizado em' },
    actions: { label: 'Ações' },
  },
  help: {
    managementSubtitle:
      'Gerencie as habilidades reutilizáveis referenciadas pelos projetos do seu portfólio.',
    categoriesDescription:
      'Organize habilidades por categoria para agrupamento e filtragem.',
    categoriesSummary: 'Categorias cadastradas',
    categoriesStandaloneHint:
      'Abra a página dedicada de categorias para navegar, paginar e gerenciar esse catálogo.',
  },
  filters: {
    searchLabel: 'Buscar',
    searchPlaceholder: 'Buscar por habilidade ou categoria',
    searchSubmit: 'Buscar habilidades',
    categoryLabel: 'Categoria',
    categoryPlaceholder: 'Todas as categorias',
    categoriesSearchLabel: 'Buscar',
    categoriesSearchPlaceholder: 'Buscar por nome ou slug da categoria',
    categoriesSearchSubmit: 'Buscar categorias',
    reset: 'Limpar',
  },
  emptyState: {
    skills: 'Nenhuma habilidade foi criada ainda.',
    filteredSkills: 'Nenhuma habilidade corresponde aos filtros atuais.',
    categories: 'Nenhuma categoria foi criada ainda.',
    filteredCategories: 'Nenhuma categoria corresponde aos filtros atuais.',
  },
  table: {
    title: 'Habilidades',
    description:
      'Revise e gerencie as habilidades usadas nos seus projetos.',
    menu: 'Menu',
  },
  sections: {
    categoriesTitle: 'Categorias de habilidade',
  },
  values: {
    empty: '\u2014',
  },
  public: {
    sectionLabel: 'Habilidades usadas nos meus projetos',
    eyebrow: 'Tech stack',
    title: 'Habilidades com as quais eu trabalho no dia a dia.',
    description:
      'Uma seleção de ferramentas e frameworks que utilizo para projetar, construir e operar aplicações web.',
  },
};
