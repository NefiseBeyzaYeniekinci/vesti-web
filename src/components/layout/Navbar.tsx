import Link from "next/link";
import { User, Menu, LogOut } from "lucide-react";
import { auth } from "@/auth";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { cookies } from "next/headers";
import { LogoutButton } from "./LogoutButton";
import { MobileMenuButton } from "./MobileMenuButton";

export async function Navbar() {
    const session = await auth();
    const cookieStore = cookies();
    const language = cookieStore.get("vesti-lang")?.value === "en" ? "en" : "tr";
    const t = {
        profile: language === "en" ? "Profile" : "Profilim",
        login: language === "en" ? "Sign In" : "Giriş Yap",
    };

    return (
        <nav
            className="fixed top-0 w-full h-16 flex items-center justify-between px-6 z-50 bg-white"
            style={{ borderBottom: '0.5px solid #E0E3E8' }}
        >
            <div className="flex items-center gap-4">
                <MobileMenuButton />
                <Link
                    href={session?.user ? "/home" : "/"}
                    prefetch={true}
                    style={{
                        fontSize: '22px',
                        fontWeight: 600,
                        color: '#7986CB',
                        letterSpacing: '-0.01em',
                    }}
                >
                    Vesti
                </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-5">
                {session?.user ? (
                    <div
                        className="flex items-center gap-4 pl-4 sm:pl-5 ml-2 sm:ml-0"
                        style={{ borderLeft: '0.5px solid #E0E3E8' }}
                    >
                        <NotificationsDropdown />
                        <Link
                            href="/profile"
                            prefetch={true}
                            className="flex items-center gap-2 text-sm transition-colors"
                            style={{ color: '#607080', fontWeight: 400, letterSpacing: '0.02em' }}
                        >
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline text-vesti-dark font-medium">
                                {session.user.name || t.profile}
                            </span>
                        </Link>
                        <LogoutButton />
                    </div>
                ) : (
                    <div
                        className="pl-4 sm:pl-5 ml-2 sm:ml-0"
                        style={{ borderLeft: '0.5px solid #E0E3E8' }}
                    >
                        <Link
                            href="/login"
                            className="flex items-center gap-2 text-sm transition-colors hover:text-vesti-primary"
                            style={{ color: '#37474F', fontWeight: 500, letterSpacing: '0.03em' }}
                        >
                            <User className="w-4 h-4" />
                            <span>{t.login}</span>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
