import { TableDetailDialog, formatTableDate } from '@/common/table';
import { useTranslation } from '@/common/i18n';
import { useIsMobile } from '@/hooks/useMobile';
import type { AdminSkillCategoryRecord } from '@/modules/skills/core/types';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';

interface SkillCategoryOverlayProps {
  open: boolean;
  category: AdminSkillCategoryRecord | null;
  onOpenChange: (open: boolean) => void;
}

export function SkillCategoryOverlay({
  open,
  category,
  onOpenChange,
}: SkillCategoryOverlayProps) {
  const { locale } = useTranslation();
  const isMobile = useIsMobile();
  const { translate: tForm } = useSkillsTranslation(SKILLS_NAMESPACES.form);

  if (!category) {
    return null;
  }

  const updatedLabel = formatTableDate(category.updated_at, {
    locale,
    isMobile,
    fallback: tForm('values.empty'),
  });
  const createdLabel = formatTableDate(category.created_at, {
    locale,
    isMobile,
    fallback: tForm('values.empty'),
  });

  return (
    <TableDetailDialog
      open={open}
      onOpenChange={onOpenChange}
      title={category.name}
      className="max-w-xl"
    >
      <div className="space-y-4">
        <InfoRow label={tForm('fields.slug.label')} value={category.slug} />
        <InfoRow label={tForm('fields.locale.label')} value={category.locale} />
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
