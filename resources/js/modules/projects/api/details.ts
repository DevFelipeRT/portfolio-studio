import type { ProjectDetail } from '@/modules/projects/types';

export async function fetchProjectDetail(
  projectId: number,
): Promise<ProjectDetail> {
  const response = await window.axios.get(route('projects.details', projectId));

  return response.data?.data as ProjectDetail;
}
