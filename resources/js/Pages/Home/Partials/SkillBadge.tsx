import { Badge, type BadgeProps } from '@/Components/Ui/badge';
import { ReactNode } from 'react';

interface SkillBadgeProps {
    label: string;
    icon?: ReactNode;
    variant?: BadgeProps['variant'];
}

/**
 * SkillBadge renders a compact badge representing a single skill.
 */
export function SkillBadge({
    label,
    icon,
    variant = 'outline',
}: SkillBadgeProps) {
    return (
        <Badge
            variant={variant}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-normal"
        >
            {icon && <span className="h-3.5 w-3.5">{icon}</span>}
            <span>{label}</span>
        </Badge>
    );
}
