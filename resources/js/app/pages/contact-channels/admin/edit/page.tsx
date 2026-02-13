import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { LocaleSwapDialog } from '@/Common/LocaleSwapDialog';
import { Button } from '@/Components/Ui/button';
import { listContactChannelTranslations } from '@/Modules/ContactChannels/core/api/translations';
import type { ContactChannelFormData } from '@/Modules/ContactChannels/core/forms';
import type {
  ContactChannel,
  ContactChannelTypeOption,
} from '@/Modules/ContactChannels/core/types';
import { ContactChannelForm } from '@/Modules/ContactChannels/ui/ContactChannelForm';
import { TranslationModal } from '@/Modules/ContactChannels/ui/TranslationModal';
import { Head, Link, useForm } from '@inertiajs/react';
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
  const [loadingTranslations, setLoadingTranslations] = React.useState(false);
  const [localesLoadError, setLocalesLoadError] = React.useState<string | null>(
    null,
  );

  const { data, setData, put, processing, errors } =
    useForm<ContactChannelFormData>({
      locale: channel.locale,
      confirm_swap: false,
      channel_type: channel.channel_type,
      label: channel.label ?? '',
      value: channel.value,
      is_active: channel.is_active,
      sort_order: channel.sort_order,
    });

  React.useEffect(() => {
    let mounted = true;

    const loadTranslations = async (): Promise<void> => {
      setLoadingTranslations(true);
      setLocalesLoadError(null);
      try {
        const items = await listContactChannelTranslations(channel.id);
        if (mounted) {
          setTranslationLocales(
            items.map((item) => item.locale).filter(Boolean),
          );
        }
      } catch (err) {
        if (mounted) {
          setLocalesLoadError(
            'Unable to load translations for locale conflict checks.',
          );
        }
      } finally {
        if (mounted) {
          setLoadingTranslations(false);
        }
      }
    };

    void loadTranslations();

    return () => {
      mounted = false;
    };
  }, [channel.id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    put(route('contact-channels.update', channel.id));
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
    <>
      <AuthenticatedLayout
        header={
          <h1 className="text-xl leading-tight font-semibold">
            Edit contact channel
          </h1>
        }
      >
        <Head title={`Edit contact channel`} />

        <div className="overflow-hidden">
          <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-4">
              <Link
                href={route('contact-channels.index')}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                Back to contact channels
              </Link>
            </div>

            <ContactChannelForm
              data={data}
              errors={errors}
              channelTypes={channelTypes}
              processing={processing}
              onChange={handleChange}
              onSubmit={handleSubmit}
              cancelHref={route('contact-channels.index')}
              submitLabel="Save changes"
              deleteHref={route('contact-channels.destroy', channel.id)}
              deleteLabel="Delete"
              alignActions="split"
            />

            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowTranslations(true)}
              >
                Manage translations
              </Button>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>

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
    </>
  );
}
