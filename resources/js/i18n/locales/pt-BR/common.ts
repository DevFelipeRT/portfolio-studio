import type { TranslationTree } from '../../core/types';

const common: TranslationTree = {
    languageSwitcher: {
        ariaLabel: 'Alterar idioma (atual: {{locale}})',
        label: 'Idioma',
    },

    themeToggle: {
        label: 'Tema',
        light: 'Claro',
        dark: 'Escuro',
        system: 'Sistema',
    },

    navigation: {
        skipToContent: 'Ir para o conteúdo principal',
        openMenu: 'Abrir menu de navegação',
        closeMenu: 'Fechar menu de navegação',
        openUserMenu: 'Abrir menu do usuário',
        closeUserMenu: 'Fechar menu do usuário',
        openSidebar: 'Abrir barra lateral',
        closeSidebar: 'Fechar barra lateral',
    },

    accessibility: {
        openDialog: 'Abrir diálogo',
        closeDialog: 'Fechar diálogo',
        expandSection: 'Expandir seção',
        collapseSection: 'Recolher seção',
    },

    actions: {
        save: 'Salvar',
        cancel: 'Cancelar',
        close: 'Fechar',
        edit: 'Editar',
        delete: 'Excluir',
        submit: 'Enviar',
        view: 'Visualizar',
        viewMore: 'Ver mais',
        viewDetails: 'Ver detalhes',
        back: 'Voltar',
        next: 'Avançar',
        previous: 'Anterior',
        tryAgain: 'Tentar novamente',
        refresh: 'Atualizar',
        reset: 'Restaurar',
        clear: 'Limpar',
        apply: 'Aplicar',
        copy: 'Copiar',
        copyLink: 'Copiar link',
        share: 'Compartilhar',
        download: 'Baixar',
        openExternal: 'Abrir em nova aba',
        confirm: 'Confirmar',
        dismiss: 'Fechar aviso',
    },

    state: {
        loading: 'Carregando…',
        loadingContent: 'Carregando conteúdo…',
        empty: 'Ainda não há nada para exibir.',
        noResults: 'Nenhum resultado encontrado.',
        error: 'Algo deu errado.',
        success: 'Operação concluída com sucesso.',
        offline: 'Parece que você está sem conexão.',
        unauthorized: 'Você não tem permissão para executar esta ação.',
        notFound: 'O recurso solicitado não foi encontrado.',
    },

    labels: {
        yes: 'Sim',
        no: 'Não',
        ok: 'OK',
        optional: 'Opcional',
        required: 'Obrigatório',
        name: 'Nome',
        fullName: 'Nome completo',
        email: 'E-mail',
        password: 'Senha',
        confirmPassword: 'Confirmar senha',
        search: 'Buscar',
        filters: 'Filtros',
        status: 'Status',
        createdAt: 'Criado em',
        updatedAt: 'Atualizado em',
        actions: 'Ações',
        description: 'Descrição',
        details: 'Detalhes',
        type: 'Tipo',
        category: 'Categoria',
        language: 'Idioma',
    },

    feedback: {
        saved: 'Alterações salvas com sucesso.',
        created: 'Item criado com sucesso.',
        updated: 'Informações atualizadas.',
        deleted: 'O item foi removido.',
        sent: 'Sua mensagem foi enviada.',
        copied: 'Copiado para a área de transferência.',
        linkCopied: 'Link copiado para a área de transferência.',
        genericError: 'Não foi possível concluir a operação. Tente novamente.',
    },

    validation: {
        required: 'Este campo é obrigatório.',
        invalidEmail: 'Informe um endereço de e-mail válido.',
        minLength: 'Use pelo menos {{min}} caracteres.',
        maxLength: 'Use no máximo {{max}} caracteres.',
        betweenLength: 'Use entre {{min}} e {{max}} caracteres.',
        pattern: 'O valor não corresponde ao formato esperado.',
        oneOf: 'Selecione uma das opções disponíveis.',
        mismatch: 'Os valores não correspondem.',
    },

    pagination: {
        label: 'Paginação',
        previousPage: 'Página anterior',
        nextPage: 'Próxima página',
        pageOf: 'Página {{page}} de {{total}}',
        results: '{{count}} resultados',
        resultsWithRange: '{{from}}–{{to}} de {{total}} resultados',
        itemsPerPage: 'Itens por página',
    },

    dateTime: {
        today: 'Hoje',
        yesterday: 'Ontem',
        tomorrow: 'Amanhã',
        justNow: 'Agora mesmo',
        minutesAgo: 'Há {{count}} minutos',
        hoursAgo: 'Há {{count}} horas',
        daysAgo: 'Há {{count}} dias',
    },

    form: {
        submit: 'Enviar',
        reset: 'Restaurar formulário',
        clear: 'Limpar campos',
        optionalHint: 'Campo opcional',
        requiredHint: 'Campo obrigatório',
        searchPlaceholder: 'Digite para buscar…',
        selectPlaceholder: 'Selecione uma opção',
        multiSelectPlaceholder: 'Selecione uma ou mais opções',
    },

    table: {
        empty: 'Nenhum registro para exibir.',
        loading: 'Carregando linhas…',
        sortAscending: 'Ordenar de forma crescente',
        sortDescending: 'Ordenar de forma decrescente',
        noSortableColumns: 'A ordenação não está disponível para esta tabela.',
    },

    dialog: {
        confirmTitle: 'Confirmar ação',
        confirmMessage:
            'Tem certeza de que deseja continuar? Esta operação não poderá ser desfeita.',
        confirmAction: 'Confirmar',
        cancelAction: 'Cancelar',
    },

    contact: {
        socials: {
            email: {
                label: 'E-mail',
            },
            github: {
                label: 'GitHub',
            },
            linkedin: {
                label: 'LinkedIn',
            },
            whatsapp: {
                label: 'WhatsApp',
            },
            phone: {
                label: 'Celular',
            },
        },
    },
};

export default common;
