/**
 * Listing rules for content-managed pages.
 *
 * Keep these rules UI-oriented and stable. Avoid importing React/UI components.
 */
export function isHomePage(homeSlug: string | undefined, pageSlug: string): boolean {
  return Boolean(homeSlug && pageSlug === homeSlug);
}

/**
 * Resolves the public URL for a page.
 *
 * Home is resolved via the `home` route, while other pages use `content.pages.show`.
 */
export function publicPageUrl(isHome: boolean, pageSlug: string): string {
  if (isHome) {
    return route('home');
  }

  return route('content.pages.show', pageSlug);
}

/**
 * Determines whether the "Set as home" action should be available for the page.
 *
 * Note: preserves current behavior where an undefined `homeSlug` still allows
 * the action to be shown.
 */
export function canSetAsHome(homeSlug: string | undefined, pageSlug: string): boolean {
  return homeSlug !== pageSlug;
}
