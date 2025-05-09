import React, { useRef, useState, useEffect } from "react";

interface OtpInputProps {
  length: number;
  onComplete: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;

    if (isNaN(Number(value))) return;

    // Allow only one digit
    const digit = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Check if OTP is complete
    const otpValue = newOtp.join("");
    if (newOtp.every((val) => val !== "") && otpValue.length === length) {
      onComplete(otpValue);
    }

    // Move to next input if current input is filled and not the last one
    if (digit && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      // Move to previous input on left arrow
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      // Move to next input on right arrow
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, length)
      .split("");

    if (pastedData.some((char) => isNaN(Number(char)))) return;

    const newOtp = [...otp];

    for (let i = 0; i < length; i++) {
      if (pastedData[i]) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);

    // Focus the next empty input or the last one
    const lastFilledIndex = newOtp.findIndex((val) => val === "");
    const focusIndex = lastFilledIndex === -1 ? length - 1 : lastFilledIndex;
    inputRefs.current[focusIndex]?.focus();

    // Check if OTP is complete
    const otpValue = newOtp.join("");
    if (newOtp.every((val) => val !== "") && otpValue.length === length) {
      onComplete(otpValue);
    }
  };

  return (
    <div className="flex justify-center space-x-2 sm:space-x-4">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el: HTMLInputElement | null) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
        />
      ))}
    </div>
  );
};

export default OtpInput;
