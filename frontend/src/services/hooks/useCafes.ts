import { useQuery } from '@tanstack/react-query';
import { cafeApi } from '../api/cafeApi';

export const useCafes = (location?: string) => {
  return useQuery({
    queryKey: ['cafes', location],
    queryFn: () => cafeApi.getCafes(location),
    staleTime: 5 * 60 * 1000,
  });
};

export { useCafe } from './useCafe';
export { useCreateCafe } from './useCreateCafe';
export { useUpdateCafe } from './useUpdateCafe';
export { useDeleteCafe } from './useDeleteCafe';
