import { formatTableDate, ItemDialog, TableBadge } from '@/common/table';
import { useTranslation } from '@/common/i18n';
import { useIsMobile } from '@/hooks/useMobile';
import type { AdminSkillListItem } from '@/modules/skills/core/types';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';
import { OverlayInfoRow } from './_partials';

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
    <ItemDialog open={open} onOpenChange={onOpenChange}>
        <ItemDialog.Content className="max-w-xl">
          <ItemDialog.Header>
          <ItemDialog.Main>
            <ItemDialog.Heading>
              <ItemDialog.Title>{skill.name}</ItemDialog.Title>
            </ItemDialog.Heading>

            <ItemDialog.Badges>
              <TableBadge tone="outline" className="border-dashed font-medium">
                {skill.category?.name ?? tForm('fields.category.uncategorized')}
              </TableBadge>
              <span className="bg-muted text-muted-foreground inline-flex rounded px-2 py-0.5 font-mono text-xs">
                {skill.locale}
              </span>
            </ItemDialog.Badges>
          </ItemDialog.Main>

          <ItemDialog.Metadata>
            <span>{tForm('fields.created_at.label')}: {createdLabel}</span>
            <span>{tForm('fields.updated_at.label')}: {updatedLabel}</span>
          </ItemDialog.Metadata>
        </ItemDialog.Header>

        <ItemDialog.Body>
          <OverlayInfoRow
            label={tForm('fields.category.label')}
            value={skill.category?.name ?? tForm('fields.category.uncategorized')}
          />
        </ItemDialog.Body>
      </ItemDialog.Content>
    </ItemDialog>
  );
}
