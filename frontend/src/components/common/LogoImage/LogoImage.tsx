import { useState } from 'react';
import { getLogoUrl } from '../../../utils/imageHelpers';
import './LogoImage.css';

interface LogoImageProps {
  logoPath: string | null;
  altText: string;
  size?: 'small' | 'medium' | 'large';
  showPlaceholder?: boolean;
}

export function LogoImage({ logoPath, altText, size = 'medium', showPlaceholder = true }: LogoImageProps) {
  const [imageError, setImageError] = useState(false);
  const logoUrl = getLogoUrl(logoPath);

  const handleImageError = () => {
    setImageError(true);
  };

  // If no logo or image failed to load, show placeholder
  if (!logoUrl || imageError) {
    if (!showPlaceholder) return null;

    return (
      <div className={`logo-placeholder logo-${size}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={altText}
      className={`logo-image logo-${size}`}
      onError={handleImageError}
    />
  );
}
