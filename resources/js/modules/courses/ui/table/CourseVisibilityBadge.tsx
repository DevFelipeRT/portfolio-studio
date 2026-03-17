import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { COURSES_NAMESPACES, useCoursesTranslation } from '@/modules/courses/i18n';
import { Globe, Lock } from 'lucide-react';

export type CourseVisibility = 'public' | 'private';

interface CourseVisibilityBadgeProps {
    visibility: CourseVisibility;
    className?: string;
}

const visibilityVariants = {
    public: {
        icon: Globe,
        style: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100/80 dark:bg-indigo-900/30 dark:text-indigo-300',
    },
    private: {
        icon: Lock,
        style: 'bg-slate-100 text-slate-700 hover:bg-slate-100/80 dark:bg-slate-800/50 dark:text-slate-300',
    },
};

/**
 * Renders a visual indicator for the course visibility scope.
 */
export function CourseVisibilityBadge({
    visibility,
    className,
}: CourseVisibilityBadgeProps) {
    const { translate: tForm } = useCoursesTranslation(COURSES_NAMESPACES.form);
    const variant = visibilityVariants[visibility];
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
            <span className="hidden md:block">{tForm(`visibility.${visibility}`)}</span>
        </Badge>
    );
}
