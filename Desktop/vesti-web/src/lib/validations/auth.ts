import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, { message: "E-posta adresi zorunludur" }).email({ message: "Geçerli bir e-posta adresi giriniz" }),
    password: z.string().min(6, { message: "Şifre en az 6 karakter olmalıdır" }),
});

export const registerSchema = z.object({
    name: z.string().min(2, { message: "Ad soyad en az 2 karakter olmalıdır" }),
    email: z.string().min(1, { message: "E-posta adresi zorunludur" }).email({ message: "Geçerli bir e-posta adresi giriniz" }),
    password: z.string().min(6, { message: "Şifre en az 6 karakter olmalıdır" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
