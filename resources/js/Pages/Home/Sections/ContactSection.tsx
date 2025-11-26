import { Button } from '@/Components/Ui/button';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import { Textarea } from '@/Components/Ui/textarea';
import { useForm } from '@inertiajs/react';
import { SectionHeader } from '../Partials/SectionHeader';
import { SocialLinkItem, SocialLinksBar } from '../Partials/SocialLinksBar';

/**
 * ContactSection provides contact options and a simple contact form.
 */
export function ContactSection() {
    const socialLinks: SocialLinkItem[] = [
        // Replace href values and icons according to your profiles.
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        message: '',
    });

    function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
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
        >
            <SectionHeader
                eyebrow="Contact"
                title="Let us discuss opportunities or projects."
                description="If you see a match between your needs and my profile, feel free to reach out through the form or any of the links below."
                align="left"
            />

            <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <Label htmlFor="contact-name">Name</Label>
                        <Input
                            id="contact-name"
                            name="name"
                            autoComplete="name"
                            placeholder="Your name"
                            value={data.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                            disabled={processing}
                        />
                        {errors.name && (
                            <p className="text-destructive text-xs">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input
                            id="contact-email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={data.email}
                            onChange={(event) =>
                                setData('email', event.target.value)
                            }
                            disabled={processing}
                        />
                        {errors.email && (
                            <p className="text-destructive text-xs">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="contact-message">Message</Label>
                        <Textarea
                            id="contact-message"
                            name="message"
                            placeholder="Briefly describe what you would like to talk about."
                            rows={4}
                            value={data.message}
                            onChange={(event) =>
                                setData('message', event.target.value)
                            }
                            disabled={processing}
                        />
                        {errors.message && (
                            <p className="text-destructive text-xs">
                                {errors.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Sending…' : 'Send message'}
                        </Button>
                    </div>
                </form>

                <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                        You can also reach out directly through your preferred
                        channel. Use the links below for profiles and direct
                        contact options.
                    </p>

                    <SocialLinksBar items={socialLinks} />
                </div>
            </div>
        </section>
    );
}
