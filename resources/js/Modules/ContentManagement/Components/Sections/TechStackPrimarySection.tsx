import { SectionHeader } from '@/Layouts/Partials/SectionHeader';
import type { SectionComponentProps } from '@/Modules/ContentManagement/config/sectionComponents';
import { useSectionFieldResolver } from '@/Modules/ContentManagement/context/SectionFieldResolverContext';
import { TechnologyBadge } from '@/Pages/Home/Partials/TechnologyBadge';
import { useTranslation } from '@/i18n';
import type { JSX } from 'react';

type CapabilityTechnology = {
    id: number;
    name: string;
};

type CapabilityTechnologyGroup = {
    id: number;
    title: string;
    technologies?: CapabilityTechnology[] | null;
};

/**
 * TechStackPrimarySection shows technologies grouped by category,
 * driven by ContentManagement template data and capabilities output.
 *
 * Header content can be customized via template fields, with
 * translations as final fallback.
 */
export function TechStackPrimarySection({
    section,
}: SectionComponentProps): JSX.Element | null {
    const { translate } = useTranslation('home');
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
        translate(
            'techStack.sectionLabel',
            'Technologies used across my projects',
        );

    const eyebrow =
        getString('eyebrow') ??
        translate('techStack.header.eyebrow', 'Tech stack');

    const title =
        getString('title') ??
        translate(
            'techStack.header.title',
            'Technologies I work with on a daily basis.',
        );

    const description =
        getString('description') ??
        translate(
            'techStack.header.description',
            'A selection of tools and frameworks that I use to design, build and operate web applications.',
        );

    const rawGroups = fieldResolver.getValue<unknown>('groups');

    const groups: CapabilityTechnologyGroup[] = Array.isArray(rawGroups)
        ? rawGroups.filter(
              (group): group is CapabilityTechnologyGroup =>
                  group !== null && typeof group === 'object',
          )
        : [];

    const hasGroups = groups.length > 0;
    const sectionId = section.anchor || 'tech-stack';

    if (!title && !description && !hasGroups) {
        return null;
    }

    return (
        <section
            id={sectionId}
            className="flex flex-col gap-8 border-t pt-12 md:pt-16"
            aria-label={sectionLabel}
        >
            <SectionHeader
                eyebrow={eyebrow}
                title={title}
                description={description}
                align="left"
            />

            {hasGroups && (
                <div className="grid gap-8 md:grid-cols-3">
                    {groups.map((group) => {
                        const technologies = Array.isArray(group.technologies)
                            ? group.technologies
                            : [];

                        if (!technologies.length) {
                            return null;
                        }

                        return (
                            <div key={group.id} className="space-y-3">
                                <h3 className="text-sm font-semibold tracking-tight">
                                    {group.title}
                                </h3>

                                <div className="flex flex-wrap gap-2">
                                    {technologies.map((tech) => (
                                        <TechnologyBadge
                                            key={tech.id}
                                            label={tech.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
