import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SocialLinksBar, type SocialLinkItem } from '@/modules/contact-channels/ui/SocialLinksBar';
import {
  CONTACT_CHANNELS_NAMESPACES,
  useContactChannelsTranslation,
} from '@/modules/contact-channels/i18n';
import type {
  SectionDataCollectionItem,
  SectionDataPrimitive,
  SectionDataValue,
  SectionImage,
} from '@/modules/content-management/types';
import { SectionHeader, useFieldValueResolver } from '@/modules/content-management/features/page-rendering';
import { usePageForm } from '@/common/page-runtime';
import { Github, Linkedin, Link2, Mail, MessageCircle, PhoneCall } from 'lucide-react';
import type { ComponentType, FormEvent, JSX, SVGProps } from 'react';
import type { PlaceholderValues } from '@/common/i18n';

/**
 * Renders the primary contact section driven by ContentManagement template data.
 *
 * Text content is resolved through the section field resolver, with static
 * defaults when CMS values are not provided. Social links are provided
 * through the front-only section environment.
 */
export function ContactPrimarySection(): JSX.Element | null {
  const fieldResolver = useFieldValueResolver();
  const { translate: tContactChannels } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.contactChannels,
  );

  const sectionLabel =
    fieldResolver.getFieldValue<string>('section_label') ??
    tContactChannels('sectionDefaults.sectionLabel');

  const eyebrow =
    fieldResolver.getFieldValue<string>('eyebrow') ??
    tContactChannels('sectionDefaults.eyebrow');

  const title =
    fieldResolver.getFieldValue<string>('title') ??
    tContactChannels('sectionDefaults.title');

  const description =
    fieldResolver.getFieldValue<string>('description') ??
    fieldResolver.getFieldValue<string>('subtitle') ??
    tContactChannels('sectionDefaults.description');

  const formTitle =
    fieldResolver.getFieldValue<string>('form_title') ??
    tContactChannels('sectionDefaults.formTitle');

  const formDescription =
    fieldResolver.getFieldValue<string>('form_description') ??
    tContactChannels('sectionDefaults.formDescription');

  const nameLabel =
    fieldResolver.getFieldValue<string>('name_label') ??
    tContactChannels('sectionDefaults.nameLabel');
  const namePlaceholder =
    fieldResolver.getFieldValue<string>('name_placeholder') ??
    tContactChannels('sectionDefaults.namePlaceholder');

  const emailLabel =
    fieldResolver.getFieldValue<string>('email_label') ??
    tContactChannels('sectionDefaults.emailLabel');
  const emailPlaceholder =
    fieldResolver.getFieldValue<string>('email_placeholder') ??
    tContactChannels('sectionDefaults.emailPlaceholder');

  const messageLabel =
    fieldResolver.getFieldValue<string>('message_label') ??
    tContactChannels('sectionDefaults.messageLabel');
  const messagePlaceholder =
    fieldResolver.getFieldValue<string>('message_placeholder') ??
    tContactChannels('sectionDefaults.messagePlaceholder');

  const submitLabel =
    fieldResolver.getFieldValue<string>('submit_label') ??
    tContactChannels('sectionDefaults.submitLabel');
  const submitProcessingLabel =
    fieldResolver.getFieldValue<string>('submit_processing_label') ??
    tContactChannels('sectionDefaults.submitProcessingLabel');

  const rawContactChannels =
    fieldResolver.getFieldValue<SectionDataValue>('contact_channels') ??
    fieldResolver.getFieldValue<SectionDataValue>('contactChannels');

  const channelItems: SocialLinkItem[] = Array.isArray(rawContactChannels)
    ? (rawContactChannels as ContactChannelArrayItem[])
        .filter(isContactChannelItem)
        .map((item) => mapContactChannelItem(item, tContactChannels))
        .filter((item): item is SocialLinkItem => item !== null)
    : [];

  const socialLinks = channelItems;
  const hasSocialLinks = socialLinks.length > 0;

  const socialsHeading =
    fieldResolver.getFieldValue<string>('sidebar_heading') ??
    tContactChannels('sectionDefaults.socialsHeading');
  const socialsDescription =
    fieldResolver.getFieldValue<string>('sidebar_description') ??
    tContactChannels('sectionDefaults.socialsDescription');

  const {
    data: formData,
    setData,
    post,
    processing,
    errors,
    reset,
  } = usePageForm({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    post(route('messages.store'), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
      },
    });
  };

  if (!title && !description && !eyebrow) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10" aria-label={sectionLabel}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        align="left"
      />

      <div className="flex flex-col gap-6 p-0.5 md:flex-row md:items-start md:justify-between md:gap-8">
        <section
          aria-label={formTitle}
          className="space-y-4 md:max-w-xl md:flex-1"
        >
          <SectionHeader
            title={formTitle}
            description={formDescription}
            align="left"
            level={3}
          />

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <Label className="pb-1.5" htmlFor="contact-name">
                {nameLabel}
              </Label>
              <Input
                id="contact-name"
                name="name"
                autoComplete="name"
                placeholder={namePlaceholder}
                value={formData.name}
                onChange={(event) => setData('name', event.target.value)}
                disabled={processing}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? 'contact-name-error' : undefined
                }
              />
              {errors.name && (
                <p
                  id="contact-name-error"
                  className="text-destructive text-xs"
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <Label className="pb-1.5" htmlFor="contact-email">
                {emailLabel}
              </Label>
              <Input
                id="contact-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder={emailPlaceholder}
                value={formData.email}
                onChange={(event) => setData('email', event.target.value)}
                disabled={processing}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? 'contact-email-error' : undefined
                }
              />
              {errors.email && (
                <p
                  id="contact-email-error"
                  className="text-destructive text-xs"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <Label className="pb-1.5" htmlFor="contact-message">
                {messageLabel}
              </Label>
              <Textarea
                id="contact-message"
                name="message"
                placeholder={messagePlaceholder}
                rows={4}
                value={formData.message}
                onChange={(event) => setData('message', event.target.value)}
                disabled={processing}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? 'contact-message-error' : undefined
                }
              />
              {errors.message && (
                <p
                  id="contact-message-error"
                  className="text-destructive text-xs"
                  role="alert"
                >
                  {errors.message}
                </p>
              )}
            </div>

            <div>
              <Button type="submit" disabled={processing}>
                {processing ? submitProcessingLabel : submitLabel}
              </Button>
            </div>
          </form>
        </section>

        {hasSocialLinks && (
          <section aria-label={socialsHeading} className="space-y-4 md:flex-1">
            <SectionHeader
              title={socialsHeading}
              description={socialsDescription}
              align="left"
              level={3}
            />

            <SocialLinksBar items={socialLinks} />

          </section>
        )}
      </div>
    </div>
  );
}

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type ContactChannelsTranslationFunction = {
  (key: string, params?: PlaceholderValues): string;
  (key: string, fallback: string, params?: PlaceholderValues): string;
};

