/**
 * Image helper utilities for handling café logos
 */

/**
 * Converts a backend logo path to a full URL
 * @param logoPath - The logo path from the backend (e.g., "/uploads/logo-123.png")
 * @returns Full URL to access the logo image
 */
export const getLogoUrl = (logoPath: string | null): string | null => {
  if (!logoPath) return null;

  // Get the API base URL without the /api suffix
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const baseUrl = apiUrl.replace(/\/api$/, '');

  // If logoPath already starts with http, return as is
  if (logoPath.startsWith('http')) {
    return logoPath;
  }

  // Construct full URL
  return `${baseUrl}${logoPath}`;
};

/**
 * Creates a preview URL for a File object
 * @param file - The File object to preview
 * @returns Object URL for the file
 */
export const createFilePreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revokes a preview URL to free memory
 * @param url - The object URL to revoke
 */
export const revokeFilePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};
