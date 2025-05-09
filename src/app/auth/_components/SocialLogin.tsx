import React from "react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

const SocialLogin: React.FC = () => {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-2 sm:gap-3 py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-offset-gray-800 text-xs sm:text-sm"
      >
        <FcGoogle className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>Continue with Google</span>
      </button>

      <div className="flex items-center justify-center">
        <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
        <div className="px-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          OR
        </div>
        <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
      </div>
    </div>
  );
};

export default SocialLogin;
