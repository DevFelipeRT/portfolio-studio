import { formatTableDate, ItemDialog } from '@/common/table';
import { useTranslation } from '@/common/i18n';
import { useIsMobile } from '@/hooks/useMobile';
import type { AdminSkillCategoryRecord } from '@/modules/skills/core/types';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';
import { OverlayInfoRow } from './_partials';

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
    <ItemDialog open={open} onOpenChange={onOpenChange}>
        <ItemDialog.Content className="max-w-xl">
          <ItemDialog.Header>
            <ItemDialog.Main>
            <ItemDialog.Heading>
              <ItemDialog.Title>{category.name}</ItemDialog.Title>
            </ItemDialog.Heading>
          </ItemDialog.Main>

          <ItemDialog.Metadata>
            <span>{tForm('fields.locale.label')}: {category.locale}</span>
            <span>{tForm('fields.created_at.label')}: {createdLabel}</span>
            <span>{tForm('fields.updated_at.label')}: {updatedLabel}</span>
          </ItemDialog.Metadata>
        </ItemDialog.Header>

        <ItemDialog.Body>
          <OverlayInfoRow
            label={tForm('fields.slug.label')}
            value={category.slug}
          />
        </ItemDialog.Body>
      </ItemDialog.Content>
    </ItemDialog>
  );
}
