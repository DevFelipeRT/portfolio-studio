import { TextareaField, TextInputField, type FormErrors } from '@/common/forms';
import type { ImageFormData } from '@/modules/images/core/forms';

type MetadataSectionProps = {
  data: ImageFormData;
  errors: FormErrors<keyof ImageFormData>;
  processing: boolean;
  onChange<K extends keyof ImageFormData>(field: K, value: ImageFormData[K]): void;
};

export function MetadataSection({
  data,
  errors,
  processing,
  onChange,
}: MetadataSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Metadata</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <TextInputField
            name="image_title"
            id="image-title"
            value={data.image_title}
            errors={errors}
            label="Title"
            disabled={processing}
            errorId="image-title-error"
            onChange={(value) => onChange('image_title', value)}
          />
          <p className="text-muted-foreground text-xs">
            Optional title used when displaying the image in more prominent
            contexts.
          </p>
        </div>

        <div className="space-y-1.5">
          <TextInputField
            name="alt_text"
            id="image-alt-text"
            value={data.alt_text}
            errors={errors}
            label="Alt text"
            required
            disabled={processing}
            errorId="image-alt-text-error"
            onChange={(value) => onChange('alt_text', value)}
          />
          <p className="text-muted-foreground text-xs">
            Short, descriptive text used for accessibility and when the image
            cannot be displayed.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <TextareaField
          name="caption"
          id="image-caption"
          value={data.caption}
          errors={errors}
          label="Caption"
          disabled={processing}
          rows={3}
          errorId="image-caption-error"
          onChange={(value) => onChange('caption', value)}
        />
        <p className="text-muted-foreground text-xs">
          Longer, optional description that may be shown below the image in
          galleries or detail views.
        </p>
      </div>
    </section>
  );
}

