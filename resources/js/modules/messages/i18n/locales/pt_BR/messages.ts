export default {
  page: {
    title: 'Mensagens',
    headerTitle: 'Mensagens de contato',
    headerDescription: 'Mensagens recebidas pelo formulario principal do portfolio.',
    total: 'Total: {{count}}',
  },
  emptyState: {
    description: 'Nenhuma mensagem foi recebida ainda.',
  },
  table: {
    title: 'Caixa de entrada',
    description: 'Revise e gerencie as mensagens enviadas pela sua landing page.',
    columns: {
      from: 'Remetente',
      message: 'Mensagem',
      status: 'Status',
      when: 'Quando',
      menu: 'Menu',
    },
  },
  status: {
    new: 'Nova',
    seen: 'Vista',
    unseen: 'Nao vista',
    important: 'Importante',
    regular: 'Regular',
  },
  overlay: {
    title: 'Mensagem de contato',
    from: 'De {{name}}',
    receivedOn: 'Recebida em {{date}} as {{time}}',
    messageLabel: 'Mensagem',
  },
  confirm: {
    delete: 'Tem certeza de que deseja excluir esta mensagem?',
  },
};
