import { InfoBadge } from '@/components/badges';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';

interface SectionMetaBadgesProps {
  slot?: string | null;
  anchor?: string | null;
  navigationLabel?: string | null;
  navigationGroup?: string | null;
}

/**
 * Small badges rendered inline under the section title.
 *
 * All inputs are already derived; this component does not know about Section DTOs.
 */
export function SectionMetaBadges({
  slot,
  anchor,
  navigationLabel,
  navigationGroup,
}: SectionMetaBadgesProps) {
  const { translate: tSections } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.sections,
  );

  return (
    <>
      {slot && (
        <InfoBadge tone="muted">
          {tSections('meta.slot', 'Slot: {{value}}', { value: slot })}
        </InfoBadge>
      )}

      {anchor && (
        <InfoBadge tone="muted">
          #{anchor}
        </InfoBadge>
      )}

      {navigationLabel && (
        <InfoBadge tone="muted">
          {tSections('meta.navigation', 'Nav: {{value}}', {
            value: navigationLabel,
          })}
        </InfoBadge>
      )}

      {navigationGroup && (
        <InfoBadge tone="muted">
          {tSections('meta.group', 'Group: {{value}}', {
            value: navigationGroup,
          })}
        </InfoBadge>
      )}
    </>
  );
}
