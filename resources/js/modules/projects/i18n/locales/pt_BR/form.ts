export default {
  fields: {
    locale: {
      label: 'Locale base',
      placeholder: 'Escolha o idioma principal do projeto',
    },
    name: {
      label: 'Nome',
      placeholder: 'Informe o nome do projeto',
    },
    status: {
      label: 'Status',
      placeholder: 'Escolha o status',
    },
    summary: {
      label: 'Resumo',
      placeholder:
        'Explique em uma frase o objetivo e o principal resultado do projeto',
    },
    description: {
      label: 'Descrição',
      placeholder:
        'Descreva contexto, solução, stack, desafios e impacto do projeto',
    },
    display: {
      label: 'Exibir na página inicial',
    },
    visibility: {
      label: 'Visibilidade',
    },
    repository_url: {
      label: 'Link do repositório do projeto',
      placeholder: 'https://github.com/sua-org/seu-repositorio',
    },
    live_url: {
      label: 'Link da versão publicada',
      placeholder: 'https://produto.exemplo.com',
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
      addDisabledTitle:
        'Selecione um arquivo de imagem antes de adicionar outro campo.',
      fileLabel: 'Arquivo da imagem',
      filePlaceholder: 'Selecione uma imagem',
      altLabel: 'Texto alternativo',
      altPlaceholder: 'Descreva a imagem para acessibilidade',
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
    createSubtitle:
      'Preencha as informações editoriais, os links públicos e as imagens do novo projeto.',
    editSubtitle:
      'Revise os dados principais, os links publicados e os recursos visuais deste projeto.',
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
    delivered: 'Entregue',
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
