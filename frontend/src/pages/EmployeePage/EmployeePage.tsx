import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { message, Modal, Spin } from 'antd';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button } from '../../components/common/Button/Button';
import { Dropdown } from '../../components/common/Dropdown/Dropdown';
import { useEmployees, useDeleteEmployee } from '../../services/hooks/useEmployees';
import { useCafes } from '../../services/hooks/useCafes';
import { Employee } from '../../types/employee.types';
import './EmployeePage.css';

export function EmployeePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCafeId, setSelectedCafeId] = useState<string | undefined>();

  const { data: cafes } = useCafes();
  const { data: employees, isLoading, error } = useEmployees(selectedCafeId);
  const deleteEmployeeMutation = useDeleteEmployee();

  useEffect(() => {
    const cafeFromUrl = searchParams.get('cafe');
    if (cafeFromUrl) {
      setSelectedCafeId(cafeFromUrl);
    }
  }, [searchParams]);

  const handleDelete = (employee: Employee) => {
    Modal.confirm({
      title: 'Delete Employee',
      content: `Are you sure you want to delete "${employee.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteEmployeeMutation.mutateAsync(employee.id);
          message.success('Employee deleted successfully');
        } catch (error: any) {
          message.error(error.message || 'Failed to delete employee');
        }
      },
    });
  };

  const cafeOptions = cafes?.map((cafe) => ({
    label: cafe.name,
    value: cafe.id,
  })) || [];

  const columnDefs: ColDef<Employee>[] = [
    {
      headerName: 'Employee ID',
      field: 'id',
      sortable: true,
      filter: true,
      width: 140,
    },
    {
      headerName: 'Name',
      field: 'name',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Email',
      field: 'emailAddress',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Phone Number',
      field: 'phoneNumber',
      sortable: true,
      width: 130,
    },
    {
      headerName: 'Days Worked',
      field: 'daysWorked',
      sortable: true,
      width: 130,
    },
    {
      headerName: 'Café',
      field: 'cafe',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Actions',
      width: 180,
      cellRenderer: (params: any) => {
        return (
          <div className="action-buttons">
            <Button
              size="small"
              onClick={() => navigate(`/employees/edit/${params.data.id}`)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={() => handleDelete(params.data)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <h3>Error loading employees</h3>
          <p>{(error as any).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Employees</h1>
        <Button onClick={() => navigate('/employees/new')}>Add New Employee</Button>
      </div>

      <div className="filter-section">
        <Dropdown
          label="Filter by Café"
          options={cafeOptions}
          value={selectedCafeId}
          onChange={(value) => setSelectedCafeId(value)}
          placeholder="All Cafés"
        />
      </div>

      {isLoading ? (
        <div className="loading-state">
          <Spin size="large" />
        </div>
      ) : (
        <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
          <AgGridReact
            rowData={employees}
            columnDefs={columnDefs}
            defaultColDef={{
              resizable: true,
            }}
            pagination={true}
            paginationPageSize={20}
            domLayout="autoHeight"
          />
        </div>
      )}
    </div>
  );
}
