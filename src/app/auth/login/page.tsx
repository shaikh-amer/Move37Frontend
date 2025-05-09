"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser, FiLock, FiMail, FiEye, FiEyeOff } from "react-icons/fi";
import { emailSchema, usernameSchema, passwordSchema } from "@/validation/auth";
import { ZodError } from "zod";
import { useToast } from "@/components/providers/ToastProvider";
import AuthLayout from "@/app/auth/_components/AuthLayout";
import AuthInput from "@/app/auth/_components/AuthInput";
import AuthButton from "@/app/auth/_components/AuthButton";
import SocialLogin from "@/app/auth/_components/SocialLogin";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [fieldErrors, setFieldErrors] = useState<{
    emailOrUsername?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<"email" | "username">("email");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    let emailOrUsername =
      loginType === "email"
        ? (formData.get("email") as string)
        : (formData.get("username") as string);
    const password = formData.get("password") as string;

    // Validate based on login type
    if (loginType === "email") {
      const result = emailSchema.safeParse(emailOrUsername);
      if (!result.success) {
        setFieldErrors({ emailOrUsername: result.error.errors[0].message });
        setLoading(false);
        return;
      }
    } else {
      const result = usernameSchema.safeParse(emailOrUsername);
      if (!result.success) {
        setFieldErrors({ emailOrUsername: result.error.errors[0].message });
        setLoading(false);
        return;
      }
    }

    // Validate password
    const passResult = passwordSchema.safeParse(password);
    if (!passResult.success) {
      setFieldErrors((prev) => ({
        ...prev,
        password: passResult.error.errors[0].message,
      }));
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        emailOrUsername,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("not verified")) {
          // Extract email from the error message
          let email = "";

          if (result.error.includes("Your account is not verified")) {
            // The email is appended to the error message
            email = result.error
              .replace("Your account is not verified", "")
              .trim();
          } else if (loginType === "email") {
            // Fallback to the entered email if available
            email = emailOrUsername;
          }

          router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }
        showToast("Invalid credentials", "error");
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <SocialLogin />

      <div className="flex justify-center w-full">
        <div className="inline-flex w-full rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setLoginType("email")}
            className={`px-3 sm:px-4 py-2 w-1/2 text-xs sm:text-sm font-medium rounded-l-lg focus:z-10 focus:ring-2 focus:ring-black transition-colors ${
              loginType === "email"
                ? "bg-black text-white"
                : "bg-white text-gray-700 border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginType("username")}
            className={`px-3 sm:px-4 py-2 w-1/2 text-xs sm:text-sm font-medium rounded-r-lg focus:z-10 focus:ring-2 focus:ring-black transition-colors ${
              loginType === "username"
                ? "bg-black text-white"
                : "bg-white text-gray-700 border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
          >
            Username
          </button>
        </div>
      </div>

      <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {loginType === "email" ? (
            <AuthInput
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="johndoe@example.com"
              icon={FiMail}
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              error={fieldErrors.emailOrUsername}
            />
          ) : (
            <AuthInput
              id="username"
              name="username"
              type="text"
              label="Username"
              placeholder="johndoe"
              icon={FiUser}
              pattern="^[a-zA-Z0-9_]+$"
              error={fieldErrors.emailOrUsername}
            />
          )}

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
        </div>

        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs sm:text-sm text-black dark:text-white hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <AuthButton type="submit" loading={loading} loadingText="Signing in...">
          Sign in
        </AuthButton>
      </form>

      <div className="text-center mt-4 sm:mt-6">
        <Link
          href="/auth/signup"
          className="font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-xs sm:text-sm"
        >
          Don't have an account? <span className="underline">Sign up</span>
        </Link>
      </div>
    </AuthLayout>
  );
}
