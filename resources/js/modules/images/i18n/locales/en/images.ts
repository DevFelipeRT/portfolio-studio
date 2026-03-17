export default {
  page: {
    title: 'Images',
    description:
      'Centralized management of all images used across projects and initiatives.',
  },
  summary: {
    total: 'Total: {{count}}',
  },
  confirm: {
    delete:
      'Are you sure you want to delete this image? This action cannot be undone.',
  },
  emptyState: {
    title: 'No images available',
    description:
      'Start by uploading your first image. Images can be reused across projects and initiatives and managed centrally here.',
  },
  filters: {
    fields: {
      search: {
        label: 'Search',
        placeholder: 'Filename, title, caption or alt text',
      },
      usage: {
        label: 'Usage',
        placeholder: 'Any usage',
        options: {
          orphans: 'Orphans only',
          projects: 'Used by projects',
          initiatives: 'Used by initiatives',
        },
      },
      mimeType: {
        label: 'MIME type',
        placeholder: 'image/jpeg, image/png, ...',
      },
      storageDisk: {
        label: 'Storage disk',
        placeholder: 'public, s3, ...',
      },
      perPage: {
        label: 'Per page',
        placeholder: '15',
      },
    },
  },
  list: {
    titleWithId: 'Image #{{id}}',
    noPreview: 'No preview available.',
    pagination: {
      showing: 'Showing {{from}} to {{to}} of {{total}} images',
      empty: 'No images to display.',
      pageOf: 'Page {{current}} of {{total}}',
    },
  },
  dialog: {
    createdOn: 'Created on {{date}}',
    createdOnWithTime: 'Created on {{date}} at {{time}}',
    updatedOn: 'Last updated on {{date}}',
    updatedOnWithTime: 'Last updated on {{date}} at {{time}}',
    storedOnDiskAt: 'Stored on disk {{disk}} at {{path}}',
    noPreview: 'No preview available for this image.',
    sections: {
      preview: 'Preview',
      metadata: 'Metadata',
      identifiers: 'Identifiers',
    },
    fields: {
      originalFilename: 'Original filename',
      altText: 'Alt text',
      title: 'Title',
      fileSize: 'File size',
      dimensions: 'Dimensions',
      mimeType: 'MIME type',
      imageId: 'Image ID',
      storageDisk: 'Storage disk',
    },
  },
};
