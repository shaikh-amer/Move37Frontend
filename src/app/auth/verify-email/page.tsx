"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiMail, FiCheck } from "react-icons/fi";
import { useToast } from "@/components/providers/ToastProvider";
import AuthLayout from "@/app/auth/_components/AuthLayout";
import AuthButton from "@/app/auth/_components/AuthButton";
import OtpInput from "@/app/auth/_components/OtpInput";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otp, setOtp] = useState<string>("");
  const [checkingVerification, setCheckingVerification] = useState(true);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const otpParam = searchParams.get("code");

    if (emailParam) {
      setEmail(emailParam);

      // Check if user is already verified
      const checkVerificationStatus = async () => {
        setCheckingVerification(true);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verified`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: emailParam }),
            },
          );

          if (res.ok) {
            const data = await res.json();
            if (data.verified) {
              setVerified(true);
              showToast("Email is already verified", "success");

              setTimeout(() => {
                router.push("/auth/login");
              }, 2000);
            }
          } else if (res.status === 404) {
            const data = await res.json();
            showToast(data.message, "error");
            router.push("/auth/signup");
          }
        } catch (error) {
          showToast(
            error instanceof Error ? error.message : "An error occurred",
            "error",
          );
        } finally {
          setCheckingVerification(false);
        }
      };

      checkVerificationStatus();
    }

    if (otpParam && emailParam && !verified) {
      setOtp(otpParam);
      // Auto-verify if OTP is provided in URL
      handleVerifyOtp(otpParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyOtp = async (otp: string) => {
    if (!email) {
      showToast("Email is required for verification", "error");
      return;
    }

    setLoading(true);

    try {
      // Use your verify-email endpoint
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to verify email");
      }

      setVerified(true);
      showToast("Email verified successfully", "success");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Invalid verification code",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || !email) return;

    setResendLoading(true);

    try {
      // Use your resend-verification endpoint
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to resend verification code");
      }

      showToast(
        "A new verification code has been sent to your email",
        "success",
      );
      setCountdown(60); // Start 60-second countdown
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "An error occurred",
        "error",
      );
    } finally {
      setResendLoading(false);
    }
  };

  if (verified) {
    return (
      <AuthLayout
        title="Email Verified!"
        subtitle="Your email has been successfully verified"
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 dark:bg-green-900/50 rounded-full p-3">
              <FiCheck className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You will be redirected to the login page shortly...
            </p>
          </div>

          <Link href="/auth/login">
            <AuthButton type="button">Go to Login</AuthButton>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (checkingVerification) {
    return (
      <AuthLayout
        title="Checking Verification Status"
        subtitle="Please wait while we check your verification status"
      >
        <div className="flex justify-center my-8">
          <div className="animate-spin h-8 w-8 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full"></div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle={`Enter the 6-digit code sent to ${email || "your email"}`}
    >
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
            <FiMail className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>
              We've sent a verification code to your email address. Please check
              your inbox and enter the code below.
            </span>
          </p>
        </div>

        <div className="space-y-2">
          <div className="mb-8 mt-4">
            <OtpInput length={6} onComplete={handleVerifyOtp} />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOtp}
              disabled={countdown > 0 || resendLoading}
              className={`text-black dark:text-white font-medium text-sm ${
                countdown > 0 || resendLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:underline"
              }`}
            >
              {resendLoading
                ? "Sending..."
                : countdown > 0
                  ? `Resend code in ${countdown}s`
                  : "Resend code"}
            </button>
          </div>
        </div>

        <Link href="/auth/login">
          <AuthButton type="button" variant="secondary">
            Back to Login
          </AuthButton>
        </Link>
      </div>
    </AuthLayout>
  );
}
