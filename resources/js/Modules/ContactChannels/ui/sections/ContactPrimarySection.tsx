import { Button } from '@/Components/Ui/button';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import { Textarea } from '@/Components/Ui/textarea';
import { SocialLinksBar, type SocialLinkItem } from '@/Modules/ContactChannels/ui/SocialLinksBar';
import type { SectionComponentProps } from '@/Modules/ContentManagement/core/sections/sectionRegistry';
import type {
  SectionDataCollectionItem,
  SectionDataPrimitive,
  SectionDataValue,
  SectionImage,
} from '@/Modules/ContentManagement/core/types';
import { useSectionFieldResolver } from '@/Modules/ContentManagement/hooks/useSectionFieldResolver';
import { SectionHeader } from '@/Modules/ContentManagement/ui/sections/SectionHeader';
import { useForm } from '@inertiajs/react';
import { Github, Linkedin, Link2, Mail, MessageCircle, PhoneCall } from 'lucide-react';
import type { ComponentType, FormEvent, JSX, SVGProps } from 'react';

/**
 * Renders the primary contact section driven by ContentManagement template data.
 *
 * Text content is resolved through the section field resolver, with static
 * defaults when CMS values are not provided. Social links are provided
 * through the front-only section environment.
 */
export function ContactPrimarySection({
  section,
  className,
}: SectionComponentProps): JSX.Element | null {
  const fieldResolver = useSectionFieldResolver();

  const targetId = section.anchor || `contact-${section.id}`;

  const sectionLabel =
    fieldResolver.getValue<string>('section_label') ??
    'Contact and collaboration';

  const eyebrow = fieldResolver.getValue<string>('eyebrow') ?? 'Contact';

  const title =
    fieldResolver.getValue<string>('title') ??
    'Let us talk about opportunities, projects, or collaboration.';

  const description =
    fieldResolver.getValue<string>('description') ??
    fieldResolver.getValue<string>('subtitle') ??
    'If you are looking for a developer to strengthen your team, support a specific project, or start a technical collaboration, use the form or the channels below to get in touch.';

  const formTitle =
    fieldResolver.getValue<string>('form_title') ?? 'Send a message';

  const formDescription =
    fieldResolver.getValue<string>('form_description') ??
    'Share what you have in mind and how I can help.';

  const nameLabel = fieldResolver.getValue<string>('name_label') ?? 'Name';
  const namePlaceholder =
    fieldResolver.getValue<string>('name_placeholder') ?? 'Your name';

  const emailLabel = fieldResolver.getValue<string>('email_label') ?? 'Email';
  const emailPlaceholder =
    fieldResolver.getValue<string>('email_placeholder') ?? 'you@example.com';

  const messageLabel =
    fieldResolver.getValue<string>('message_label') ?? 'Message';
  const messagePlaceholder =
    fieldResolver.getValue<string>('message_placeholder') ??
    'Write your message here.';

  const submitLabel =
    fieldResolver.getValue<string>('submit_label') ?? 'Send message';
  const submitProcessingLabel =
    fieldResolver.getValue<string>('submit_processing_label') ?? 'Sending…';

  const rawContactChannels =
    fieldResolver.getValue<SectionDataValue>('contact_channels') ??
    fieldResolver.getValue<SectionDataValue>('contactChannels');

  const channelItems: SocialLinkItem[] = Array.isArray(rawContactChannels)
    ? (rawContactChannels as ContactChannelArrayItem[])
        .filter(isContactChannelItem)
        .map(mapContactChannelItem)
        .filter((item): item is SocialLinkItem => item !== null)
    : [];

  const socialLinks = channelItems;
  const hasSocialLinks = socialLinks.length > 0;

  const socialsHeading =
    fieldResolver.getValue<string>('sidebar_heading') ??
    'Other contact channels';
  const socialsDescription =
    fieldResolver.getValue<string>('sidebar_description') ??
    'You can also contact me through your preferred channel using the links below to access my profiles and learn more about my work.';

  const {
    data: formData,
    setData,
    post,
    processing,
    errors,
    reset,
  } = useForm({
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

  const baseSectionClassName = 'flex flex-col gap-10';

  const resolvedSectionClassName = [baseSectionClassName, className]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <section
      id={targetId}
      className={resolvedSectionClassName}
      aria-label={sectionLabel}
    >
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
    </section>
  );
}

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

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

function mapContactChannelItem(item: ContactChannelData): SocialLinkItem | null {
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
      : channelTypeLabel(channelType);

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

function channelTypeLabel(channelType?: string): string {
  if (!channelType) {
    return 'Contact';
  }

  return (
    {
      email: 'Email',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      whatsapp: 'WhatsApp',
      phone: 'Phone',
      custom: 'Contact',
    } as Record<string, string>
  )[channelType] ?? 'Contact';
}
