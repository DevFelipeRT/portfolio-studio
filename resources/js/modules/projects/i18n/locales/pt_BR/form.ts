export default {
  fields: {
    locale: {
      label: 'Locale base',
      placeholder: 'Selecione um locale',
    },
    name: {
      label: 'Nome',
    },
    status: {
      label: 'Status',
      placeholder: 'Selecione um status',
    },
    summary: {
      label: 'Resumo',
    },
    description: {
      label: 'Descrição',
    },
    display: {
      label: 'Exibir na página inicial',
    },
    visibility: {
      label: 'Visibilidade',
    },
    repository_url: {
      label: 'URL do repositório',
    },
    live_url: {
      label: 'URL ao vivo',
    },
    skill_ids: {
      label: 'Habilidades',
      empty: 'Nenhuma skill disponível.',
      emptyInline: 'Sem habilidades',
      otherLabel: 'Outras',
      placeholder: 'Buscar e selecionar skills…',
    },
    images: {
      label: 'Imagens',
      empty: 'Nenhuma imagem adicionada ainda.',
      addDisabledTitle: 'Selecione um arquivo de imagem antes de adicionar outro campo.',
    },
    updated_at: {
      label: 'Atualizado em',
    },
    image_count: {
      label: 'Imagens',
    },
    actions: {
      label: 'Ações',
    },
  },
  help: {
    managementSubtitle:
      'Gerencie os projetos exibidos na página inicial do seu portfólio.',
  },
  filters: {
    searchLabel: 'Buscar',
    searchPlaceholder: 'Buscar por nome ou resumo',
    searchSubmit: 'Buscar projetos',
    statusLabel: 'Status',
    statusPlaceholder: 'Status',
    clearStatus: 'Limpar filtro de status',
    visibilityLabel: 'Visibilidade',
    visibilityPlaceholder: 'Visibilidade',
    clearVisibility: 'Limpar filtro de visibilidade',
    publicOnly: 'Somente públicos',
    privateOnly: 'Somente privados',
    reset: 'Limpar',
  },
  emptyState: {
    index: 'Nenhum projeto foi criado ainda.',
    filteredDescription: 'Nenhum projeto corresponde aos filtros atuais.',
    publicSection: 'Nenhum projeto foi retornado para esta seção.',
  },
  values: {
    empty: '\u2014',
  },
  visibility: {
    public: 'Público',
    private: 'Privado',
  },
  status: {
    completed: 'Concluído',
    in_progress: 'Em andamento',
    maintenance: 'Em manutenção',
    planned: 'Planejado',
  },
  carousel: {
    progress: '{{current}} de {{total}}',
    showImage: 'Mostrar imagem {{index}}',
  },
  card: {
    untitled: 'Projeto sem título',
    noSummary: 'Nenhum resumo disponível.',
    noSkills: 'Nenhuma skill listada ainda.',
    noImages: 'Nenhuma imagem disponível.',
  },
  overlay: {
    loading: 'Carregando os detalhes do projeto...',
    loadError: 'Não foi possível carregar os detalhes do projeto agora.',
    createdOn: 'Criado em {{date}}',
    updatedOn: 'Atualizado em {{date}}',
    summary: 'Resumo',
    details: 'Descrição',
    skills: 'Habilidades',
    images: 'Galeria',
  },
  errors: {
    translationsLoad:
      'Não foi possível carregar as traduções para verificar conflitos de locale.',
  },
};
