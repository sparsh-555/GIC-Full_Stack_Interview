import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cafeApi } from '../api/cafeApi';

export const useDeleteCafe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cafeApi.deleteCafe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cafes'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
