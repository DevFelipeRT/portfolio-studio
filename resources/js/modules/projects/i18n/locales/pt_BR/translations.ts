export default {
  title: 'Traduções',
  subtitle: 'Gerencie as traduções de',
  manage: 'Gerenciar traduções',
  existing: 'Traduções existentes',
  empty: 'Nenhuma tradução ainda.',
  add: 'Adicionar tradução',
  addPanelTitle: 'Adicionar tradução',
  editPanelTitle: 'Editar tradução em {{locale}}',
  allCovered: 'Todos os locales suportados já possuem traduções.',
  loading: 'Carregando traduções...',
  confirmDelete: 'Excluir tradução de {{locale}}?',
  confirmBaseLocaleSwitch:
    'Alterar o locale base para {{locale}} excluirá a tradução existente para esse locale. Deseja continuar?',
  fields: {
    locale: 'Idioma da tradução',
    name: 'Nome traduzido',
    summary: 'Resumo traduzido',
    description: 'Descrição traduzida',
    status: 'Status',
  },
  placeholders: {
    locale: 'Escolha o idioma desta tradução',
    name: 'Use o nome do projeto como ele deve aparecer nesse idioma',
    summary: 'Escreva um resumo curto que soe natural para esse idioma',
    description:
      'Adapte a descrição completa para esse idioma, preservando contexto e intenção',
    status: 'Status traduzido',
  },
  actions: {
    back: 'Voltar',
    cancel: 'Cancelar',
    save: 'Salvar',
    edit: 'Editar',
    add: 'Adicionar',
    close: 'Fechar',
  },
  errors: {
    localeRequired: 'Selecione um locale.',
    atLeastOne: 'Informe ao menos um campo traduzido.',
    unexpected: 'Erro inesperado. Tente novamente.',
  },
};
