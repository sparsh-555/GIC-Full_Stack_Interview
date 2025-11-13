import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout/Layout';
import { CafePage } from './pages/CafePage/CafePage';
import { EmployeePage } from './pages/EmployeePage/EmployeePage';
import { AddEditCafePage } from './pages/AddEditCafePage/AddEditCafePage';
import { AddEditEmployeePage } from './pages/AddEditEmployeePage/AddEditEmployeePage';

export function AppRouter() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/cafes" replace />} />
        <Route path="/cafes" element={<CafePage />} />
        <Route path="/cafes/new" element={<AddEditCafePage />} />
        <Route path="/cafes/edit/:id" element={<AddEditCafePage />} />
        <Route path="/employees" element={<EmployeePage />} />
        <Route path="/employees/new" element={<AddEditEmployeePage />} />
        <Route path="/employees/edit/:id" element={<AddEditEmployeePage />} />
      </Routes>
    </Layout>
  );
}
