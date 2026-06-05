"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api/auth.api";
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock, User, Eye, EyeOff, Sparkles, Shirt } from "lucide-react";

interface InteractiveAuthScreenProps {
    initialMode?: "login" | "register";
}

export default function InteractiveAuthScreen({ initialMode = "login" }: InteractiveAuthScreenProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mode, setMode] = useState<"login" | "register">(initialMode);
    
    // Form Loading and error states
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const setUser = useAuthStore((state) => state.setUser);

    // Form setup for Login
    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Form setup for Register
    const registerForm = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            acceptTerms: false,
        },
    });

    // Sync URL queries or initial parameters if needed
    useEffect(() => {
        const queryMode = searchParams.get("mode");
        if (queryMode === "register") {
            setMode("register");
        } else if (queryMode === "login") {
            setMode("login");
        }
    }, [searchParams]);

    // Submitting Login
    async function onLoginSubmit(data: LoginFormData) {
        setIsLoading(true);
        setAuthError(null);
        try {
            const response = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (response?.error) {
                setAuthError("E-posta veya şifre hatalı.");
            } else {
                setUser({ 
                    id: "1", 
                    role: data.email.includes("admin") ? "admin" : "user", 
                    name: "Kullanıcı", 
                    email: data.email 
                });

                if (data.email.includes("admin")) {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/wardrobe");
                }
            }
        } catch {
            setAuthError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    }

    // Submitting Register
    async function onRegisterSubmit(data: RegisterFormData) {
        setIsLoading(true);
        setAuthError(null);
        try {
            const result = await authApi.register(data);
            if (result.success) {
                const response = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                });

                if (!response?.error) {
                    setUser({ id: "100", role: "user", name: data.name, email: data.email });
                    router.push("/wardrobe");
                } else {
                    setMode("login");
                    loginForm.setValue("email", data.email);
                }
            }
        } catch (err: any) {
            setAuthError(err.response?.data?.message || "Kayıt işlemi sırasında bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center font-sans select-none px-4 bg-gradient-to-b from-[#F5F7FB] via-[#EFF2F6] to-[#E3E7F2]">
            {/* Soft Ambient Brand Glowing Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#7986CB]/12 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[650px] h-[650px] rounded-full bg-[#FF6F61]/6 blur-[140px] pointer-events-none" />

            {/* Sleek Centered Light-Theme Glassmorphic Card */}
            <div className="w-full max-w-[440px] z-30">
                <div className="w-full bg-white/85 backdrop-blur-3xl border border-white/60 rounded-[32px] p-8 sm:p-10 shadow-[0_25px_60px_rgba(41,41,77,0.06)] relative overflow-hidden">
                    
                    {/* Decorative subtle light highlight inside card */}
                    <div className="absolute -top-[100px] -right-[100px] w-[200px] h-[200px] rounded-full bg-[#7986CB]/5 blur-[50px] pointer-events-none" />

                    {/* Logo Section */}
                    <div className="flex flex-col items-center justify-center mb-6">
                        <div className="bg-[#7986CB]/10 p-3 rounded-full border border-[#7986CB]/20 shadow-sm">
                            <Shirt className="w-8 h-8 text-[#7986CB]" />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-[#29294D] tracking-tight">
                            {mode === "login" ? "Giriş Yapın" : "Hesap Oluşturun"}
                        </h2>
                        <p className="text-xs text-gray-500 mt-2 font-medium tracking-wide">
                            {mode === "login" 
                                ? "Vesti dijital gardırobuna adım atın" 
                                : "Dolabını dijitalleştir, kombinlerini tasarla"}
                        </p>
                    </div>

                    {authError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl mb-6 text-center animate-shake">
                            {authError}
                        </div>
                    )}

                    {/* ──── LOGIN MODE ──── */}
                    {mode === "login" && (
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                            <div>
                                <label className="block text-gray-500 text-xs font-bold tracking-wider uppercase mb-2 ml-1">E-posta</label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        placeholder="ornek@vesti.com"
                                        {...loginForm.register("email")}
                                        className="w-full bg-white border-gray-200 text-gray-900 placeholder-gray-400 rounded-2xl h-12 pl-11 focus:border-[#7986CB] focus:ring-1 focus:ring-[#7986CB] hover:border-gray-300 transition-all"
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                                {loginForm.formState.errors.email && (
                                    <span className="text-red-500 text-xs mt-1 block ml-1">{loginForm.formState.errors.email.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-500 text-xs font-bold tracking-wider uppercase mb-2 ml-1">Şifre</label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...loginForm.register("password")}
                                        className="w-full bg-white border-gray-200 text-gray-900 placeholder-gray-400 rounded-2xl h-12 pl-11 pr-10 focus:border-[#7986CB] focus:ring-1 focus:ring-[#7986CB] hover:border-gray-300 transition-all"
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {loginForm.formState.errors.password && (
                                    <span className="text-red-500 text-xs mt-1 block ml-1">{loginForm.formState.errors.password.message}</span>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 mt-2 bg-[#7986CB] hover:bg-[#6C75BD] active:scale-[0.98] text-white font-bold tracking-wider uppercase text-xs rounded-full shadow-[0_4px_25px_rgba(121,134,203,0.2)] transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Giriş Yap"
                                )}
                            </Button>
                        </form>
                    )}

                    {/* ──── REGISTER MODE ──── */}
                    {mode === "register" && (
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-gray-500 text-xs font-bold tracking-wider uppercase mb-1.5 ml-1">Ad Soyad</label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Adınız Soyadınız"
                                        {...registerForm.register("name")}
                                        className="w-full bg-white border-gray-200 text-gray-900 placeholder-gray-400 rounded-2xl h-11 pl-11 focus:border-[#7986CB] focus:ring-1 focus:ring-[#7986CB] hover:border-gray-300 transition-all"
                                    />
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                                {registerForm.formState.errors.name && (
                                    <span className="text-red-500 text-xs mt-0.5 block ml-1">{registerForm.formState.errors.name.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-500 text-xs font-bold tracking-wider uppercase mb-1.5 ml-1">E-posta</label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        placeholder="ornek@vesti.com"
                                        {...registerForm.register("email")}
                                        className="w-full bg-white border-gray-200 text-gray-900 placeholder-gray-400 rounded-2xl h-11 pl-11 focus:border-[#7986CB] focus:ring-1 focus:ring-[#7986CB] hover:border-gray-300 transition-all"
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                                {registerForm.formState.errors.email && (
                                    <span className="text-red-500 text-xs mt-0.5 block ml-1">{registerForm.formState.errors.email.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-500 text-xs font-bold tracking-wider uppercase mb-1.5 ml-1">Şifre</label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="En az 6 karakter"
                                        {...registerForm.register("password")}
                                        className="w-full bg-white border-gray-200 text-gray-900 placeholder-gray-400 rounded-2xl h-11 pl-11 pr-10 focus:border-[#7986CB] focus:ring-1 focus:ring-[#7986CB] hover:border-gray-300 transition-all"
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {registerForm.formState.errors.password && (
                                    <span className="text-red-500 text-xs mt-0.5 block ml-1">{registerForm.formState.errors.password.message}</span>
                                )}
                            </div>

                            {/* Terms checkbox */}
                            <div className="flex items-start space-x-3 bg-gray-50/50 border border-gray-150 p-3 rounded-2xl">
                                <input
                                    id="acceptTerms"
                                    type="checkbox"
                                    checked={registerForm.watch("acceptTerms")}
                                    onChange={(e) => registerForm.setValue("acceptTerms", e.target.checked)}
                                    className="border-gray-350 text-[#7986CB] focus:ring-[#7986CB] rounded mt-0.5 h-4 w-4 bg-transparent cursor-pointer"
                                />
                                <div className="space-y-1 leading-none">
                                    <label htmlFor="acceptTerms" className="text-[11px] text-gray-550 leading-relaxed font-medium cursor-pointer select-none">
                                        <Link href="/terms" className="text-[#7986CB] hover:underline font-semibold">Kullanıcı Sözleşmesini</Link> ve{" "}
                                        <Link href="/privacy" className="text-[#7986CB] hover:underline font-semibold">Gizlilik Politikasını</Link> kabul ediyorum.
                                    </label>
                                    {registerForm.formState.errors.acceptTerms && (
                                        <span className="text-red-500 text-xs mt-1 block">{registerForm.formState.errors.acceptTerms.message}</span>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 mt-2 bg-[#7986CB] hover:bg-[#6C75BD] active:scale-[0.98] text-white font-bold tracking-wider uppercase text-xs rounded-full shadow-[0_4px_25px_rgba(121,134,203,0.2)] transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Kayıt Ol"
                                )}
                            </Button>
                        </form>
                    )}

                    {/* Divider & Google Login */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200/60" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-gray-400">
                            <span className="bg-[#FAFBFD] px-3 rounded-full">Veya</span>
                        </div>
                    </div>

                    {/* Google Login Button - Standard Branded White Theme */}
                    <Button
                        type="button"
                        onClick={() => signIn("google", { callbackUrl: "/wardrobe" })}
                        className="w-full h-12 bg-white border border-gray-200/80 hover:bg-gray-50/80 text-gray-700 font-semibold text-sm rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm hover:shadow-md hover:border-gray-300"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.56h3.29c1.92,-1.77 3.02,-4.38 3.02,-7.4C21.65,11.75 21.5,11.4 21.35,11.1z" fill="#4285F4" />
                            <path d="M12,20.6c2.43,0 4.47,-0.8 5.96,-2.2l-2.92,-2.26c-0.81,0.54 -1.85,0.86 -3.04,0.86c-2.34,0 -4.32,-1.58 -5.02,-3.7H3.6v2.64C5.08,18.84 8.3,20.6 12,20.6z" fill="#34A853" />
                            <path d="M6.98,13.3c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7s0.1,-1.16 0.28,-1.7V7.26H3.6C3,8.45 2.65,9.85 2.65,11.3s0.35,2.85 0.95,4.04l2.76,-2.14C6.18,14.6 6.55,13.98 6.98,13.3z" fill="#FBBC05" />
                            <path d="M12,5.38c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,2.71 14.43,2 12,2C8.3,2 5.08,3.76 3.6,6.66l2.76,2.14C7.06,7.06 9.04,5.38 12,5.38z" fill="#EA4335" />
                        </svg>
                        Google ile Giriş Yap
                    </Button>

                    {/* Bottom Navigation Link */}
                    <div className="mt-8 text-center text-xs text-gray-500 font-medium">
                        {mode === "login" ? (
                            <>
                                Hesabınız yok mu?{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode("register");
                                        setAuthError(null);
                                        router.push("/register");
                                    }}
                                    className="text-[#7986CB] hover:underline font-bold ml-1"
                                >
                                    Kayıt Olun
                                </button>
                            </>
                        ) : (
                            <>
                                Zaten üye misiniz?{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode("login");
                                        setAuthError(null);
                                        router.push("/login");
                                    }}
                                    className="text-[#7986CB] hover:underline font-bold ml-1"
                                >
                                    Giriş Yapın
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }

                .animate-shake {
                    animation: shake 0.2s ease-in-out 2;
                }
            `}</style>
        </div>
    );
}
