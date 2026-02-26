import {
  Form,
  FormActions,
  FormHeader,
  type FormErrors,
} from '@/common/forms';
import { CheckboxField, SelectField, TextInputField } from '@/common/forms';
import { useSupportedLocales } from '@/common/i18n';

import { getErrorSummaryFields } from './errorSummaryFields';
import type { ContactChannelFormProps } from './types';

export function ContactChannelForm({
  data,
  errors,
  channelTypes,
  processing,
  onChange,
  onSubmit,
  cancelHref,
  submitLabel,
  deleteHref,
  deleteLabel = 'Delete',
}: ContactChannelFormProps) {
  const summaryFields = getErrorSummaryFields(errors);
  const supportedLocales = useSupportedLocales();

  return (
    <Form onSubmit={onSubmit} errors={errors} errorSummaryFields={summaryFields}>

      <FormHeader
        className="min-h-6"
        title={<h2 className="sr-only">Translations</h2>}
        localeFieldProps={{
          value: data.locale,
          locales: supportedLocales,
          disabled: processing,
          errorId: 'contact-channel-locale-error',
          errors: errors as FormErrors<string>,
          onChange: (value) => onChange('locale', value),
        }}
      />

      <SelectField
        name="channel_type"
        id="channel-type"
        value={data.channel_type}
        errors={errors}
        label="Type"
        required
        disabled={processing}
        placeholder="Select a type"
        errorId="channel-type-error"
        options={channelTypes.map((type) => ({
          value: type.value,
          label: type.label,
        }))}
        onChange={(value) => onChange('channel_type', value)}
      />

      <TextInputField
        name="label"
        id="label"
        value={data.label}
        errors={errors}
        label="Label"
        placeholder="Optional label"
        disabled={processing}
        onChange={(value) => onChange('label', value)}
      />

      <TextInputField
        name="value"
        id="value"
        value={data.value}
        errors={errors}
        label="Value"
        required
        placeholder="Email, phone number, handle, or URL"
        disabled={processing}
        onChange={(value) => onChange('value', value)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <TextInputField
          name="sort_order"
          id="sort-order"
          value={data.sort_order}
          errors={errors}
          label="Order"
          type="number"
          min={0}
          disabled={processing}
          errorId="sort-order-error"
          onChange={(value) =>
            onChange('sort_order', value === '' ? '' : Number(value))
          }
        />

        <CheckboxField
          name="is_active"
          id="is-active"
          value={data.is_active}
          errors={errors}
          label="Active"
          disabled={processing}
          className="pt-6"
          onChange={(value) => onChange('is_active', value)}
        />
      </div>

      <FormActions
        cancelHref={cancelHref}
        submitLabel={submitLabel}
        processing={processing}
        deleteHref={deleteHref}
        deleteLabel={deleteLabel}
        showDeleteWhen="always"
      />
    </Form>
  );
}
