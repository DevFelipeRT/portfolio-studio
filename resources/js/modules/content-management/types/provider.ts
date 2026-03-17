export interface ComponentRegistryProvider<
  TRegistry extends Record<string, unknown> = Record<string, unknown>,
> {
  i18n?: readonly string[];
  getSectionRegistry(): TRegistry;
}
