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
      placeholder: 'Exemplo: rascunho, publicado',
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
    repository_url: {
      label: 'URL do repositório',
    },
    live_url: {
      label: 'URL ao vivo',
    },
    skill_ids: {
      label: 'Skills',
      empty: 'Nenhuma skill disponível.',
      emptyInline: 'Sem skills',
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
    actions: {
      label: 'Ações',
    },
  },
  help: {
    managementSubtitle:
      'Gerencie os projetos exibidos na página inicial do seu portfólio.',
  },
  emptyState: {
    index: 'Nenhum projeto foi criado ainda.',
    publicSection: 'Nenhum projeto foi retornado para esta seção.',
  },
  values: {
    empty: '\u2014',
  },
  carousel: {
    progress: '{{current}} de {{total}}',
  },
  card: {
    untitled: 'Projeto sem título',
    noSummary: 'Nenhum resumo disponível.',
    noSkills: 'Nenhuma skill listada ainda.',
  },
  errors: {
    translationsLoad:
      'Não foi possível carregar as traduções para verificar conflitos de locale.',
  },
};
