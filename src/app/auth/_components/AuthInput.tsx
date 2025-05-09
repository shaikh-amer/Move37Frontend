import React from "react";
import { IconType } from "react-icons";

interface AuthInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  icon: IconType;
  required?: boolean;
  error?: string;
  pattern?: string;
  endIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthInput: React.FC<AuthInputProps> = ({
  id,
  name,
  type,
  label,
  placeholder,
  icon: Icon,
  required = true,
  error,
  pattern,
  endIcon,
  onChange,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        </div>
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          pattern={pattern}
          className="pl-10 pr-10 block w-full px-3 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-xs sm:text-sm"
          placeholder={placeholder}
          onChange={onChange}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default AuthInput;
