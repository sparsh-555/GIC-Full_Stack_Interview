import { api } from './axios.config';
import { Cafe, CreateCafeInput, UpdateCafeInput } from '../../types/cafe.types';

export const cafeApi = {
  getCafes: async (location?: string): Promise<Cafe[]> => {
    const params = location ? { location } : {};
    const response = await api.get<Cafe[]>('/cafes', { params });
    return response.data;
  },

  getCafeById: async (id: string): Promise<Cafe> => {
    const response = await api.get<Cafe>(`/cafes/${id}`);
    return response.data;
  },

  createCafe: async (data: CreateCafeInput & { logoFile?: File }): Promise<Cafe> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('location', data.location);
    if (data.logoFile) {
      formData.append('logo', data.logoFile);
    }

    const response = await api.post<Cafe>('/cafes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateCafe: async (data: UpdateCafeInput & { logoFile?: File }): Promise<Cafe> => {
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('location', data.location);
    if (data.logo && !data.logoFile) {
      formData.append('logo', data.logo);
    }
    if (data.logoFile) {
      formData.append('logo', data.logoFile);
    }

    const response = await api.put<Cafe>('/cafes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteCafe: async (id: string): Promise<void> => {
    await api.delete(`/cafes/${id}`);
  },
};
