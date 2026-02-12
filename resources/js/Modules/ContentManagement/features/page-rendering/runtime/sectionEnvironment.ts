import type { SocialLinkItem } from '@/Modules/ContactChannels/ui/SocialLinksBar';

/**
 * Shape of the environment object provided to section rendering runtime.
 */
export interface SectionEnvironment {
  /**
   * Optional list of social links available to section components.
   */
  socialLinks?: SocialLinkItem[];
}

/**
 * Returns the default section environment object.
 */
export function createDefaultSectionEnvironment(): SectionEnvironment {
  return {};
}
