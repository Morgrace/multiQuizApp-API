import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name is required").max(50),
    email: z.email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(30),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export const loginSchema = z.object({
  email: z.email("Please provide a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Please provide a valid email"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirm: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export const updatePasswordSchema = z
  .object({
    passwordCurrent: z.string().min(1, "Current password is required"),
    password: z.string().min(8, "New password must be at least 8 characters"),
    passwordConfirm: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export const updateMeSchema = z.object({
  email: z.email("Please input a valid email address").optional(),
  photo: z.url("Please provide a valid photo URL").optional(),
  name: z
    .string()
    .min(2, "Name should be at least 2 characters")
    .max(50, "Name should not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces")
    .transform((name) => name.trim())
    .optional(),
});
export type updateMeInput = z.infer<typeof updateMeSchema>;

export type updatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
