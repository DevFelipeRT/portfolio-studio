export default {
  page: {
    title: 'Imagens',
    description:
      'Gestao centralizada de todas as imagens usadas em projetos e iniciativas.',
  },
  summary: {
    total: 'Total: {{count}}',
  },
  confirm: {
    delete:
      'Tem certeza de que deseja excluir esta imagem? Esta acao nao pode ser desfeita.',
  },
  emptyState: {
    title: 'Nenhuma imagem disponivel',
    description:
      'Comece enviando sua primeira imagem. As imagens podem ser reutilizadas em projetos e iniciativas e gerenciadas centralmente aqui.',
  },
  filters: {
    fields: {
      search: {
        label: 'Busca',
        placeholder: 'Nome do arquivo, titulo, legenda ou texto alternativo',
      },
      usage: {
        label: 'Uso',
        placeholder: 'Qualquer uso',
        options: {
          orphans: 'Somente orfas',
          projects: 'Usadas em projetos',
          initiatives: 'Usadas em iniciativas',
        },
      },
      mimeType: {
        label: 'Tipo MIME',
        placeholder: 'image/jpeg, image/png, ...',
      },
      storageDisk: {
        label: 'Disco de armazenamento',
        placeholder: 'public, s3, ...',
      },
      perPage: {
        label: 'Por pagina',
        placeholder: '15',
      },
    },
  },
  list: {
    titleWithId: 'Imagem #{{id}}',
    noPreview: 'Nenhuma pre-visualizacao disponivel.',
    pagination: {
      showing: 'Exibindo {{from}} a {{to}} de {{total}} imagens',
      empty: 'Nenhuma imagem para exibir.',
      pageOf: 'Pagina {{current}} de {{total}}',
    },
  },
  dialog: {
    createdOn: 'Criada em {{date}}',
    createdOnWithTime: 'Criada em {{date}} as {{time}}',
    updatedOn: 'Atualizada em {{date}}',
    updatedOnWithTime: 'Atualizada em {{date}} as {{time}}',
    storedOnDiskAt: 'Armazenada no disco {{disk}} em {{path}}',
    noPreview: 'Nenhuma pre-visualizacao disponivel para esta imagem.',
    sections: {
      preview: 'Pre-visualizacao',
      metadata: 'Metadados',
      identifiers: 'Identificadores',
    },
    fields: {
      originalFilename: 'Nome original do arquivo',
      altText: 'Texto alternativo',
      title: 'Titulo',
      fileSize: 'Tamanho do arquivo',
      dimensions: 'Dimensoes',
      mimeType: 'Tipo MIME',
      imageId: 'ID da imagem',
      storageDisk: 'Disco de armazenamento',
    },
  },
};
