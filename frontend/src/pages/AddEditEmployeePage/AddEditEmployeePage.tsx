import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { message, Modal } from 'antd';
import { Button } from '../../components/common/Button/Button';
import { TextInput } from '../../components/common/Input/TextInput';
import { RadioGroup } from '../../components/common/RadioGroup/RadioGroup';
import { Dropdown } from '../../components/common/Dropdown/Dropdown';
import { useEmployee, useCreateEmployee, useUpdateEmployee } from '../../services/hooks/useEmployees';
import { useCafes } from '../../services/hooks/useCafes';
import { VALIDATION_RULES, GENDER_OPTIONS } from '../../utils/constants';
import './AddEditEmployeePage.css';

const employeeSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.NAME.MIN, `Name must be at least ${VALIDATION_RULES.NAME.MIN} characters`)
    .max(VALIDATION_RULES.NAME.MAX, `Name must not exceed ${VALIDATION_RULES.NAME.MAX} characters`),
  emailAddress: z
    .string()
    .min(1, 'Email is required')
    .regex(VALIDATION_RULES.EMAIL.PATTERN, VALIDATION_RULES.EMAIL.MESSAGE),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(VALIDATION_RULES.PHONE.PATTERN, VALIDATION_RULES.PHONE.MESSAGE),
  gender: z.enum(['Male', 'Female'], {
    errorMap: () => ({ message: 'Please select a gender' }),
  }),
  cafeId: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export function AddEditEmployeePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: employee, isLoading: isLoadingEmployee } = useEmployee(id || '');
  const { data: cafes } = useCafes();
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      emailAddress: '',
      phoneNumber: '',
      gender: 'Male',
      cafeId: undefined,
    },
  });

  useEffect(() => {
    if (employee && isEditMode) {
      // Find the cafe ID from the cafe name
      const employeeCafe = cafes?.find((cafe) => cafe.name === employee.cafe);

      reset({
        name: employee.name,
        emailAddress: employee.emailAddress,
        phoneNumber: employee.phoneNumber,
        gender: employee.gender,
        cafeId: employeeCafe?.id || undefined,
      });
    }
  }, [employee, isEditMode, reset, cafes]);

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

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Modal.confirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. Are you sure you want to leave?',
        okText: 'Leave',
        cancelText: 'Stay',
        onOk: () => navigate('/employees'),
      });
    } else {
      navigate('/employees');
    }
  };

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (isEditMode && id) {
        await updateEmployeeMutation.mutateAsync({
          id,
          name: data.name,
          emailAddress: data.emailAddress,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          cafeId: data.cafeId || undefined,
        });
        message.success('Employee updated successfully');
      } else {
        await createEmployeeMutation.mutateAsync({
          name: data.name,
          emailAddress: data.emailAddress,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          cafeId: data.cafeId || undefined,
        });
        message.success('Employee created successfully');
      }
      setHasUnsavedChanges(false);
      navigate('/employees');
    } catch (error: any) {
      message.error(error.message || 'Failed to save employee');
    }
  };

  const cafeOptions = cafes?.map((cafe) => ({
    label: cafe.name,
    value: cafe.id,
  })) || [];

  if (isEditMode && isLoadingEmployee) {
    return <div className="page-container">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="employee-form">
        <TextInput
          label="Name"
          {...register('name')}
          error={errors.name?.message}
          required
          maxLength={VALIDATION_RULES.NAME.MAX}
        />

        <TextInput
          label="Email Address"
          type="email"
          {...register('emailAddress')}
          error={errors.emailAddress?.message}
          required
        />

        <TextInput
          label="Phone Number"
          {...register('phoneNumber')}
          error={errors.phoneNumber?.message}
          required
          placeholder="e.g., 81234567"
        />

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Gender"
              options={GENDER_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.gender?.message}
              required
            />
          )}
        />

        <Controller
          name="cafeId"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Assigned Café"
              options={cafeOptions}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select a café (optional)"
              error={errors.cafeId?.message}
            />
          )}
        />

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createEmployeeMutation.isPending || updateEmployeeMutation.isPending}
          >
            {isEditMode ? 'Update' : 'Create'} Employee
          </Button>
        </div>
      </form>
    </div>
  );
}
