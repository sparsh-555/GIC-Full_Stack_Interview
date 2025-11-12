import { useQuery } from '@tanstack/react-query';
import { employeeApi } from '../api/employeeApi';

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeApi.getEmployeeById(id),
    enabled: !!id,
  });
};
