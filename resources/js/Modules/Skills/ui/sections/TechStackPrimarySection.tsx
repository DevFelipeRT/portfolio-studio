import { SectionHeader } from '@/Modules/ContentManagement/ui/sections/SectionHeader';
import type { SectionComponentProps } from '@/Modules/ContentManagement/core/sections/sectionRegistry';
import { useSectionFieldResolver } from '@/Modules/ContentManagement/hooks/useSectionFieldResolver';
import { SkillBadge } from '@/Modules/Skills/ui/SkillBadge';
import type { JSX } from 'react';

type CapabilitySkill = {
    id: number;
    name: string;
};

type CapabilitySkillGroup = {
    id: string;
    title: string;
    skills?: CapabilitySkill[] | null;
};

/**
 * TechStackPrimarySection shows skills grouped by category,
 * driven by ContentManagement template data and capabilities output.
 *
 * Header content is resolved through the section field resolver,
 * with static defaults as final fallback.
 */
export function TechStackPrimarySection({
    section,
    className,
}: SectionComponentProps): JSX.Element | null {
    const fieldResolver = useSectionFieldResolver();

    const targetId = section.anchor || `tech-stack-${section.id}`;

    const sectionLabel =
        fieldResolver.getValue<string>('section_label') ??
        'Skills used across my projects';

    const eyebrow = fieldResolver.getValue<string>('eyebrow') ?? 'Tech stack';

    const title =
        fieldResolver.getValue<string>('title') ??
        'Skills I work with on a daily basis.';

    const description =
        fieldResolver.getValue<string>('description') ??
        'A selection of tools and frameworks that I use to design, build and operate web applications.';

    const rawGroups = fieldResolver.getValue<unknown>('groups');

    const groups: CapabilitySkillGroup[] = Array.isArray(rawGroups)
        ? rawGroups.filter(
              (group): group is CapabilitySkillGroup =>
                  group !== null && typeof group === 'object',
          )
        : [];

    const hasGroups = groups.length > 0;

    if (!title && !description && !hasGroups) {
        return null;
    }

    const baseSectionClassName = 'flex flex-col gap-8';

    const resolvedSectionClassName = [baseSectionClassName, className]
        .filter(Boolean)
        .join(' ')
        .trim();

    return (
        <section
            id={targetId}
            className={resolvedSectionClassName}
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
                        const skills = Array.isArray(group.skills)
                            ? group.skills
                            : [];

                        if (!skills.length) {
                            return null;
                        }

                        return (
                            <div key={group.id} className="space-y-3">
                                <h3 className="text-sm font-semibold tracking-tight">
                                    {group.title}
                                </h3>

                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <SkillBadge
                                            key={skill.id}
                                            label={skill.name}
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
