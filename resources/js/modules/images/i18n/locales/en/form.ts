export default {
  sections: {
    file: {
      title: 'Image file',
      help: 'Choose an image file to upload. Supported types will be validated on the server.',
    },
    metadata: {
      title: 'Metadata',
    },
    currentImage: {
      title: 'Current image',
      information: 'Information',
      noPreview: 'No preview available for this image.',
      fields: {
        originalFilename: 'Original filename',
        mimeType: 'MIME type',
        dimensions: 'Dimensions',
        fileSize: 'File size',
        storage: 'Storage',
      },
    },
  },
  fields: {
    file: {
      label: 'File',
      placeholder: 'Select file',
    },
    image_title: {
      label: 'Title',
      help: 'Optional title used when displaying the image in more prominent contexts.',
    },
    alt_text: {
      label: 'Alt text',
      help: 'Short, descriptive text used for accessibility and when the image cannot be displayed.',
    },
    caption: {
      label: 'Caption',
      help: 'Longer, optional description that may be shown below the image in galleries or detail views.',
    },
  },
  values: {
    empty: '-',
  },
};
