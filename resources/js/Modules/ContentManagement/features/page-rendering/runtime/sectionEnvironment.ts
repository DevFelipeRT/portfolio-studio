import type { SocialLinkItem } from '@/Modules/ContactChannels/ui/SocialLinksBar';

/**
 * Represents ambient data available to content-managed sections.
 *
 * This environment is intended for front-only concerns that are
 * not part of CMS-managed section data, such as shared UI resources.
 */
export interface SectionEnvironment {
  /**
   * Optional social link items that can be displayed by sections
   * that support social contact channels.
   */
  socialLinks?: SocialLinkItem[];
}

/**
 * Creates a default section environment with no ambient data.
 */
export function createDefaultSectionEnvironment(): SectionEnvironment {
  return {};
}
