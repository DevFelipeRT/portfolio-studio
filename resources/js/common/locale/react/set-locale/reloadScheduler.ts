export type ReloadTimerRef = { current: number | null };
export type LastRequestedLocaleRef = { current: string | null };
export type LastPersistPromiseRef = { current: Promise<unknown> | null };

export type ReloadFn = (pathname: string) => void;

function cancelScheduledReload(reloadTimerId: ReloadTimerRef): void {
  if (reloadTimerId.current === null) {
    return;
  }

  window.clearTimeout(reloadTimerId.current);
  reloadTimerId.current = null;
}

/**
 * Schedules a debounced reload after the persistence promise resolves.
 *
 * Returns a cancellation function for the scheduled reload.
 */
export function scheduleReload(options: {
  reloadTimerId: ReloadTimerRef;
  lastRequestedLocale: LastRequestedLocaleRef;
  lastPersistPromise: LastPersistPromiseRef;
  reloadDelayMs: number;
  resolvedLocale: string;
  reload?: ReloadFn;
}): () => void {
  const {
    reloadTimerId,
    lastRequestedLocale,
    lastPersistPromise,
    reloadDelayMs,
    resolvedLocale,
    reload,
  } = options;

  cancelScheduledReload(reloadTimerId);

  if (reloadDelayMs < 0) {
    return () => cancelScheduledReload(reloadTimerId);
  }

  const reloadFn: ReloadFn =
    reload ?? ((pathname) => window.location.assign(pathname));

  const timerId = window.setTimeout(() => {
    if (lastRequestedLocale.current !== resolvedLocale) {
      return;
    }

    void (async () => {
      await lastPersistPromise.current;
      reloadFn(window.location.pathname);
    })();
  }, reloadDelayMs);
  reloadTimerId.current = timerId;

  return () => {
    if (reloadTimerId.current === timerId) {
      cancelScheduledReload(reloadTimerId);
      return;
    }

    window.clearTimeout(timerId);
  };
}
