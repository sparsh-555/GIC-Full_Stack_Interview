import { useQuery } from '@tanstack/react-query';
import { employeeApi } from '../api/employeeApi';

export const useEmployees = (cafeId?: string) => {
  return useQuery({
    queryKey: ['employees', cafeId],
    queryFn: () => employeeApi.getEmployees(cafeId),
    staleTime: 5 * 60 * 1000,
  });
};

export { useEmployee } from './useEmployee';
export { useCreateEmployee } from './useCreateEmployee';
export { useUpdateEmployee } from './useUpdateEmployee';
export { useDeleteEmployee } from './useDeleteEmployee';
