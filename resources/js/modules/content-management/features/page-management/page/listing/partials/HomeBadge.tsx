interface HomeBadgeProps {
  visible: boolean;
}

/**
 * Small "Home" badge shown next to a slug.
 */
export function HomeBadge({ visible }: HomeBadgeProps) {
  if (!visible) {
    return null;
  }

  return (
    <span className="bg-primary/10 text-primary inline-flex rounded px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
      Home
    </span>
  );
}
