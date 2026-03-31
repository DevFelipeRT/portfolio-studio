export default {
  fields: {
    locale: { label: 'Locale base', placeholder: 'Selecione um locale' },
    name: { label: 'Nome' },
    start_date: { label: 'Data de início', placeholder: 'Selecione uma data' },
    end_date: { label: 'Data de término', placeholder: 'Selecione uma data' },
    summary: { label: 'Resumo' },
    description: { label: 'Descrição' },
    display: { label: 'Exibir na página inicial' },
    visibility: { label: 'Visibilidade' },
    images: { label: 'Imagens', empty: 'Nenhuma imagem adicionada ainda.' },
    updated_at: { label: 'Atualizado em' },
    actions: { label: 'Ações' },
    period: { label: 'Data / Período' },
    image_count: { label: 'Imagens' },
  },
  help: {
    managementSubtitle:
      'Atividades que você liderou, como palestras, workshops e ações comunitárias.',
  },
  filters: {
    searchLabel: 'Buscar',
    searchPlaceholder: 'Buscar por nome ou resumo da iniciativa',
    searchSubmit: 'Buscar iniciativas',
    visibilityLabel: 'Visibilidade',
    visibilityPlaceholder: 'Todos os estados de visibilidade',
    imagePresenceLabel: 'Imagens',
    imagePresencePlaceholder: 'Qualquer estado de imagem',
    withImages: 'Com imagens',
    withoutImages: 'Sem imagens',
    publicOnly: 'Somente públicas',
    privateOnly: 'Somente privadas',
    reset: 'Limpar',
  },
  stats: {
    total: 'Total: {{count}}',
    public: 'Público: {{count}}',
  },
  emptyState: {
    title: 'Nenhuma iniciativa ainda',
    description:
      'Comece cadastrando uma palestra, workshop ou ação que você liderou para destacá-la no portfólio.',
    filteredDescription:
      'Nenhuma iniciativa corresponde aos filtros atuais.',
    unavailableResults:
      'Nenhuma iniciativa está disponível para a página atual.',
    publicSection: 'Nenhuma iniciativa foi retornada para esta seção.',
  },
  table: {
    title: 'Visão geral das iniciativas',
    description:
      'Gerencie as iniciativas que serão destacadas no seu portfólio.',
    menu: 'Menu',
  },
  values: {
    empty: '-',
    public: 'Público',
    private: 'Privado',
    from: 'De',
    to: 'Até',
  },
  carousel: {
    progress: '{{current}} de {{total}}',
  },
  overlay: {
    loading: 'Carregando os detalhes da iniciativa...',
    loadError: 'Não foi possível carregar os detalhes da iniciativa agora.',
    createdOn: 'Criada em {{date}} às {{time}}',
    summary: 'Resumo',
    details: 'Detalhes',
    images: 'Imagens',
    happenedOn: 'Aconteceu em {{date}}',
    fromTo: 'De {{start}} até {{end}}',
  },
  card: {
    highlightEyebrow: 'Iniciativas em destaque',
    untitled: 'Iniciativa sem título',
    noSummary: 'Nenhum resumo disponível.',
    noImages: 'Nenhuma imagem disponível.',
    noPeriod: 'Período não informado.',
  },
  errors: {
    translationsLoad:
      'Não foi possível carregar as traduções para verificar conflitos de locale.',
  },
};
