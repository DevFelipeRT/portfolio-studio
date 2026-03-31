import { TableBadge } from '@/common/table';
import type { PlaceholderValues } from '@/common/i18n';
import { cn } from '@/lib/utils';
import type { ProjectStatusValue } from '@/modules/projects/core/status';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import {
  CheckCircle2,
  Circle,
  CircleDashed,
  Wrench,
} from 'lucide-react';

interface ProjectStatusBadgeProps {
  status?: ProjectStatusValue | null;
  className?: string;
}

type ProjectStatusTranslation = {
  (key: string, params?: PlaceholderValues): string;
  (key: string, fallback: string, params?: PlaceholderValues): string;
};

const statusVariants: Record<
  ProjectStatusValue,
  {
    icon: React.ComponentType<{ className?: string }>;
    style: string;
  }
> = {
  delivered: {
    icon: CheckCircle2,
    style:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  },
  in_progress: {
    icon: CircleDashed,
    style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  maintenance: {
    icon: Wrench,
    style:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  planned: {
    icon: Circle,
    style:
      'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300',
  },
};

/**
 * Renders a translated and semantically styled status badge for projects.
 */
export function ProjectStatusBadge({
  status,
  className,
}: ProjectStatusBadgeProps) {
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);

  if (status === null || status === undefined) {
    return null;
  }

  const variant = statusVariants[status];
  const Icon = variant.icon;

  return (
    <TableBadge
      className={cn(
        'flex w-fit items-center gap-2 border-none font-medium whitespace-nowrap',
        variant.style,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{formatProjectStatusLabel(tForm, status)}</span>
    </TableBadge>
  );
}

export function useProjectStatusLabel(status?: ProjectStatusValue | null): string {
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);

  return formatProjectStatusLabel(tForm, status);
}

function formatProjectStatusLabel(
  tForm: ProjectStatusTranslation,
  status?: ProjectStatusValue | null,
): string {
  if (status === null || status === undefined) {
    return '';
  }

  return tForm(`status.${status}`);
}
