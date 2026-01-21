import * as React from "react";
import { Skeleton } from "@/Components/Ui/skeleton";

type LinkedInBadgeSize = "medium" | "large";
type LinkedInBadgeTheme = "light" | "dark";
type LinkedInBadgeType = "VERTICAL" | "HORIZONTAL";
type LinkedInBadgeStatus = "loading" | "ready" | "failed";

export type LinkedInProfileBadgeProps = {
  vanity: string;
  locale?: string;
  size?: LinkedInBadgeSize;
  theme?: LinkedInBadgeTheme;
  type?: LinkedInBadgeType;

  href?: string;

  className?: string;
  badgeClassName?: string;
  skeletonClassName?: string;

  timeoutMs?: number;
};

const LINKEDIN_BADGE_SCRIPT_SRC = "https://platform.linkedin.com/badges/js/profile.js";
const LINKEDIN_BADGE_SCRIPT_ID = "linkedin-profile-badge-script";

let scriptLoadPromise: Promise<void> | null = null;

function cn(...values: Array<string | undefined | null | false>): string {
  return values.filter(Boolean).join(" ");
}

function computeDefaultMinHeight(size: LinkedInBadgeSize, type: LinkedInBadgeType): string {
  if (type === "HORIZONTAL") return size === "large" ? "min-h-[320px]" : "min-h-[260px]";
  return size === "large" ? "min-h-[420px]" : "min-h-[360px]";
}

function ensureLinkedInScriptLoaded(): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.resolve();
  }

  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(LINKEDIN_BADGE_SCRIPT_ID) as HTMLScriptElement | null;

    if (existing) {
      if ((window as any).LIRenderAll) {
        resolve();
        return;
      }

      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("LinkedIn badge script failed to load.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = LINKEDIN_BADGE_SCRIPT_ID;
    script.src = LINKEDIN_BADGE_SCRIPT_SRC;
    script.type = "text/javascript";
    script.async = false;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("LinkedIn badge script failed to load."));

    document.body.appendChild(script);
  });

  return scriptLoadPromise;
}

function isBadgeRendered(container: HTMLElement): boolean {
  return container.getAttribute("data-rendered") === "true";
}

function hasIframe(container: HTMLElement): boolean {
  return Boolean(container.querySelector("iframe"));
}

export function LinkedInProfileBadge({
  vanity,
  locale = "pt_BR",
  size = "medium",
  theme = "light",
  type = "VERTICAL",
  href,
  className,
  badgeClassName,
  skeletonClassName,
  timeoutMs = 8000,
}: LinkedInProfileBadgeProps): React.ReactElement {
  const badgeRef = React.useRef<HTMLDivElement | null>(null);
  const runIdRef = React.useRef(0);
  const [status, setStatus] = React.useState<LinkedInBadgeStatus>("loading");

  const resolvedHref = React.useMemo(() => {
    if (href && href.trim().length > 0) return href;
    return `https://www.linkedin.com/in/${encodeURIComponent(vanity)}`;
  }, [href, vanity]);

  const badgeKey = React.useMemo(() => {
    return [vanity, locale, size, theme, type].join("|");
  }, [vanity, locale, size, theme, type]);

  React.useEffect(() => {
    const container = badgeRef.current;
    if (!container) return;

    runIdRef.current += 1;
    const runId = runIdRef.current;

    let timeoutHandle: number | null = null;
    let observer: MutationObserver | null = null;

    const cleanup = (): void => {
      if (observer) observer.disconnect();
      if (timeoutHandle) window.clearTimeout(timeoutHandle);
      observer = null;
      timeoutHandle = null;
    };

    const resetContainer = (): void => {
      container.removeAttribute("data-rendered");
      container.removeAttribute("data-uid");

      while (container.firstChild) container.removeChild(container.firstChild);

      const link = document.createElement("a");
      link.className = "badge-base__link LI-simple-link sr-only";
      link.href = resolvedHref;
      link.textContent = vanity;
      container.appendChild(link);
    };

    const markReadyIfPossible = (): void => {
      if (runId !== runIdRef.current) return;

      if (isBadgeRendered(container) && hasIframe(container)) {
        setStatus("ready");
        cleanup();
      }
    };

    const run = async (): Promise<void> => {
      setStatus("loading");
      resetContainer();

      timeoutHandle = window.setTimeout(() => {
        if (runId !== runIdRef.current) return;
        setStatus("failed");
        cleanup();
      }, timeoutMs);

      observer = new MutationObserver(() => markReadyIfPossible());
      observer.observe(container, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ["data-rendered", "data-uid"],
      });

      try {
        await ensureLinkedInScriptLoaded();
      } catch {
        if (runId !== runIdRef.current) return;
        setStatus("failed");
        cleanup();
        return;
      }

      if (runId !== runIdRef.current) return;

      try {
        (window as any).LIRenderAll?.();
      } catch {
        setStatus("failed");
        cleanup();
        return;
      }

      markReadyIfPossible();
    };

    void run();

    return () => cleanup();
  }, [badgeKey, resolvedHref, timeoutMs, vanity]);

  const minHeightClass = computeDefaultMinHeight(size, type);
  const showSkeleton = status !== "ready";

  return (
    <div className={cn("relative", minHeightClass, className)} aria-busy={showSkeleton}>
      {showSkeleton && <Skeleton className={cn("absolute inset-0 rounded-md", skeletonClassName)} />}

      <div
        ref={badgeRef}
        key={badgeKey}
        className={cn("badge-base LI-profile-badge", badgeClassName)}
        data-locale={locale}
        data-size={size}
        data-theme={theme}
        data-type={type}
        data-vanity={vanity}
        data-version="v1"
      />
    </div>
  );
}
