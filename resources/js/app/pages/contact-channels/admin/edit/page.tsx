import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import type { FormErrors } from '@/common/forms';
import { LocaleSwapDialog } from '@/common/LocaleSwapDialog';
import { Button } from '@/components/ui/button';
import { listContactChannelTranslations } from '@/modules/contact-channels/core/api/translations';
import type { ContactChannelFormData } from '@/modules/contact-channels/core/forms';
import type {
  ContactChannel,
  ContactChannelTypeOption,
} from '@/modules/contact-channels/core/types';
import {
  ContactChannelsI18nProvider,
  useContactChannelsTranslation,
} from '@/modules/contact-channels/i18n';
import { CONTACT_CHANNELS_NAMESPACES } from '@/modules/contact-channels/i18n';
import { ContactChannelForm } from '@/modules/contact-channels/ui/form/contact-channel';
import { TranslationModal } from '@/modules/contact-channels/ui/TranslationModal';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

interface EditContactChannelProps {
  channel: ContactChannel;
  channelTypes: ContactChannelTypeOption[];
}

export default function Edit({
  channel,
  channelTypes,
}: EditContactChannelProps) {
  const [showTranslations, setShowTranslations] = React.useState(false);
  const [swapDialogOpen, setSwapDialogOpen] = React.useState(false);
  const [pendingLocale, setPendingLocale] = React.useState<string | null>(null);
  const [translationLocales, setTranslationLocales] = React.useState<string[]>(
    [],
  );

  const { data, setData, put, processing } =
    useForm<ContactChannelFormData>({
      locale: channel.locale,
      confirm_swap: false,
      channel_type: channel.channel_type,
      label: channel.label ?? '',
      value: channel.value,
      is_active: channel.is_active,
      sort_order: channel.sort_order,
    });
  const { errors: formErrors } = usePage().props as {
    errors: FormErrors<keyof ContactChannelFormData>;
  };

  React.useEffect(() => {
    let mounted = true;

    const loadTranslations = async (): Promise<void> => {
      try {
        const items = await listContactChannelTranslations(channel.id);
        if (mounted) {
          setTranslationLocales(
            items.map((item) => item.locale).filter(Boolean),
          );
        }
      } catch {
        // Locale conflict checks are optional in this flow.
      }
    };

    void loadTranslations();

    return () => {
      mounted = false;
    };
  }, [channel.id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    put(route('contact-channels.update', channel.id), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleChange = (
    field: keyof ContactChannelFormData,
    value: string | number | boolean | '',
  ): void => {
    if (field === 'locale' && typeof value === 'string') {
      if (value !== data.locale && translationLocales.includes(value)) {
        setPendingLocale(value);
        setSwapDialogOpen(true);
        return;
      }

      setData('confirm_swap', false);
    }

    setData(field, value as never);
  };

  return (
    <ContactChannelsI18nProvider>
      <AuthenticatedLayout header={<EditContactChannelHeader />}>
        <EditContactChannelContent
          channel={channel}
          channelTypes={channelTypes}
          data={data}
          formErrors={formErrors}
          processing={processing}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onOpenTranslations={() => setShowTranslations(true)}
        />

        <TranslationModal
          open={showTranslations}
          onClose={() => setShowTranslations(false)}
          contactChannelId={channel.id}
          entityLabel={channel.label ?? channel.channel_type}
          baseLocale={data.locale}
        />

        {pendingLocale && (
          <LocaleSwapDialog
            open={swapDialogOpen}
            currentLocale={data.locale}
            nextLocale={pendingLocale}
            onConfirmSwap={() => {
              setData('confirm_swap', true);
              setData('locale', pendingLocale);
              setSwapDialogOpen(false);
              setPendingLocale(null);
            }}
            onConfirmNoSwap={() => {
              setData('confirm_swap', false);
              setData('locale', pendingLocale);
              setSwapDialogOpen(false);
              setPendingLocale(null);
            }}
            onCancel={() => {
              setSwapDialogOpen(false);
              setPendingLocale(null);
            }}
          />
        )}
      </AuthenticatedLayout>
    </ContactChannelsI18nProvider>
  );
}

function EditContactChannelHeader() {
  const { translate: tActions } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.actions,
  );
  return (
    <h1 className="text-xl leading-tight font-semibold">
      {tActions('editChannel')}
    </h1>
  );
}

type EditContactChannelContentProps = {
  channel: ContactChannel;
  channelTypes: ContactChannelTypeOption[];
  data: ContactChannelFormData;
  formErrors: FormErrors<keyof ContactChannelFormData>;
  processing: boolean;
  onChange: (
    field: keyof ContactChannelFormData,
    value: string | number | boolean | '',
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onOpenTranslations: () => void;
};

function EditContactChannelContent({
  channel,
  channelTypes,
  data,
  formErrors,
  processing,
  onChange,
  onSubmit,
  onOpenTranslations,
}: EditContactChannelContentProps) {
  const { translate: tActions } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.actions,
  );

  return (
    <>
      <Head title={tActions('editChannel')} />

      <div className="overflow-hidden">
        <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link
              href={route('contact-channels.index')}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              {tActions('backToIndex')}
            </Link>
          </div>

          <ContactChannelForm
            data={data}
            errors={formErrors}
            channelTypes={channelTypes}
            processing={processing}
            onChange={onChange}
            onSubmit={onSubmit}
            cancelHref={route('contact-channels.index')}
            submitLabel={tActions('saveChanges')}
            deleteHref={route('contact-channels.destroy', channel.id)}
            deleteLabel={tActions('delete')}
          />

          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onOpenTranslations}
            >
              {tActions('manageTranslations')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
