import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import type { FormErrors } from '@/common/forms';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import type { ContactChannelFormData } from '@/modules/contact-channels/core/forms';
import type { ContactChannelTypeOption } from '@/modules/contact-channels/core/types';
import { useContactChannelsTranslation } from '@/modules/contact-channels/i18n';
import { CONTACT_CHANNELS_NAMESPACES } from '@/modules/contact-channels/i18n';
import { ContactChannelForm } from '@/modules/contact-channels/ui/form/contact-channel';
import React from 'react';

interface CreateContactChannelProps {
  channelTypes: ContactChannelTypeOption[];
}

export default function Create({ channelTypes }: CreateContactChannelProps) {
  const { data, setData, post, processing } =
    usePageForm<ContactChannelFormData>({
      locale: '',
      channel_type: channelTypes[0]?.value ?? '',
      label: '',
      value: '',
      is_active: true,
      sort_order: 0,
    });
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof ContactChannelFormData>;
  }>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    post(route('contact-channels.store'), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleChange = (
    field: keyof ContactChannelFormData,
    value: string | number | boolean | '',
  ): void => {
    setData(field, value as never);
  };

  return (
    <AuthenticatedLayout header={<CreateContactChannelHeader />}>
      <CreateContactChannelContent
        channelTypes={channelTypes}
        data={data}
        formErrors={formErrors}
        processing={processing}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </AuthenticatedLayout>
  );
}

Create.i18n = ['contact-channels'];

function CreateContactChannelHeader() {
  const { translate: tActions } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.actions,
  );
  return (
    <h1 className="text-xl leading-tight font-semibold">
      {tActions('newChannel')}
    </h1>
  );
}

type CreateContactChannelContentProps = {
  channelTypes: ContactChannelTypeOption[];
  data: ContactChannelFormData;
  formErrors: FormErrors<keyof ContactChannelFormData>;
  processing: boolean;
  onChange: (
    field: keyof ContactChannelFormData,
    value: string | number | boolean | '',
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

function CreateContactChannelContent({
  channelTypes,
  data,
  formErrors,
  processing,
  onChange,
  onSubmit,
}: CreateContactChannelContentProps) {
  const { translate: tActions } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.actions,
  );

  return (
    <>
      <PageHead title={tActions('newChannel')} />

      <div className="overflow-hidden">
        <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4">
            <PageLink
              href={route('contact-channels.index')}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              {tActions('backToIndex')}
            </PageLink>
          </div>

          <ContactChannelForm
            data={data}
            errors={formErrors}
            channelTypes={channelTypes}
            processing={processing}
            onChange={onChange}
            onSubmit={onSubmit}
            cancelHref={route('contact-channels.index')}
            submitLabel={tActions('save')}
          />
        </div>
      </div>
    </>
  );
}
