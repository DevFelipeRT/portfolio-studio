export default {
  fields: {
    locale: {
      label: 'Locale base',
      placeholder: 'Selecione um locale',
    },
    position: {
      label: 'Cargo',
    },
    company: {
      label: 'Empresa',
    },
    summary: {
      label: 'Resumo',
    },
    description: {
      label: 'Descrição',
    },
    start_date: {
      label: 'Data de início',
    },
    end_date: {
      label: 'Data de término',
    },
    display: {
      label: 'Exibir no portfólio',
    },
    visibility: {
      label: 'Visibilidade',
    },
    period: {
      label: 'Período',
    },
    created_at: {
      label: 'Criado em',
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
      'Gerencie as experiências exibidas no seu portfólio e nas seções do currículo.',
  },
  filters: {
    searchLabel: 'Buscar',
    searchPlaceholder: 'Buscar por cargo, empresa ou resumo',
    searchSubmit: 'Buscar experiências',
    visibilityLabel: 'Visibilidade',
    visibilityPlaceholder: 'Todos os estados de visibilidade',
    publicOnly: 'Somente públicas',
    privateOnly: 'Somente privadas',
    reset: 'Limpar',
  },
  emptyState: {
    index: 'Nenhuma experiência foi criada ainda.',
  },
  values: {
    empty: '\u2014',
  },
  visibility: {
    public: 'Público',
    private: 'Privado',
  },
  status: {
    editing: 'Editando: {{position}} em {{company}}',
  },
  errors: {
    translationsLoad:
      'Não foi possível carregar as traduções para verificar conflitos de locale.',
  },
};
