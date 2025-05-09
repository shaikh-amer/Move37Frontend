import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  );

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be less than 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
  );

export const emailSchema = z
  .string()
  .trim()
  .min(5, "Email must be at least 5 characters")
  .max(50, "Email must be less than 50 characters")
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Invalid email format. Please use a valid email address.",
  )
  .refine(
    (value) => {
      const domain = value.split("@")[1];
      return !domain.includes("..");
    },
    {
      message: "Invalid domain in email address.",
    },
  )
  .refine(
    (value) => {
      const domain = value.split("@")[1].toLowerCase();
      // If the email is from Gmail, enforce that the domain is exactly "gmail.com"
      if (domain.includes("gmail") && domain !== "gmail.com") {
        return false;
      }
      return true;
    },
    { message: "Invalid email domain, did you mean gmail.com?" },
  );

export const emailOrUsernameSchema = z
  .string()
  .min(1, "Email or username is required")
  .refine(
    (val) => {
      if (val.includes("@")) {
        // If input has "@" then validate as an email
        return emailSchema.safeParse(val).success;
      }
      // Otherwise, validate as a username
      return usernameSchema.safeParse(val).success;
    },
    { message: "Invalid email or username" },
  );

export const loginSchema = z.object({
  emailOrUsername: emailOrUsernameSchema,
  password: passwordSchema,
});

// Signup form schema
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.enum(["USER", "ADMIN"] as const),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
