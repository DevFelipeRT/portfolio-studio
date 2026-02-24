import { FormErrorSummary } from '@/common/forms';

import { getErrorSummaryFields } from './errorSummaryFields';
import { ImageFormActions } from './partials/ImageFormActions';
import { AltTextField } from './partials/fields/AltTextField';
import { CaptionField } from './partials/fields/CaptionField';
import { FileField } from './partials/fields/FileField';
import { ImageTitleField } from './partials/fields/ImageTitleField';
import { CurrentImageSection } from './partials/sections/CurrentImageSection';
import type { ImageFormProps } from './types';

/**
 * Form component used to create a new image (with upload)
 * or update global metadata of an existing image.
 */
export function ImageForm({
  mode,
  image,
  data,
  errors,
  processing,
  cancelHref,
  cancelLabel,
  submitLabel,
  onSubmit,
  onChange,
}: ImageFormProps) {
  const summaryFields = getErrorSummaryFields(errors);

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
    >
      <FormErrorSummary fields={summaryFields} />

      {mode === 'create' && (
        <section className="space-y-4">
          <h2 className="text-lg font-medium">Image file</h2>

          <FileField
            errors={errors}
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              onChange('file', file);
            }}
          />

          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs">
              Choose an image file to upload. Supported types will be validated
              on the server.
            </p>
          </div>
        </section>
      )}

      {mode === 'edit' && image && <CurrentImageSection image={image} />}

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Metadata</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <ImageTitleField
              value={data.image_title}
              errors={errors}
              processing={processing}
              onChange={(value) => onChange('image_title', value)}
            />
            <p className="text-muted-foreground text-xs">
              Optional title used when displaying the image in more prominent
              contexts.
            </p>
          </div>

          <div className="space-y-1.5">
            <AltTextField
              value={data.alt_text}
              errors={errors}
              processing={processing}
              onChange={(value) => onChange('alt_text', value)}
            />
            <p className="text-muted-foreground text-xs">
              Short, descriptive text used for accessibility and when the image
              cannot be displayed.
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <CaptionField
            value={data.caption}
            errors={errors}
            processing={processing}
            onChange={(value) => onChange('caption', value)}
          />
          <p className="text-muted-foreground text-xs">
            Longer, optional description that may be shown below the image in
            galleries or detail views.
          </p>
        </div>
      </section>

      <ImageFormActions
        cancelHref={cancelHref}
        cancelLabel={cancelLabel}
        submitLabel={submitLabel}
        processing={processing}
      />
    </form>
  );
}

