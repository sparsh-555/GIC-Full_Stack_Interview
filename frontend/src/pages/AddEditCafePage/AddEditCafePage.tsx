import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { message, Modal } from 'antd';
import { Button } from '../../components/common/Button/Button';
import { TextInput } from '../../components/common/Input/TextInput';
import { LogoImage } from '../../components/common/LogoImage/LogoImage';
import { useCafe, useCreateCafe, useUpdateCafe } from '../../services/hooks/useCafes';
import { VALIDATION_RULES } from '../../utils/constants';
import { createFilePreviewUrl, revokeFilePreviewUrl } from '../../utils/imageHelpers';
import './AddEditCafePage.css';

const cafeSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.NAME.MIN, `Name must be at least ${VALIDATION_RULES.NAME.MIN} characters`)
    .max(VALIDATION_RULES.NAME.MAX, `Name must not exceed ${VALIDATION_RULES.NAME.MAX} characters`),
  description: z
    .string()
    .max(VALIDATION_RULES.DESCRIPTION.MAX, `Description must not exceed ${VALIDATION_RULES.DESCRIPTION.MAX} characters`)
    .min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
});

type CafeFormData = z.infer<typeof cafeSchema>;

export function AddEditCafePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [shouldRemoveLogo, setShouldRemoveLogo] = useState(false);

  const { data: cafe, isLoading: isLoadingCafe } = useCafe(id || '');
  const createCafeMutation = useCreateCafe();
  const updateCafeMutation = useUpdateCafe();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CafeFormData>({
    resolver: zodResolver(cafeSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
    },
  });

  useEffect(() => {
    if (cafe && isEditMode) {
      reset({
        name: cafe.name,
        description: cafe.description,
        location: cafe.location,
      });
    }
  }, [cafe, isEditMode, reset]);

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle logo file preview
  useEffect(() => {
    if (logoFile) {
      const url = createFilePreviewUrl(logoFile);
      setPreviewUrl(url);
      return () => {
        revokeFilePreviewUrl(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [logoFile]);

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Modal.confirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. Are you sure you want to leave?',
        okText: 'Leave',
        cancelText: 'Stay',
        onOk: () => navigate('/cafes'),
      });
    } else {
      navigate('/cafes');
    }
  };

  const onSubmit = async (data: CafeFormData) => {
    try {
      if (isEditMode && id) {
        await updateCafeMutation.mutateAsync({
          id,
          ...data,
          logo: shouldRemoveLogo ? null : (cafe?.logo || null),
          logoFile: logoFile || undefined,
        } as any);
        message.success('Café updated successfully');
      } else {
        await createCafeMutation.mutateAsync({
          ...data,
          logo: null,
          logoFile: logoFile || undefined,
        } as any);
        message.success('Café created successfully');
      }
      setHasUnsavedChanges(false);
      navigate('/cafes');
    } catch (error: any) {
      message.error(error.message || 'Failed to save café');
    }
  };

  if (isEditMode && isLoadingCafe) {
    return <div className="page-container">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Café' : 'Add New Café'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="cafe-form">
        <TextInput
          label="Name"
          {...register('name')}
          error={errors.name?.message}
          required
          maxLength={VALIDATION_RULES.NAME.MAX}
        />

        <TextInput
          label="Description"
          {...register('description')}
          error={errors.description?.message}
          required
          maxLength={VALIDATION_RULES.DESCRIPTION.MAX}
        />

        <TextInput
          label="Location"
          {...register('location')}
          error={errors.location?.message}
          required
        />

        <div className="logo-section">
          <label className="text-input-label">Logo (Optional)</label>

          {/* Show existing logo or new preview */}
          {(cafe?.logo && !shouldRemoveLogo && !logoFile) && (
            <div className="logo-preview-container">
              <LogoImage
                logoPath={cafe.logo}
                altText={cafe.name}
                size="large"
              />
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => {
                  setShouldRemoveLogo(true);
                  setHasUnsavedChanges(true);
                }}
              >
                Remove Logo
              </Button>
            </div>
          )}

          {/* Show new file preview */}
          {previewUrl && logoFile && (
            <div className="logo-preview-container">
              <img
                src={previewUrl}
                alt="Logo preview"
                className="logo-image logo-large"
              />
              <span className="char-count">New: {logoFile.name}</span>
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => {
                  setLogoFile(null);
                  setPreviewUrl(null);
                }}
              >
                Clear Selection
              </Button>
            </div>
          )}

          {/* Show removed state */}
          {shouldRemoveLogo && !logoFile && (
            <div className="logo-removed-message">
              <span>Logo will be removed</span>
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => setShouldRemoveLogo(false)}
              >
                Undo
              </Button>
            </div>
          )}

          {/* File input */}
          {!previewUrl && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setLogoFile(file);
                  setShouldRemoveLogo(false);
                  setHasUnsavedChanges(true);
                }
              }}
              className="text-input"
            />
          )}
        </div>

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createCafeMutation.isPending || updateCafeMutation.isPending}
          >
            {isEditMode ? 'Update' : 'Create'} Café
          </Button>
        </div>
      </form>
    </div>
  );
}
