import { FormErrorSummary } from '@/common/forms';

import { getErrorSummaryFields } from './errorSummaryFields';
import { ContactChannelFormActions } from './partials/ContactChannelFormActions';
import { ChannelTypeField } from './partials/fields/ChannelTypeField';
import { IsActiveField } from './partials/fields/IsActiveField';
import { LabelField } from './partials/fields/LabelField';
import { LocaleField } from './partials/fields/LocaleField';
import { SortOrderField } from './partials/fields/SortOrderField';
import { ValueField } from './partials/fields/ValueField';
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
  alignActions = 'right',
}: ContactChannelFormProps) {
  const summaryFields = getErrorSummaryFields(errors);

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card space-y-6 rounded-lg border p-6 shadow-sm"
    >
      <FormErrorSummary fields={summaryFields} />

      <LocaleField
        value={data.locale}
        errors={errors}
        processing={processing}
        onChange={(value) => onChange('locale', value)}
      />

      <ChannelTypeField
        value={data.channel_type}
        errors={errors}
        channelTypes={channelTypes}
        processing={processing}
        onChange={(value) => onChange('channel_type', value)}
      />

      <LabelField
        value={data.label}
        errors={errors}
        processing={processing}
        onChange={(value) => onChange('label', value)}
      />

      <ValueField
        value={data.value}
        errors={errors}
        processing={processing}
        onChange={(value) => onChange('value', value)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SortOrderField
          value={data.sort_order}
          errors={errors}
          processing={processing}
          onChange={(value) => onChange('sort_order', value)}
        />

        <IsActiveField
          value={data.is_active}
          errors={errors}
          processing={processing}
          onChange={(value) => onChange('is_active', value)}
        />
      </div>

      <ContactChannelFormActions
        cancelHref={cancelHref}
        submitLabel={submitLabel}
        processing={processing}
        deleteHref={deleteHref}
        deleteLabel={deleteLabel}
        alignActions={alignActions}
      />
    </form>
  );
}
