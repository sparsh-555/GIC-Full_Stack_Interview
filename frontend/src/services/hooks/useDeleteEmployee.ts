import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '../api/employeeApi';

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeApi.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['cafes'] });
    },
  });
};
