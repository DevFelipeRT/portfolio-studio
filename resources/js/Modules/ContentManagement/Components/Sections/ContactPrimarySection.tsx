import { SocialLinksBar } from '@/Components/SocialLinksBar';
import { Button } from '@/Components/Ui/button';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import { Textarea } from '@/Components/Ui/textarea';
import { SectionHeader } from '@/Layouts/Partials/SectionHeader';
import type { SectionComponentProps } from '@/Modules/ContentManagement/config/sectionComponents';
import { useSectionEnvironment } from '@/Modules/ContentManagement/context/SectionEnvironmentContext';
import { useSectionFieldResolver } from '@/Modules/ContentManagement/context/SectionFieldResolverContext';
import { useTranslation } from '@/i18n';
import { useForm } from '@inertiajs/react';
import type { FormEvent, JSX } from 'react';

/**
 * Renders the primary contact section driven by ContentManagement template data.
 *
 * Text content can be configured through section data, with translation
 * fallbacks when values are not provided by the template.
 * Social links are provided through the front-only section environment.
 */
export function ContactPrimarySection({
    section,
    template,
}: SectionComponentProps): JSX.Element | null {
    const { translate } = useTranslation('home');
    const environment = useSectionEnvironment();
    const fieldResolver = useSectionFieldResolver();

    const getString = (key: string): string | undefined => {
        const value = fieldResolver.getValue<string>(key);

        if (typeof value === 'string' && value.trim() !== '') {
            return value;
        }

        return undefined;
    };

    const sectionLabel =
        getString('section_label') ??
        translate('contact.sectionLabel', 'Contact and collaboration');

    const eyebrow =
        getString('eyebrow') ?? translate('contact.header.eyebrow', 'Contact');

    const title =
        getString('title') ??
        template?.label ??
        translate(
            'contact.header.title',
            'Let us talk about opportunities, projects, or collaboration.',
        ) ??
        '';

    const description =
        getString('description') ??
        getString('subtitle') ??
        template?.description ??
        translate(
            'contact.header.description',
            'If you are looking for a developer to strengthen your team, support a specific project, or start a technical collaboration, use the form or the channels below to get in touch.',
        );

    const formTitle =
        getString('form_title') ??
        template?.label ??
        translate(
            'contact.header.formTitle',
            'Let us talk about opportunities, projects, or collaboration.',
        ) ??
        '';

    const formDescription =
        getString('form_description') ??
        translate(
            'contact.header.formDescription',
            'If you are looking for a developer to strengthen your team, support a specific project, or start a technical collaboration, use the form or the channels below to get in touch.',
        );

    const nameLabel =
        getString('name_label') ?? translate('contact.form.name.label', 'Name');
    const namePlaceholder =
        getString('name_placeholder') ??
        translate('contact.form.name.placeholder', 'Your name');

    const emailLabel =
        getString('email_label') ??
        translate('contact.form.email.label', 'Email');
    const emailPlaceholder =
        getString('email_placeholder') ??
        translate('contact.form.email.placeholder', 'you@example.com');

    const messageLabel =
        getString('message_label') ??
        translate('contact.form.message.label', 'Message');
    const messagePlaceholder =
        getString('message_placeholder') ??
        translate(
            'contact.form.message.placeholder',
            'Share what you have in mind and how I can help.',
        );

    const submitLabel =
        getString('submit_label') ??
        translate('contact.form.submit.default', 'Send message');
    const submitProcessingLabel =
        getString('submit_processing_label') ??
        translate('contact.form.submit.processing', 'Sending…');

    // Social links: front-only environment (not CMS data)
    const socialLinks = environment.socialLinks ?? [];
    const hasSocialLinks = Array.isArray(socialLinks) && socialLinks.length > 0;

    const socialsHeading = translate(
        'contact.sidebar.heading',
        'Other contact channels',
    );
    const socialsDescription = translate(
        'contact.sidebar.description',
        'You can also contact me through your preferred channel using the links below to access my profiles and learn more about my work.',
    );

    const sectionId = section.anchor || 'contact';

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

    return (
        <section
            id={sectionId}
            className="flex flex-col gap-8 border-t pt-12 pb-16 md:pt-16 md:pb-20"
            aria-label={sectionLabel}
        >
            <SectionHeader
                eyebrow={eyebrow}
                title={title}
                description={description}
                align="left"
            />

            <div className="flex flex-col gap-6 p-0.5 md:flex-row md:items-start md:justify-between md:gap-6">
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

                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <div className="space-y-1.5">
                            <Label htmlFor="contact-name">{nameLabel}</Label>
                            <Input
                                id="contact-name"
                                name="name"
                                autoComplete="name"
                                placeholder={namePlaceholder}
                                value={formData.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                disabled={processing}
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={
                                    errors.name
                                        ? 'contact-name-error'
                                        : undefined
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

                        <div className="space-y-1.5">
                            <Label htmlFor="contact-email">{emailLabel}</Label>
                            <Input
                                id="contact-email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder={emailPlaceholder}
                                value={formData.email}
                                onChange={(event) =>
                                    setData('email', event.target.value)
                                }
                                disabled={processing}
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={
                                    errors.email
                                        ? 'contact-email-error'
                                        : undefined
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

                        <div className="space-y-1.5">
                            <Label htmlFor="contact-message">
                                {messageLabel}
                            </Label>
                            <Textarea
                                id="contact-message"
                                name="message"
                                placeholder={messagePlaceholder}
                                rows={4}
                                value={formData.message}
                                onChange={(event) =>
                                    setData('message', event.target.value)
                                }
                                disabled={processing}
                                aria-invalid={Boolean(errors.message)}
                                aria-describedby={
                                    errors.message
                                        ? 'contact-message-error'
                                        : undefined
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
                                {processing
                                    ? submitProcessingLabel
                                    : submitLabel}
                            </Button>
                        </div>
                    </form>
                </section>

                {hasSocialLinks && (
                    <section
                        aria-label={socialsHeading}
                        className="space-y-4 md:flex-1"
                    >
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
