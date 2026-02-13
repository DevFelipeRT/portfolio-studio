import { HomeBadge } from './HomeBadge';

interface PageSlugProps {
  slug: string;
  isHome: boolean;
}

/**
 * Slug display with optional "Home" badge.
 */
export function PageSlug({ slug, isHome }: PageSlugProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="bg-muted text-muted-foreground inline-flex rounded px-2 py-0.5 font-mono text-xs">
        {slug}
      </span>

      <HomeBadge visible={isHome} />
    </div>
  );
}
