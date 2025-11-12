import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cafeApi } from '../api/cafeApi';
import { UpdateCafeInput } from '../../types/cafe.types';

export const useUpdateCafe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCafeInput) => cafeApi.updateCafe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cafes'] });
    },
  });
};
