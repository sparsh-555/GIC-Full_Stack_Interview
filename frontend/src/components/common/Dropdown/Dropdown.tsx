import { Select } from 'antd';
import './Dropdown.css';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  required,
}: DropdownProps) {
  return (
    <div className="dropdown-wrapper">
      <label className="dropdown-label">
        {label}
        {required && <span className="required-mark"> *</span>}
      </label>
      <Select
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        options={options}
        className={`custom-dropdown ${error ? 'error' : ''}`}
        style={{ width: '100%' }}
        allowClear
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
