import { Badge } from '@/Components/Ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, CircleDashed } from 'lucide-react';

export type CourseStatus = 'planned' | 'in_progress' | 'completed';

interface CourseStatusBadgeProps {
    status: CourseStatus;
    className?: string;
}

const statusVariants = {
    planned: {
        label: 'Planned',
        icon: Circle,
        style: 'bg-slate-100 text-slate-700 hover:bg-slate-100/80 dark:bg-slate-800/50 dark:text-slate-300',
    },
    in_progress: {
        label: 'In Progress',
        icon: CircleDashed,
        style: 'bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300',
    },
    completed: {
        label: 'Completed',
        icon: CheckCircle2,
        style: 'bg-green-100 text-green-700 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-300',
    },
};

/**
 * Renders a unified status badge based on the provided course state.
 */
export function CourseStatusBadge({
    status,
    className,
}: CourseStatusBadgeProps) {
    const variant = statusVariants[status];
    const Icon = variant.icon;

    return (
        <Badge
            variant="secondary"
            className={cn(
                'flex w-fit gap-2 border-transparent text-nowrap',
                variant.style,
                className,
            )}
        >
            <Icon className="h-3 w-3" />
            <span className="hidden md:block">{variant.label}</span>
        </Badge>
    );
}
