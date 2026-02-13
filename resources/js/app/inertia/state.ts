import type { InertiaPageProps } from './types';

type InertiaRuntimeState = {
  propsCache: InertiaPageProps;
  titleTemplate: string | null;
  siteName: Record<string, string> | null;
  defaultMetaTitle: Record<string, string> | null;
  ownerName: string | null;
};

let state: InertiaRuntimeState = {
  propsCache: {},
  titleTemplate: null,
  siteName: null,
  defaultMetaTitle: null,
  ownerName: null,
};

export function getInertiaRuntimeState(): InertiaRuntimeState {
  return state;
}

export function initializeInertiaRuntimeState(
  initialProps: InertiaPageProps,
): void {
  state = {
    propsCache: initialProps,
    titleTemplate: initialProps.websiteSettings?.metaTitleTemplate ?? null,
    siteName: initialProps.websiteSettings?.siteName ?? null,
    defaultMetaTitle: initialProps.websiteSettings?.defaultMetaTitle ?? null,
    ownerName: initialProps.websiteSettings?.ownerName ?? null,
  };
}

