import type { ProjectFormData } from '@/modules/projects/admin/management/types';
import type { Project } from '@/modules/projects/types';
import type { SkillCatalogItem } from '@/modules/skills/core/types';

export interface EditProjectProps {
  project: Project;
  skills: SkillCatalogItem[];
  status_values: string[];
  initial: ProjectFormData;
}
