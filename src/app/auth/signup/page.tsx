"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
  FiBriefcase,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { signupSchema } from "@/validation/auth";
import { ZodError } from "zod";
import { SignUpData, UserRole } from "@/types/auth";
import { useToast } from "@/components/providers/ToastProvider";
import AuthLayout from "@/app/auth/_components/AuthLayout";
import AuthInput from "@/app/auth/_components/AuthInput";
import AuthButton from "@/app/auth/_components/AuthButton";
import SocialLogin from "@/app/auth/_components/SocialLogin";

export default function SignUpPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const signUpData: SignUpData = {
      name: formData.get("name") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      role: formData.get("role") as UserRole,
    };

    // Client-side validation using Zod
    try {
      signupSchema.parse(signUpData);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          errors[field] = err.message;
        });
        setFieldErrors(errors);
        // Show the first error message in a toast
        showToast(error.errors[0].message, "error");
      } else {
        showToast("Validation error", "error");
      }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      showToast("Account created! Please verify your email.", "success");
      router.push("/auth/verify-email?email=" + signUpData.email);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "An error occurred",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join us to get started">
      <SocialLogin />

      <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <AuthInput
              id="name"
              name="name"
              type="text"
              label="Full Name"
              placeholder="John Doe"
              icon={FiUser}
              error={fieldErrors.name}
            />

            <AuthInput
              id="username"
              name="username"
              type="text"
              label="Username"
              placeholder="johndoe"
              icon={FiUserPlus}
              error={fieldErrors.username}
            />
          </div>

          <AuthInput
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="johndoe@example.com"
            icon={FiMail}
            error={fieldErrors.email}
          />

          <AuthInput
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="••••••••"
            icon={FiLock}
            error={fieldErrors.password}
            endIcon={
              <button type="button" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <FiEyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                ) : (
                  <FiEye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                )}
              </button>
            }
          />

          <AuthInput
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            placeholder="••••••••"
            icon={FiLock}
            error={fieldErrors.confirmPassword}
            endIcon={
              <button type="button" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? (
                  <FiEyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                ) : (
                  <FiEye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                )}
              </button>
            }
          />

          <div>
            <label
              htmlFor="role"
              className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Account Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiBriefcase className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <select
                id="role"
                name="role"
                required
                className="pl-10 block w-full px-3 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-xs sm:text-sm"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <AuthButton
          type="submit"
          loading={loading}
          loadingText="Creating account..."
        >
          Create Account
        </AuthButton>
      </form>

      <div className="text-center mt-4 sm:mt-6">
        <Link
          href="/auth/login"
          className="font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-xs sm:text-sm"
        >
          Already have an account? <span className="underline">Sign in</span>
        </Link>
      </div>
    </AuthLayout>
  );
}
