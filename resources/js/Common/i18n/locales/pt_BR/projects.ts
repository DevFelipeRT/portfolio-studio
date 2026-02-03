export default {
    translations: {
        title: 'Traduções',
        subtitle: 'Gerencie as traduções de',
        manage: 'Gerenciar traduções',
        existing: 'Traduções existentes',
        empty: 'Nenhuma tradução ainda.',
        add: 'Adicionar tradução',
        allCovered: 'Todos os locales suportados já possuem traduções.',
        loading: 'Carregando traduções...',
        confirmDelete: 'Excluir tradução de {{locale}}?',
        confirmBaseLocaleSwitch:
            'Alterar o locale base para {{locale}} excluirá a tradução existente para esse locale. Deseja continuar?',
        fields: {
            locale: 'Locale',
            name: 'Nome do projeto',
            summary: 'Resumo',
            description: 'Descrição',
        },
        placeholders: {
            name: 'Nome do projeto traduzido',
            summary: 'Resumo traduzido',
            description: 'Descrição traduzida',
        },
        actions: {
            save: 'Salvar',
            add: 'Adicionar',
            close: 'Fechar',
        },
        errors: {
            localeRequired: 'Selecione um locale.',
            atLeastOne: 'Informe ao menos um campo traduzido.',
        },
    },
    fields: {
        locale: {
            label: 'Locale base',
            placeholder: 'Selecione um locale',
        },
    },
};
