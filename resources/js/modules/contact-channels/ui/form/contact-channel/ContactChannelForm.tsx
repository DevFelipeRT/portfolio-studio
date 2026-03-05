import {
  Form,
  FormActions,
  FormHeader,
  type FormErrors,
} from '@/common/forms';
import { CheckboxField, SelectField, TextInputField } from '@/common/forms';
import { useSupportedLocales } from '@/common/locale';
import { useContactChannelsTranslation } from '@/modules/contact-channels/i18n';
import { CONTACT_CHANNELS_NAMESPACES } from '@/modules/contact-channels/i18n';

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
  deleteLabel,
}: ContactChannelFormProps) {
  const { translate: tForm } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.form,
  );
  const { translate: tActions } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.actions,
  );
  const summaryFields = getErrorSummaryFields(errors, tForm);
  const supportedLocales = useSupportedLocales();
  const resolvedDeleteLabel = deleteLabel ?? tActions('delete');

  return (
    <Form onSubmit={onSubmit} errors={errors} errorSummaryFields={summaryFields}>

      <FormHeader
        className="min-h-6"
        title={<h2 className="sr-only">{tForm('sections.managementTitle')}</h2>}
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
        label={tForm('fields.channel_type.label')}
        required
        disabled={processing}
        placeholder={tForm('fields.channel_type.placeholder')}
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
        label={tForm('fields.label.label')}
        placeholder={tForm('fields.label.placeholder')}
        disabled={processing}
        onChange={(value) => onChange('label', value)}
      />

      <TextInputField
        name="value"
        id="value"
        value={data.value}
        errors={errors}
        label={tForm('fields.value.label')}
        required
        placeholder={tForm('fields.value.placeholder')}
        disabled={processing}
        onChange={(value) => onChange('value', value)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <TextInputField
          name="sort_order"
          id="sort-order"
          value={data.sort_order}
          errors={errors}
          label={tForm('fields.sort_order.label')}
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
          label={tForm('fields.is_active.label')}
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
        deleteLabel={resolvedDeleteLabel}
        showDeleteWhen="always"
      />
    </Form>
  );
}
