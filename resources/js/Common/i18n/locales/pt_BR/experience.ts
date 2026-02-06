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
        fields: {
            locale: 'Locale',
            position: 'Cargo',
            company: 'Empresa',
            summary: 'Resumo',
            description: 'Descrição',
        },
        placeholders: {
            position: 'Cargo traduzido',
            company: 'Empresa traduzida',
            summary: 'Resumo traduzido',
            description: 'Descrição traduzida',
        },
        actions: {
            back: 'Voltar',
            save: 'Salvar',
            edit: 'Editar',
            add: 'Adicionar',
            close: 'Fechar',
        },
        errors: {
            localeRequired: 'Selecione um locale.',
            atLeastOne: 'Informe ao menos um campo traduzido.',
        },
        confirmBaseLocaleSwitch: 'Alterar o locale base para {{locale}} excluirá a tradução existente para esse locale. Deseja continuar?',
    },
    fields: {
        locale: {
            label: 'Locale base',
            placeholder: 'Selecione um locale',
        },
    },
};
