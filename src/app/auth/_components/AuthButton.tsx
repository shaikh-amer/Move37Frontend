import React from "react";

interface AuthButtonProps {
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  variant?: "primary" | "secondary" | "outlined";
}

const AuthButton: React.FC<AuthButtonProps> = ({
  type = "button",
  loading = false,
  loadingText = "Loading...",
  children,
  onClick,
  fullWidth = true,
  variant = "primary",
}) => {
  const getButtonClasses = () => {
    const baseClasses =
      "flex justify-center items-center py-2 sm:py-3 px-3 sm:px-4 border text-xs sm:text-sm font-medium rounded-lg transition-all ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const widthClasses = fullWidth ? "w-full" : "";

    switch (variant) {
      case "primary":
        return `${baseClasses} ${widthClasses} bg-black hover:bg-gray-800 text-white border-transparent focus:ring-black shadow-lg hover:shadow-xl`;
      case "secondary":
        return `${baseClasses} ${widthClasses} bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-black dark:focus:ring-offset-gray-800`;
      case "outlined":
        return `${baseClasses} ${widthClasses} bg-transparent border-black dark:border-white text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 focus:ring-black`;
      default:
        return `${baseClasses} ${widthClasses} bg-black hover:bg-gray-800 text-white border-transparent focus:ring-black shadow-lg hover:shadow-xl`;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={getButtonClasses()}
    >
      {loading ? (
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default AuthButton;
