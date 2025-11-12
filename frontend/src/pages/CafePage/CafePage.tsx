import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { message, Modal, Input, Spin } from 'antd';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button } from '../../components/common/Button/Button';
import { LogoImage } from '../../components/common/LogoImage/LogoImage';
import { useCafes, useDeleteCafe } from '../../services/hooks/useCafes';
import { Cafe } from '../../types/cafe.types';
import './CafePage.css';

export function CafePage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const { data: cafes, isLoading, error } = useCafes(location);
  const deleteCafeMutation = useDeleteCafe();

  const handleDelete = (cafe: Cafe) => {
    Modal.confirm({
      title: 'Delete Café',
      content: `Are you sure you want to delete "${cafe.name}"? This will also delete all employees under this café.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteCafeMutation.mutateAsync(cafe.id);
          message.success('Café deleted successfully');
        } catch (error: any) {
          message.error(error.message || 'Failed to delete café');
        }
      },
    });
  };

  const handleEmployeesClick = (cafeId: string) => {
    navigate(`/employees?cafe=${cafeId}`);
  };

  const columnDefs: ColDef<Cafe>[] = [
    {
      headerName: 'Logo',
      field: 'logo',
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <LogoImage
              logoPath={params.data.logo}
              altText={params.data.name}
              size="small"
            />
          </div>
        );
      },
    },
    {
      headerName: 'Name',
      field: 'name',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Description',
      field: 'description',
      sortable: true,
      filter: true,
      flex: 2,
    },
    {
      headerName: 'Employees',
      field: 'employees',
      sortable: true,
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <button
            className="link-button"
            onClick={() => handleEmployeesClick(params.data.id)}
          >
            {params.value}
          </button>
        );
      },
    },
    {
      headerName: 'Location',
      field: 'location',
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
              onClick={() => navigate(`/cafes/edit/${params.data.id}`)}
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
          <h3>Error loading cafés</h3>
          <p>{(error as any).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Cafés</h1>
        <Button onClick={() => navigate('/cafes/new')}>Add New Café</Button>
      </div>

      <div className="filter-section">
        <Input
          placeholder="Filter by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      {isLoading ? (
        <div className="loading-state">
          <Spin size="large" />
        </div>
      ) : (
        <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
          <AgGridReact
            rowData={cafes}
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
