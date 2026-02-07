export function buildSectionIdentity(
  parentIdentity: string | null,
  id: string,
): string {
  if (!parentIdentity) {
    return id;
  }

  return `${parentIdentity}.${id}`;
}
