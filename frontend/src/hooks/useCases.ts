import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

export function useCases() {
  const queryClient = useQueryClient();

  const casesQuery = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const res = await apiClient.get('/cases');
      return res.data;
    },
  });

  const resolveCaseMutation = useMutation({
    mutationFn: async ({ caseId, resolution, notes }: { caseId: string; resolution: string; notes: string }) => {
      return apiClient.patch(`/cases/${caseId}/resolve`, { resolution, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });

  return { ...casesQuery, resolveCase: resolveCaseMutation.mutateAsync };
}
