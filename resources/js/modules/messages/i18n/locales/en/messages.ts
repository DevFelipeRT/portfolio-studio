export default {
  page: {
    title: 'Messages',
    headerTitle: 'Contact messages',
    headerDescription: 'Messages received from the portfolio landing form.',
    total: 'Total: {{count}}',
  },
  emptyState: {
    description: 'No messages have been received yet.',
  },
  table: {
    title: 'Inbox',
    description: 'Review and manage messages sent from your landing page.',
    columns: {
      from: 'From',
      message: 'Message',
      status: 'Status',
      when: 'When',
      menu: 'Menu',
    },
  },
  status: {
    new: 'New',
    seen: 'Seen',
    unseen: 'Unseen',
    important: 'Important',
    regular: 'Regular',
  },
  overlay: {
    title: 'Contact message',
    from: 'From {{name}}',
    receivedOn: 'Received on {{date}} at {{time}}',
    messageLabel: 'Message',
  },
  confirm: {
    delete: 'Are you sure you want to delete this message?',
  },
};
