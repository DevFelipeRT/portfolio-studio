// resources/js/Pages/Home/Sections/TechStackSection.tsx
import { TechnologyGroup } from '@/Pages/types';
import { useTranslation } from '@/i18n';
import { SectionHeader } from '../../../Layouts/Partials/SectionHeader';
import { TechnologyBadge } from '../Partials/TechnologyBadge';

type TechStackSectionProps = {
    groups: TechnologyGroup[];
};

/**
 * TechStackSection shows the main technologies used in projects.
 */
export function TechStackSection({ groups }: TechStackSectionProps) {
    const { translate } = useTranslation('home');

    const sectionLabel = translate(
        'techStack.sectionLabel',
        'Technologies used across my projects',
    );

    const eyebrow = translate('techStack.header.eyebrow', 'Tech stack');
    const title = translate(
        'techStack.header.title',
        'Technologies I work with on a daily basis.',
    );
    const description = translate(
        'techStack.header.description',
        'A selection of tools and frameworks that I use to design, build and operate web applications.',
    );

    return (
        <section
            id="tech-stack"
            className="flex flex-col gap-8 border-t pt-12 md:pt-16"
            aria-label={sectionLabel}
        >
            <SectionHeader
                eyebrow={eyebrow}
                title={title}
                description={description}
                align="left"
            />

            <div className="grid gap-8 md:grid-cols-3">
                {groups.map((group) => (
                    <div key={group.id} className="space-y-3">
                        <h3 className="text-sm font-semibold tracking-tight">
                            {group.title}
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {group.technologies.map((tech) => (
                                <TechnologyBadge
                                    key={tech.id}
                                    label={tech.name}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
