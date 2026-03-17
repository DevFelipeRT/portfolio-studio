export default {
  fields: {
    locale: { label: 'Locale base', placeholder: 'Selecione um locale' },
    name: { label: 'Nome' },
    start_date: { label: 'Data de início', placeholder: 'Selecione uma data' },
    end_date: { label: 'Data de término', placeholder: 'Selecione uma data' },
    summary: { label: 'Resumo' },
    description: { label: 'Descrição' },
    display: { label: 'Exibir na página inicial' },
    images: { label: 'Imagens', empty: 'Nenhuma imagem adicionada ainda.' },
    updated_at: { label: 'Atualizado em' },
    actions: { label: 'Ações' },
    display_count: { label: 'Exibição' },
    period: { label: 'Data / Período' },
    image_count: { label: 'Imagens' },
  },
  help: {
    managementSubtitle:
      'Atividades que você liderou, como palestras, workshops e ações comunitárias.',
  },
  stats: {
    total: 'Total: {{count}}',
    visible: 'Visíveis: {{count}}',
  },
  emptyState: {
    title: 'Nenhuma iniciativa ainda',
    description:
      'Comece cadastrando uma palestra, workshop ou ação que você liderou para destacá-la no portfólio.',
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
    visible: 'Visível',
    hidden: 'Oculta',
    from: 'De',
    to: 'Até',
  },
  overlay: {
    createdOn: 'Criada em {{date}} às {{time}}',
    summary: 'Resumo',
    details: 'Detalhes',
    images: 'Imagens',
    happenedOn: 'Aconteceu em {{date}}',
    fromTo: 'De {{start}} até {{end}}',
  },
  card: {
    highlightEyebrow: 'Iniciativas em destaque',
  },
  errors: {
    translationsLoad:
      'Não foi possível carregar as traduções para verificar conflitos de locale.',
  },
};
