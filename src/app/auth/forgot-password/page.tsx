"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail } from "react-icons/fi";
import { emailSchema } from "@/validation/auth";
import { useToast } from "@/components/providers/ToastProvider";
import AuthLayout from "@/app/auth/_components/AuthLayout";
import AuthInput from "@/app/auth/_components/AuthInput";
import AuthButton from "@/app/auth/_components/AuthButton";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setEmailError("");

    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      // Use your forgot-password endpoint
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send reset link");
      }

      setSubmitted(true);
      showToast("Password reset link has been sent to your email", "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "An error occurred",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent a password reset link to your email"
      >
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              If an account exists with the email {email}, you will receive a
              password reset link shortly.
            </p>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <button
              onClick={() => setSubmitted(false)}
              className="text-black dark:text-white underline text-sm font-medium"
            >
              Try a different email
            </button>
          </div>

          <div className="pt-4">
            <Link href="/auth/login">
              <AuthButton type="button" variant="secondary">
                Return to login
              </AuthButton>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a password reset link"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="johndoe@example.com"
          icon={FiMail}
          error={emailError}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthButton
          type="submit"
          loading={loading}
          loadingText="Sending reset link..."
        >
          Send Reset Link
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
    </AuthLayout>
  );
}
