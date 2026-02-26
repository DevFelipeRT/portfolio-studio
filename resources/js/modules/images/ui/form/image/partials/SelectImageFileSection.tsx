import { FileInputField, type FormErrors } from '@/common/forms';
import type { ImageFormData } from '@/modules/images/core/forms';

type SelectImageFileSectionProps = {
  errors: FormErrors<keyof ImageFormData>;
  onChange(file: File | null): void;
};

export function SelectImageFileSection({
  errors,
  onChange,
}: SelectImageFileSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Image file</h2>

      <FileInputField
        name="file"
        id="image-file"
        errors={errors}
        label="File"
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
          Choose an image file to upload. Supported types will be validated on
          the server.
        </p>
      </div>
    </section>
  );
}
