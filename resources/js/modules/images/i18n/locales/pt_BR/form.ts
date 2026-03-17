export default {
  sections: {
    file: {
      title: 'Arquivo da imagem',
      help: 'Escolha um arquivo de imagem para envio. Os tipos suportados serao validados no servidor.',
    },
    metadata: {
      title: 'Metadados',
    },
    currentImage: {
      title: 'Imagem atual',
      information: 'Informacoes',
      noPreview: 'Nenhuma pre-visualizacao disponivel para esta imagem.',
      fields: {
        originalFilename: 'Nome original do arquivo',
        mimeType: 'Tipo MIME',
        dimensions: 'Dimensoes',
        fileSize: 'Tamanho do arquivo',
        storage: 'Armazenamento',
      },
    },
  },
  fields: {
    file: {
      label: 'Arquivo',
      placeholder: 'Selecione um arquivo',
    },
    image_title: {
      label: 'Titulo',
      help: 'Titulo opcional usado ao exibir a imagem em contextos mais destacados.',
    },
    alt_text: {
      label: 'Texto alternativo',
      help: 'Texto curto e descritivo usado para acessibilidade e quando a imagem nao puder ser exibida.',
    },
    caption: {
      label: 'Legenda',
      help: 'Descricao opcional mais longa que pode ser exibida abaixo da imagem em galerias ou visualizacoes detalhadas.',
    },
  },
  values: {
    empty: '-',
  },
};
