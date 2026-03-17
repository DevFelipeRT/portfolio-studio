import {
    SectionHeader,
    useFieldValueResolver,
} from '@/modules/content-management/features/page-rendering';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';
import { SkillBadge } from '@/modules/skills/ui/SkillBadge';
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
export function TechStackPrimarySection(): JSX.Element | null {
    const { translate: tForm } = useSkillsTranslation(SKILLS_NAMESPACES.form);
    const fieldResolver = useFieldValueResolver();

    const sectionLabel =
        fieldResolver.getFieldValue<string>('section_label') ??
        tForm('public.sectionLabel');

    const eyebrow =
        fieldResolver.getFieldValue<string>('eyebrow') ??
        tForm('public.eyebrow');

    const title =
        fieldResolver.getFieldValue<string>('title') ??
        tForm('public.title');

    const description =
        fieldResolver.getFieldValue<string>('description') ??
        tForm('public.description');

    const rawGroups = fieldResolver.getFieldValue<unknown>('groups');

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

    return (
        <div className="flex flex-col gap-8" aria-label={sectionLabel}>
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
        </div>
    );
}
