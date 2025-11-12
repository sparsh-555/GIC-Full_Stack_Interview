import { api } from './axios.config';
import { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '../../types/employee.types';

export const employeeApi = {
  getEmployees: async (cafeId?: string): Promise<Employee[]> => {
    const params = cafeId ? { cafe: cafeId } : {};
    const response = await api.get<Employee[]>('/employees', { params });
    return response.data;
  },

  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await api.get<Employee>(`/employees/${id}`);
    return response.data;
  },

  createEmployee: async (data: CreateEmployeeInput): Promise<Employee> => {
    const response = await api.post<Employee>('/employees', data);
    return response.data;
  },

  updateEmployee: async (data: UpdateEmployeeInput): Promise<Employee> => {
    const response = await api.put<Employee>('/employees', data);
    return response.data;
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};