type ContactChannelArrayItem =
  | SectionDataPrimitive
  | SectionDataCollectionItem
  | SectionImage;

type ContactChannelData = SectionDataCollectionItem & {
  channel_type?: SectionDataValue;
  href?: SectionDataValue;
  value?: SectionDataValue;
  label?: SectionDataValue;
};

function isContactChannelItem(
  item: ContactChannelArrayItem,
): item is ContactChannelData {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

function mapContactChannelItem(
  item: ContactChannelData,
  tContactChannels: ContactChannelsTranslationFunction,
): SocialLinkItem | null {
  const channelType =
    typeof item.channel_type === 'string' ? item.channel_type : undefined;
  const href =
    typeof item.href === 'string'
      ? item.href
      : typeof item.value === 'string'
      ? item.value
      : '';

  if (!href) {
    return null;
  }

  const label =
    typeof item.label === 'string' && item.label.trim() !== ''
      ? item.label
      : channelTypeLabel(channelType, tContactChannels);

  return {
    label,
    translationKey: channelTypeTranslationKey(channelType),
    href,
    icon: channelTypeIcon(channelType),
  };
}

const CHANNEL_TYPE_ICONS: Record<string, IconComponent> = {
  email: Mail,
  github: Github,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  phone: PhoneCall,
  custom: Link2,
};

function channelTypeIcon(channelType?: string): IconComponent {
  if (!channelType) {
    return Link2;
  }

  return CHANNEL_TYPE_ICONS[channelType] ?? Link2;
}

function channelTypeTranslationKey(channelType?: string): string | undefined {
  if (!channelType || channelType === 'custom') {
    return undefined;
  }

  return `socials.${channelType}.label`;
}

function channelTypeLabel(
  channelType: string | undefined,
  tContactChannels: ContactChannelsTranslationFunction,
): string {
  if (!channelType) {
    return tContactChannels('socials.unknown.label');
  }

  return tContactChannels(
    `socials.${channelType}.label`,
    tContactChannels('socials.unknown.label'),
  );
}
