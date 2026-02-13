export interface ComponentRegistryProvider<
  TRegistry extends Record<string, unknown> = Record<string, unknown>,
> {
  getSectionRegistry(): TRegistry;
}
