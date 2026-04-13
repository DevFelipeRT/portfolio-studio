/**
 * Lightweight row contract for the admin projects index.
 */
export interface ProjectListItem {
  id: number;
  locale: string;
  name: string;
  summary: string | null;
  status: string | null;
  display: boolean;
  image_count: number;
}
