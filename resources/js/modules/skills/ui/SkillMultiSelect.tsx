import type { MultiSelectOption } from '@/components/ui/multi-select';
import { MultiSelect } from '@/components/ui/multi-select';
import type { Skill } from '@/modules/skills/core/types';
import * as React from 'react';

type SkillMultiSelectProps = {
    id?: string;
    className?: string;
    skills: Skill[];
    selectedIds: number[];
    onChangeSelectedIds: (ids: number[]) => void;
    disabled?: boolean;
    placeholder?: string;
    otherLabel?: string;
    limit?: number;
    portalContainer?: React.ComponentProps<
        typeof MultiSelect
    >['portalContainer'];
};

export function SkillMultiSelect({
    id,
    className,
    skills,
    selectedIds,
    onChangeSelectedIds,
    disabled = false,
    placeholder = 'Search skills…',
    otherLabel = 'Other',
    limit = 250,
    portalContainer,
}: SkillMultiSelectProps) {
    const options = React.useMemo(() => {
        const items: MultiSelectOption<number>[] = skills.map((skill) => ({
            value: skill.id,
            label: skill.name,
            group: skill.category?.name?.trim() || otherLabel,
        }));

        return items;
    }, [otherLabel, skills]);

    return (
        <MultiSelect
            id={id}
            className={className}
            value={selectedIds}
            onValueChange={onChangeSelectedIds}
            options={options}
            disabled={disabled}
            placeholder={placeholder}
            otherGroupLabel={otherLabel}
            limit={limit}
            portalContainer={portalContainer}
        />
    );
}
