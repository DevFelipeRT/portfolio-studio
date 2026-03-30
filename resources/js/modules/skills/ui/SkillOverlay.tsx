import { TableBadge, TableDetailDialog, formatTableDate } from '@/common/table';
import { useTranslation } from '@/common/i18n';
import { useIsMobile } from '@/hooks/useMobile';
import type { AdminSkillListItem } from '@/modules/skills/core/types';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';

interface SkillOverlayProps {
  open: boolean;
  skill: AdminSkillListItem | null;
  onOpenChange: (open: boolean) => void;
}

export function SkillOverlay({ open, skill, onOpenChange }: SkillOverlayProps) {
  const { locale } = useTranslation();
  const isMobile = useIsMobile();
  const { translate: tForm } = useSkillsTranslation(SKILLS_NAMESPACES.form);

  if (!skill) {
    return null;
  }

  const updatedLabel = formatTableDate(skill.updated_at, {
    locale,
    isMobile,
    fallback: tForm('values.empty'),
  });
  const createdLabel = formatTableDate(skill.created_at, {
    locale,
    isMobile,
    fallback: tForm('values.empty'),
  });

  return (
    <TableDetailDialog
      open={open}
      onOpenChange={onOpenChange}
      title={skill.name}
      className="max-w-xl"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <TableBadge tone="outline" className="border-dashed font-medium">
            {skill.category?.name ?? tForm('fields.category.uncategorized')}
          </TableBadge>
          <span className="bg-muted text-muted-foreground inline-flex rounded px-2 py-0.5 font-mono text-xs">
            {skill.locale}
          </span>
        </div>

        <InfoRow
          label={tForm('fields.category.label')}
          value={skill.category?.name ?? tForm('fields.category.uncategorized')}
        />
        <InfoRow label={tForm('fields.created_at.label')} value={createdLabel} />
        <InfoRow label={tForm('fields.updated_at.label')} value={updatedLabel} />
      </div>
    </TableDetailDialog>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <div className="text-sm">{value}</div>
    </div>
  );
}
