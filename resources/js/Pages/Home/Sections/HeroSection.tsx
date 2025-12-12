// resources/js/Pages/Home/Partials/HeroSection.tsx
import { Button } from '@/Components/Ui/button';
import { useTranslation } from '@/i18n';
import {
    SocialLinkItem,
    SocialLinksBar,
} from '../../../Components/SocialLinksBar';
import { SectionHeader } from '../../../Layouts/Partials/SectionHeader';

/**
 * HeroSection renders the main hero block for the portfolio landing page.
 */
export function HeroSection() {
    const { translate } = useTranslation('home');

    const socialLinks: SocialLinkItem[] = [];

    const sectionLabel = translate(
        'hero.sectionLabel',
        'Introduction and contact section of the portfolio landing page',
    );

    const eyebrow = translate('hero.eyebrow', 'Portfolio');
    const title = translate(
        'hero.title',
        'Software developer focused on reliable web applications.',
    );
    const description = translate(
        'hero.description',
        'I design and implement web applications with clear architecture, maintainable code and a strong focus on developer and user experience.',
    );
    const primaryCta = translate('hero.primaryCta', 'Contact me');

    return (
        <section
            id="hero"
            className="py-12 md:py-20 lg:py-24"
            aria-label={sectionLabel}
        >
            <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                {/* Text column */}
                <div className="flex flex-col gap-8">
                    <div className="max-w-3xl">
                        <SectionHeader
                            eyebrow={eyebrow}
                            title={title}
                            description={description}
                            align="left"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Button asChild size="lg">
                            <a href="#contact">{primaryCta}</a>
                        </Button>

                        <div className="flex-1" />

                        <SocialLinksBar items={socialLinks} dense />
                    </div>
                </div>

                {/* Image column */}
                <div className="relative" aria-hidden="true">
                    <div className="bg-muted relative h-48 w-full overflow-hidden rounded-2xl border md:h-64 lg:h-72">
                        {/* Decorative placeholder. Replace with a real image or illustration when available. */}
                    </div>
                </div>
            </div>
        </section>
    );
}
