import type { TranslationTree } from '@/common/i18n/types';

const templates: TranslationTree = {
  origin: {
    generic: 'Generico',
  },
  filters: {
    label: 'Filtros',
    all: 'Todos',
    generic: 'Genericos',
    domain: 'Dominio',
    domainLabel: 'Dominio',
  },
  emptyMatch: 'Nenhum template corresponde ao filtro selecionado.',
  noDescription: 'Sem descricao',
  noSlotsRestrictions: 'Sem restricao de slots',
  collection: {
    empty: 'Nenhum item configurado. Use "Adicionar item" para criar um.',
    noItemFields:
      'Esta colecao nao possui campos de item definidos no template.',
    item: 'Item {{index}}',
  },
  helpers: {
    integerArray: 'Lista de identificadores inteiros separados por virgula.',
    integerArrayPlaceholder: '1, 2, 3',
    image:
      'Use um ID de imagem valido. Um seletor de midia dedicado pode ser integrado aqui depois.',
    imageGallery:
      'Informe IDs de imagem separados por virgula. A ordem sera usada como ordenacao da galeria.',
    richText: 'Conteudo rich text armazenado como JSON.',
  },
};

export default templates;
