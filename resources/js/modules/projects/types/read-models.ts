import type {
  ProjectDetailSkill,
  ProjectImage,
  Timestamped,
} from './entity';

/**
 * Expanded read model loaded for the admin project overlay.
 */
export interface ProjectDetail extends Timestamped {
  id: number;
  locale: string;
  name: string;
  summary: string | null;
  description: string | null;
  status: string | null;
  repository_url: string | null;
  live_url: string | null;
  images: ProjectImage[];
  skills: ProjectDetailSkill[];
  display: boolean;
}

/**
 * Translation record returned by the project translations endpoints.
 */
export interface ProjectTranslationItem extends Timestamped {
  id: number;
  project_id: number;
  locale: string;
  name: string | null;
  summary: string | null;
  description: string | null;
  repository_url: string | null;
  live_url: string | null;
}
