// resources/js/Pages/Home/Sections/ContactSection.tsx
import { Button } from '@/Components/Ui/button';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import { Textarea } from '@/Components/Ui/textarea';
import { useTranslation } from '@/i18n';
import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import {
    SocialLinkItem,
    SocialLinksBar,
} from '../../../Components/SocialLinksBar';
import { SectionHeader } from '../Partials/SectionHeader';

export interface ContactSectionProps {
    socialLinks?: SocialLinkItem[];
}

/**
 * ContactSection provides contact options and a simple contact form.
 */
export function ContactSection({ socialLinks = [] }: ContactSectionProps) {
    const hasSocialLinks = socialLinks.length > 0;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        message: '',
    });

    const { translate } = useTranslation('home');

    const sectionLabel = translate(
        'contact.sectionLabel',
        'Contact and collaboration',
    );

    const eyebrow = translate('contact.header.eyebrow', 'Contact');

    const title = translate(
        'contact.header.title',
        'Let us talk about opportunities, projects, or collaboration.',
    );

    const description = translate(
        'contact.header.description',
        'If you are looking for a developer to strengthen your team, support a specific project, or start a technical collaboration, use the form or the channels below to get in touch.',
    );

    const nameLabel = translate('contact.form.name.label', 'Name');

    const namePlaceholder = translate(
        'contact.form.name.placeholder',
        'Your name',
    );

    const emailLabel = translate('contact.form.email.label', 'Email');

    const emailPlaceholder = translate(
        'contact.form.email.placeholder',
        'you@example.com',
    );

    const messageLabel = translate('contact.form.message.label', 'Message');

    const messagePlaceholder = translate(
        'contact.form.message.placeholder',
        'Share what you have in mind and how I can help.',
    );

    const submitLabel = translate(
        'contact.form.submit.default',
        'Send message',
    );

    const submitProcessingLabel = translate(
        'contact.form.submit.processing',
        'Sending…',
    );

    const sidebarDescription = translate(
        'contact.sidebar.description',
        'You can also contact me through your preferred channel using the links below to access my profiles and learn more about my work.',
    );

    const socialsHeading = translate(
        'contact.sidebar.heading',
        'Other contact channels',
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        post(route('messages.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    }

    return (
        <section
            id="contact"
            className="flex flex-col gap-8 border-t pt-12 pb-16 md:pt-16 md:pb-20"
            aria-label={sectionLabel}
        >
            <SectionHeader
                eyebrow={eyebrow}
                title={title}
                description={description}
                align="left"
            />

            <div className="flex flex-col gap-10 p-0.5">
                <form
                    className="space-y-4 md:max-w-xl"
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
                            value={data.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
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

                    <div className="space-y-1.5">
                        <Label htmlFor="contact-email">{emailLabel}</Label>
                        <Input
                            id="contact-email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder={emailPlaceholder}
                            value={data.email}
                            onChange={(event) =>
                                setData('email', event.target.value)
                            }
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

                    <div className="space-y-1.5">
                        <Label htmlFor="contact-message">{messageLabel}</Label>
                        <Textarea
                            id="contact-message"
                            name="message"
                            placeholder={messagePlaceholder}
                            rows={4}
                            value={data.message}
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
                            {processing ? submitProcessingLabel : submitLabel}
                        </Button>
                    </div>
                </form>

                {hasSocialLinks && (
                    <section aria-label={socialsHeading} className="space-y-4">
                        <SectionHeader
                            title={socialsHeading}
                            description={sidebarDescription}
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
