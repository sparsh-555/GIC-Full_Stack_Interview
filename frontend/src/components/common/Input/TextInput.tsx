import { InputHTMLAttributes, forwardRef, useState } from 'react';
import './TextInput.css';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, required, className = '', maxLength, onChange, ...props }, ref) => {
    const [charCount, setCharCount] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharCount(e.target.value.length);
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="text-input-wrapper">
        <label className="text-input-label">
          {label}
          {required && <span className="required-mark"> *</span>}
        </label>
        <input
          ref={ref}
          className={`text-input ${error ? 'error' : ''} ${className}`}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        {error && <span className="error-message">{error}</span>}
        {maxLength && (
          <span className="char-count">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';
