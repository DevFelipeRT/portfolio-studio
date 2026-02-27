import {
  Form,
  FormActions,
} from '@/common/forms';

import { getErrorSummaryFields } from './errorSummaryFields';
import { CurrentImageSection } from './partials/CurrentImageSection';
import { MetadataSection } from './partials/MetadataSection';
import { SelectImageFileSection } from './partials/SelectImageFileSection';
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
    <Form
      onSubmit={onSubmit}
      errors={errors}
      variant="spacious"
      errorSummaryFields={summaryFields}
    >

      {mode === 'create' && (
        <SelectImageFileSection
          errors={errors}
          onChange={(file) => onChange('file', file)}
        />
      )}

      {mode === 'edit' && image && <CurrentImageSection image={image} />}

      <MetadataSection
        data={data}
        errors={errors}
        processing={processing}
        onChange={onChange}
      />

      <FormActions
        as="section"
        borderedTop
        cancelHref={cancelHref}
        cancelLabel={cancelLabel}
        submitLabel={submitLabel}
        processing={processing}
      />
    </Form>
  );
}
