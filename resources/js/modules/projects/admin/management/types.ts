/**
 * Client-side representation of a pending project image upload row.
 */
export type ProjectImageInput = {
  file: File | null;
  alt?: string;
};

/**
 * Writable form state used by the create and edit project flows.
 */
export type ProjectFormData = {
  locale: string;
  confirm_swap?: boolean;
  name: string;
  summary: string;
  description: string;
  status: string;
  repository_url: string;
  live_url: string;
  display: boolean;
  skill_ids: number[];
  images: ProjectImageInput[];
};
