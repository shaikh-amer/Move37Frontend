"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { passwordSchema } from "@/validation/auth";
import { useToast } from "@/components/providers/ToastProvider";
import AuthLayout from "@/app/auth/_components/AuthLayout";
import AuthInput from "@/app/auth/_components/AuthInput";
import AuthButton from "@/app/auth/_components/AuthButton";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [resetComplete, setResetComplete] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      showToast("Invalid or missing reset token", "error");
      router.push("/auth/forgot-password");
      return;
    }

    setToken(tokenParam);

    // Verify token validity
    const verifyToken = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/validate-reset-token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: tokenParam }),
          },
        );

        if (!res.ok) {
          setTokenValid(false);
          showToast("Invalid or expired reset token", "error");
          return;
        }

        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
        showToast("Failed to verify reset token", "error");
      }
    };

    verifyToken();
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError("");
    setConfirmPasswordError("");

    // Validate password
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      setPasswordError(passwordResult.error.errors[0].message);
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Use your reset-password endpoint
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to reset password");
      }

      setResetComplete(true);
      showToast("Your password has been reset successfully", "success");

      // Redirect to login without reloading the page
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000); // Optional delay for user feedback
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

  if (tokenValid === false) {
    return (
      <AuthLayout
        title="Invalid Token"
        subtitle="Your password reset link is invalid or has expired"
      >
        <div className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              The password reset link you clicked is no longer valid. This may
              be because it has already been used or it has expired.
            </p>
          </div>

          <Link href="/auth/forgot-password">
            <AuthButton type="button">Request a new reset link</AuthButton>
          </Link>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-xs sm:text-sm"
            >
              Return to <span className="underline">sign in</span>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (resetComplete) {
    return (
      <AuthLayout
        title="Password Reset Complete"
        subtitle="Your password has been reset successfully"
      >
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              Your password has been reset successfully. You can now log in with
              your new password.
            </p>
          </div>

          <Link href="/auth/login">
            <AuthButton type="button">Sign in with new password</AuthButton>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Create a new password for your account"
    >
      {tokenValid === null ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin h-8 w-8 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <AuthInput
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="New Password"
            placeholder="••••••••"
            icon={FiLock}
            error={passwordError}
            onChange={(e) => setPassword(e.target.value)}
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
            label="Confirm New Password"
            placeholder="••••••••"
            icon={FiLock}
            error={confirmPasswordError}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

          <AuthButton
            type="submit"
            loading={loading}
            loadingText="Resetting password..."
          >
            Reset Password
          </AuthButton>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-xs sm:text-sm"
            >
              Remember your password? <span className="underline">Sign in</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
