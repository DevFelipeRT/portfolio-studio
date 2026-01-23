export default {
    sections: {
        details: 'Detalhes do Curso',
        timeline: 'Linha do Tempo',
        visibility: 'Visibilidade no Portfólio',
    },
    fields: {
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
    },
    actions: {
        cancel: 'Cancelar',
        save: 'Salvar Registro',
        saving: 'Salvando...',
    },
};
