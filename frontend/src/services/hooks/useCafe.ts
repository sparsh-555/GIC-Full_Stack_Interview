import { useQuery } from '@tanstack/react-query';
import { cafeApi } from '../api/cafeApi';

export const useCafe = (id: string) => {
  return useQuery({
    queryKey: ['cafe', id],
    queryFn: () => cafeApi.getCafeById(id),
    enabled: !!id,
  });
};
