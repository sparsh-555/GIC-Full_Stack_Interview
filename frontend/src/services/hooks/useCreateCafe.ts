import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cafeApi } from '../api/cafeApi';
import { CreateCafeInput } from '../../types/cafe.types';

export const useCreateCafe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCafeInput) => cafeApi.createCafe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cafes'] });
    },
  });
};
