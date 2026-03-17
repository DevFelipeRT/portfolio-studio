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
        <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
          {tSections('meta.slot', 'Slot: {{value}}', { value: slot })}
        </span>
      )}

      {anchor && (
        <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
          #{anchor}
        </span>
      )}

      {navigationLabel && (
        <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
          {tSections('meta.navigation', 'Nav: {{value}}', {
            value: navigationLabel,
          })}
        </span>
      )}

      {navigationGroup && (
        <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
          {tSections('meta.group', 'Group: {{value}}', {
            value: navigationGroup,
          })}
        </span>
      )}
    </>
  );
}
