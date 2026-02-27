import { Badge } from '@/components/ui/badge';
import type { Image } from '@/modules/images/core/types';

import { formatDimensions, formatFileSize } from '../utils';

interface CurrentImageSectionProps {
  image: Image;
}

function isPublicStorageVariant(disk: string | null): disk is string {
  if (!disk) {
    return false;
  }

  return /(^|[-_.])public($|[-_.])/i.test(disk.trim());
}

export function CurrentImageSection({ image }: CurrentImageSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Current image</h2>

      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
        <figure className="bg-muted/40 min-h-72 overflow-hidden rounded-md border">
          {image.url ? (
            <img
              src={image.url}
              alt={image.alt_text ?? ''}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex h-full min-h-72 items-center justify-center text-xs">
              No preview available for this image.
            </div>
          )}
        </figure>

        <section className="h-full space-y-4 p-1" aria-labelledby="current-image-information">
          <h3 id="current-image-information" className="text-sm font-semibold">
            Information
          </h3>

          <dl className="grid gap-3 text-sm">
            <div className="space-y-1">
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Original filename
              </dt>
              <dd className="text-foreground break-all">
                {image.original_filename ?? '—'}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                MIME type
              </dt>
              <dd className="text-foreground">{image.mime_type ?? '—'}</dd>
            </div>

            <div className="space-y-1">
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Dimensions
              </dt>
              <dd className="text-foreground">
                {formatDimensions(image.image_width, image.image_height) ?? '—'}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                File size
              </dt>
              <dd className="text-foreground">
                {formatFileSize(image.file_size_bytes) ?? '—'}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                <span>Storage</span>
                {isPublicStorageVariant(image.storage_disk) && (
                  <Badge variant="outline" className="text-xs normal-case">
                    {image.storage_disk}
                  </Badge>
                )}
              </dt>
              <dd className="text-foreground space-y-1">
                {!isPublicStorageVariant(image.storage_disk) && (
                  <p>{image.storage_disk ?? '—'}</p>
                )}
                {image.storage_path && (
                  <p className="font-mono text-xs [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [overflow-wrap:anywhere] overflow-hidden">
                    {image.storage_path}
                  </p>
                )}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  );
}
