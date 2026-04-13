export function hasFormContent({
  name,
  summary,
  description,
}: {
  name: string;
  summary: string;
  description: string;
}): boolean {
  return (
    name.trim() !== '' ||
    summary.trim() !== '' ||
    description.trim() !== ''
  );
}
