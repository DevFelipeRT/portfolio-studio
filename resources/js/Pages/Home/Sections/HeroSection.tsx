// Home/Partials/HeroSection.tsx
import { Button } from '@/Components/Ui/button';
import { SectionHeader } from '../Partials/SectionHeader';
import { SocialLinkItem, SocialLinksBar } from '../Partials/SocialLinksBar';

/**
 * HeroSection renders the main hero block for the portfolio landing page.
 */
export function HeroSection() {
    const socialLinks: SocialLinkItem[] = [
        // Example:
        // {
        //     label: "GitHub",
        //     href: "https://github.com/your-user",
        //     icon: <Github className="h-5 w-5" />,
        // },
    ];

    return (
        <section id="hero" className="py-12 md:py-20 lg:py-24">
            <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                {/* Text column */}
                <div className="flex flex-col gap-8">
                    <div className="max-w-3xl">
                        <SectionHeader
                            eyebrow="Portfolio"
                            title="Software developer focused on reliable web applications."
                            description="I design and implement web applications with clear architecture, maintainable code and a strong focus on developer and user experience."
                            align="left"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Button asChild size="lg">
                            <a href="#contact">Contact me</a>
                        </Button>

                        <div className="flex-1" />

                        <SocialLinksBar items={socialLinks} dense />
                    </div>
                </div>

                {/* Image column */}
                <div className="relative">
                    <div className="bg-muted relative h-48 w-full overflow-hidden rounded-2xl border md:h-64 lg:h-72">
                        {/* Replace this container with a real image or illustration when available.
                           Example:
                           <img
                               src="/images/hero-portrait.jpg"
                               alt="Portrait or illustration"
                               className="h-full w-full object-cover"
                           />
                        */}
                    </div>
                </div>
            </div>
        </section>
    );
}
