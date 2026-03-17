import { TextareaField, TextInputField, type FormErrors } from '@/common/forms';
import type { ImageFormData } from '@/modules/images/core/forms';
import { IMAGES_NAMESPACES, useImagesTranslation } from '@/modules/images/i18n';

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
  const { translate: tForm } = useImagesTranslation(IMAGES_NAMESPACES.form);

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">{tForm('sections.metadata.title')}</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <TextInputField
            name="image_title"
            id="image-title"
            value={data.image_title}
            errors={errors}
            label={tForm('fields.image_title.label')}
            disabled={processing}
            errorId="image-title-error"
            onChange={(value) => onChange('image_title', value)}
          />
          <p className="text-muted-foreground text-xs">
            {tForm('fields.image_title.help')}
          </p>
        </div>

        <div className="space-y-1.5">
          <TextInputField
            name="alt_text"
            id="image-alt-text"
            value={data.alt_text}
            errors={errors}
            label={tForm('fields.alt_text.label')}
            required
            disabled={processing}
            errorId="image-alt-text-error"
            onChange={(value) => onChange('alt_text', value)}
          />
          <p className="text-muted-foreground text-xs">
            {tForm('fields.alt_text.help')}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <TextareaField
          name="caption"
          id="image-caption"
          value={data.caption}
          errors={errors}
          label={tForm('fields.caption.label')}
          disabled={processing}
          rows={3}
          errorId="image-caption-error"
          onChange={(value) => onChange('caption', value)}
        />
        <p className="text-muted-foreground text-xs">
          {tForm('fields.caption.help')}
        </p>
      </div>
    </section>
  );
}
