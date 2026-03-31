import type { InitiativeDetail } from '@/modules/initiatives/core/types';

export async function fetchInitiativeDetail(
  initiativeId: number,
): Promise<InitiativeDetail> {
  const response = await window.axios.get(
    route('initiatives.details', initiativeId),
  );

  return response.data?.data as InitiativeDetail;
}
