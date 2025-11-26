import { Card, CardContent, CardHeader, CardTitle } from '@/Components/Ui/card';
import { SectionHeader } from '../Partials/SectionHeader';

/**
 * HighlightsSection presents a set of key strengths or value propositions.
 */
export function HighlightsSection() {
    const highlights = [
        {
            title: 'Architecture and reliability',
            description:
                'Emphasis on clear boundaries, predictable behavior and solutions that can evolve without losing stability.',
        },
        {
            title: 'Code quality and maintainability',
            description:
                'Focus on readable code, modular structure and practices that keep the codebase understandable over time.',
        },
        {
            title: 'Collaboration and learning',
            description:
                'Comfortable with reviews, feedback and shared ownership, always aiming for clear communication in the team.',
        },
    ];

    return (
        <section
            id="highlights"
            className="flex flex-col gap-8 border-t pt-12 md:pt-16"
        >
            <SectionHeader
                eyebrow="Highlights"
                title="How I like to approach software projects."
                description="These points summarize how I usually think about design, implementation and collaboration in real-world applications."
                align="left"
            />

            <div className="grid gap-6 md:grid-cols-3">
                {highlights.map((item) => (
                    <Card key={item.title} className="h-full">
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
