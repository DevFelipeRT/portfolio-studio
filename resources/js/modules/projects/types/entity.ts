import type { Image } from '@/modules/images/core/types';

/**
 * Shared timestamp metadata attached to project-related payloads from the
 * backend.
 */
export interface Timestamped {
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Image as used in the project domain, including relation metadata.
 */
export interface ProjectImage extends Image {
  position: number;
  is_cover: boolean;
  caption: string | null;
  alt?: string | null;
  title?: string | null;
  src?: string | null;
}

/**
 * Minimal skill projection used in read models that only need skill identity
 * and display name.
 */
export interface ProjectDetailSkill {
  id: number;
  name: string;
}

/**
 * Skill relation shape embedded in the main editable project payload.
 */
export interface ProjectAttachedSkill {
  id: number;
  name: string;
  category?: unknown;
  skill_category_id?: number | null;
}

/**
 * Canonical project entity shape used by the module when rendering or editing
 * a full project record.
 */
export interface Project extends Timestamped {
  id: number;
  locale: string;
  name: string;
  summary: string;
  description: string;
  status: string;
  repository_url: string | null;
  live_url: string | null;
  images: ProjectImage[] | null;
  skills: ProjectAttachedSkill[];
  display: boolean;
}
