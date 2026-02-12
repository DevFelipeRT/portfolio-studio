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
  return (
    <>
      {slot && (
        <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
          Slot: {slot}
        </span>
      )}

      {anchor && (
        <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
          #{anchor}
        </span>
      )}

      {navigationLabel && (
        <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
          Nav: {navigationLabel}
        </span>
      )}

      {navigationGroup && (
        <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
          Group: {navigationGroup}
        </span>
      )}
    </>
  );
}
