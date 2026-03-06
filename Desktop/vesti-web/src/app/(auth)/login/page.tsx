"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const setUser = useAuthStore((state) => state.setUser);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: LoginFormData) {
        setIsLoading(true);
        setError(null);
        try {
            const response = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (response?.error) {
                setError("E-posta veya şifre hatalı.");
            } else {
                // Zustand store dummy user update if needed. NextAuth handles main session.
                setUser({ id: "1", role: data.email.includes("admin") ? "admin" : "user", name: "User", email: data.email });

                if (data.email.includes("admin")) {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/wardrobe");
                }
                router.refresh();
            }
        } catch (err) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-vesti-background px-4">
            <div className="bg-white p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-vesti-dark mb-2">Hoş Geldiniz</h1>
                    <p className="text-vesti-text/70 text-sm">Vesti hesabınıza giriş yapın</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6 text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-vesti-dark font-medium">E-posta</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ornek@vesti.com" {...field} className="focus-visible:ring-vesti-primary h-11" />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-vesti-dark font-medium">Şifre</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} className="focus-visible:ring-vesti-primary h-11" />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full h-11 bg-vesti-primary hover:bg-vesti-dark transition-colors font-medium text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                        </Button>
                    </form>
                </Form>

                <div className="mt-6 text-center text-sm text-vesti-text">
                    Hesabınız yok mu?{" "}
                    <Link href="/register" className="text-vesti-primary hover:underline font-medium">
                        Kayıt Ol
                    </Link>
                </div>

                <div className="relative mt-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Veya</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-6 h-11 border-gray-200 text-vesti-text font-medium"
                    onClick={() => signIn("google", { callbackUrl: "/wardrobe" })}
                >
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Google ile Giriş Yap
                </Button>
            </div>
        </div>
    );
}
