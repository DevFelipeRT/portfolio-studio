import type { Image } from '@/modules/images/core/types';

import { formatDimensions, formatFileSize } from '../../logic';

interface CurrentImageSectionProps {
  image: Image;
}

export function CurrentImageSection({ image }: CurrentImageSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Current image</h2>

      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr),minmax(0,3fr)]">
        <figure className="bg-muted/40 overflow-hidden rounded-md border">
          {image.url ? (
            <img
              src={image.url}
              alt={image.alt_text ?? ''}
              className="h-48 w-full object-contain"
            />
          ) : (
            <div className="text-muted-foreground flex h-48 items-center justify-center text-xs">
              No preview available for this image.
            </div>
          )}
        </figure>

        <div className="text-muted-foreground space-y-2 text-xs">
          <p>
            <span className="font-medium">Original filename:</span>{' '}
            {image.original_filename ?? '—'}
          </p>
          <p>
            <span className="font-medium">MIME type:</span>{' '}
            {image.mime_type ?? '—'}
          </p>
          <p>
            <span className="font-medium">Dimensions:</span>{' '}
            {formatDimensions(image.image_width, image.image_height) ?? '—'}
          </p>
          <p>
            <span className="font-medium">File size:</span>{' '}
            {formatFileSize(image.file_size_bytes) ?? '—'}
          </p>
          <p>
            <span className="font-medium">Storage:</span>{' '}
            {image.storage_disk ?? '—'}
            {image.storage_path && (
              <>
                {' · '}
                <span className="font-mono text-[0.7rem]">
                  {image.storage_path}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

