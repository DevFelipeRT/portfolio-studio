export default {
  fields: {
    locale: {
      label: 'Locale',
      placeholder: 'Selecione um locale',
      error: 'Locale é obrigatório',
    },
    name: {
      label: 'Título do Curso',
      placeholder: 'ex: Padrões React Avançados',
      error: 'O título do curso é obrigatório',
    },
    institution: {
      label: 'Provedor / Instituição',
      placeholder: 'ex: Udemy, Coursera, USP',
      error: 'A instituição é obrigatória',
    },
    category: {
      label: 'Categoria',
      placeholder: 'Selecione uma categoria',
      error: 'A categoria é obrigatória',
    },
    summary: {
      label: 'Resumo',
      placeholder: 'Visão geral breve para cartões e listas',
      error: 'O resumo é obrigatório',
    },
    description: {
      label: 'Descrição Completa',
      placeholder: 'Conteúdo detalhado ou principais aprendizados',
      error: 'A descrição é obrigatória',
    },
    started_at: {
      label: 'Data de Início',
      error: 'Data de início inválida',
    },
    completed_at: {
      label: 'Data de Conclusão',
      error: 'Data de conclusão inválida',
    },
    display: {
      label: 'Visível publicamente no portfólio',
    },
    status: {
      label: 'Status',
    },
    visibility: {
      label: 'Visibilidade',
    },
    actions: {
      label: 'Ações',
    },
  },
  help: {
    managementSubtitle: 'Gerencie os cursos exibidos no seu portfólio.',
  },
  emptyState: {
    index: 'Nenhum curso foi criado ainda.',
  },
  table: {
    title: 'Todos os cursos',
    description: 'Uma lista de todos os cursos e certificados cadastrados.',
    columns: {
      course: 'Curso',
      started_at: 'Data de início',
      completed_at: 'Data de término',
    },
  },
  status: {
    planned: 'Planejado',
    in_progress: 'Em andamento',
    completed: 'Concluído',
  },
  visibility: {
    public: 'Público',
    private: 'Privado',
    hidden: 'Oculto',
    notHighlighted: 'Não destacado no momento',
  },
  overlay: {
    about: 'Sobre o curso',
    noDescription: 'Nenhuma descrição detalhada foi informada.',
  },
  values: {
    empty: '\u2014',
    present: 'Atual',
  },
  errors: {
    translationsLoad:
      'Não foi possível carregar as traduções para verificar conflitos de locale.',
  },
};
