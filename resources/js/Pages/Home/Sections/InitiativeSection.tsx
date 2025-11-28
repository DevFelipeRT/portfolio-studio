// resources/js/Pages/Home/Sections/InitiativeSection.tsx

import { Initiative } from '@/Pages/types';
import { useTranslation } from '@/i18n';
import { InitiativeCard } from '../Partials/InitiativeCard';
import { SectionHeader } from '../Partials/SectionHeader';

export interface InitiativeSectionProps {
    initiatives?: Initiative[];
}

/**
 * InitiativeSection renders a landing section showcasing selected initiatives.
 */
export function InitiativeSection({ initiatives }: InitiativeSectionProps) {
    const { translate } = useTranslation('home');

    const items = initiatives?.filter((initiative) => initiative.display) ?? [];
    const hasItems = items.length > 0;

    const sectionLabel = translate(
        'initiatives.sectionLabel',
        'Events, workshops and teaching initiatives',
    );

    const eyebrow = translate('initiatives.header.eyebrow', 'Initiatives');
    const title = translate(
        'initiatives.header.title',
        'Events, workshops and teaching initiatives.',
    );
    const description = translate(
        'initiatives.header.description',
        'A selection of initiatives I have led or contributed to, including talks, workshops, courses and outreach activities.',
    );

    return (
        <section
            id="initiatives"
            className="flex flex-col gap-8 border-t pt-12 md:pt-16"
            aria-label={sectionLabel}
        >
            {hasItems ? (
                <>
                    <SectionHeader
                        eyebrow={eyebrow}
                        title={title}
                        description={description}
                        align="left"
                    />

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {items.map((initiative) => (
                            <div key={initiative.id} className="group h-full">
                                <InitiativeCard initiative={initiative} />
                            </div>
                        ))}
                    </div>
                </>
            ) : null}
        </section>
    );
}
