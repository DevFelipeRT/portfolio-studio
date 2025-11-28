// resources/js/Pages/Home/Sections/HighlightsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/Ui/card';
import { useTranslation } from '@/i18n';
import { SectionHeader } from '../Partials/SectionHeader';

/**
 * HighlightsSection presents a set of key strengths or value propositions.
 */
export function HighlightsSection() {
    const { translate } = useTranslation('home');

    const sectionLabel = translate(
        'highlights.sectionLabel',
        'Key strengths and value propositions',
    );

    const eyebrow = translate('highlights.header.eyebrow', 'Highlights');
    const title = translate(
        'highlights.header.title',
        'How I like to approach software projects.',
    );
    const description = translate(
        'highlights.header.description',
        'These points summarize how I usually think about design, implementation and collaboration in real-world applications.',
    );

    const highlights = [
        {
            id: 'architecture',
            title: translate(
                'highlights.items.architecture.title',
                'Architecture and reliability',
            ),
            description: translate(
                'highlights.items.architecture.description',
                'Emphasis on clear boundaries, predictable behavior and solutions that can evolve without losing stability.',
            ),
        },
        {
            id: 'quality',
            title: translate(
                'highlights.items.quality.title',
                'Code quality and maintainability',
            ),
            description: translate(
                'highlights.items.quality.description',
                'Focus on readable code, modular structure and practices that keep the codebase understandable over time.',
            ),
        },
        {
            id: 'collaboration',
            title: translate(
                'highlights.items.collaboration.title',
                'Collaboration and learning',
            ),
            description: translate(
                'highlights.items.collaboration.description',
                'Comfortable with reviews, feedback and shared ownership, always aiming for clear communication in the team.',
            ),
        },
    ];

    return (
        <section
            id="highlights"
            className="flex flex-col gap-8 border-t pt-12 md:pt-16"
            aria-label={sectionLabel}
        >
            <SectionHeader
                eyebrow={eyebrow}
                title={title}
                description={description}
                align="left"
            />

            <div className="grid gap-6 md:grid-cols-3">
                {highlights.map((item) => (
                    <Card key={item.id} className="h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold sm:text-base">
                                {item.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                            {item.description}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
