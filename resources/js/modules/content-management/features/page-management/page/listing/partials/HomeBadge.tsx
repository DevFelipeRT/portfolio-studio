import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';

interface HomeBadgeProps {
  visible: boolean;
}

/**
 * Small "Home" badge shown next to a slug.
 */
export function HomeBadge({ visible }: HomeBadgeProps) {
  const { translate: tPages } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.pages,
  );

  if (!visible) {
    return null;
  }

  return (
    <span className="bg-primary/10 text-primary inline-flex rounded px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
      {tPages('listing.home', 'Home')}
    </span>
  );
}
