import { InfoBadge } from '@/components/badges';
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
    <InfoBadge className="bg-primary/10 text-primary px-2 text-[10px] font-semibold tracking-wide uppercase hover:bg-primary/10">
      {tPages('listing.home', 'Home')}
    </InfoBadge>
  );
}
