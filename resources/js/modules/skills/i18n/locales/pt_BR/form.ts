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
    updated_at: { label: 'Atualizado' },
    actions: { label: 'Ações' },
  },
  help: {
    managementSubtitle:
      'Gerencie as skills reutilizáveis referenciadas pelos projetos do seu portfólio.',
    categoriesDescription:
      'Organize skills por categoria para agrupamento e filtragem.',
  },
  emptyState: {
    skills: 'Nenhuma skill foi criada ainda.',
    categories: 'Nenhuma categoria foi criada ainda.',
  },
  table: {
    title: 'Skills',
    description:
      'Revise e gerencie as skills usadas nos seus projetos.',
    menu: 'Menu',
  },
  sections: {
    categoriesTitle: 'Categorias de skill',
  },
  values: {
    empty: '\u2014',
  },
  public: {
    sectionLabel: 'Skills usadas nos meus projetos',
    eyebrow: 'Tech stack',
    title: 'Skills com as quais eu trabalho no dia a dia.',
    description:
      'Uma seleção de ferramentas e frameworks que utilizo para projetar, construir e operar aplicações web.',
  },
};
