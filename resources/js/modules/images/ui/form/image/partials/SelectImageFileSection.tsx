import { FileInputField, type FormErrors } from '@/common/forms';
import type { ImageFormData } from '@/modules/images/core/forms';
import { IMAGES_NAMESPACES, useImagesTranslation } from '@/modules/images/i18n';

type SelectImageFileSectionProps = {
  errors: FormErrors<keyof ImageFormData>;
  onChange(file: File | null): void;
};

export function SelectImageFileSection({
  errors,
  onChange,
}: SelectImageFileSectionProps) {
  const { translate: tForm } = useImagesTranslation(IMAGES_NAMESPACES.form);

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">{tForm('sections.file.title')}</h2>

      <FileInputField
        name="file"
        id="image-file"
        errors={errors}
        label={tForm('fields.file.label')}
        placeholder={tForm('fields.file.placeholder')}
        required
        accept="image/*"
        errorId="image-file-error"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;
          onChange(file);
        }}
      />

      <div className="space-y-1.5">
        <p className="text-muted-foreground text-xs">
          {tForm('sections.file.help')}
        </p>
      </div>
    </section>
  );
}
