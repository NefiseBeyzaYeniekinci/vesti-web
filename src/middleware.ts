import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;

    const isAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
    const isAdminRoute = nextUrl.pathname.startsWith('/admin');
    const isOnboarding = nextUrl.pathname.startsWith('/onboarding');
    const isProtectedRoute =
        nextUrl.pathname.startsWith('/home') ||
        nextUrl.pathname.startsWith('/wardrobe') ||
        nextUrl.pathname.startsWith('/suggestions') ||
        nextUrl.pathname.startsWith('/messages') ||
        nextUrl.pathname.startsWith('/marketplace/create') ||
        nextUrl.pathname.startsWith('/profile');

    if (isAuthRoute) {
        if (isLoggedIn) {
            if (userRole === "admin") {
                return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
            }
            return NextResponse.redirect(new URL("/home", nextUrl));
        }
        return null;
    }

    if (isAdminRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", nextUrl));
        }
        if (userRole !== "admin") {
            return NextResponse.redirect(new URL("/", nextUrl));
        }
        return null;
    }

    // Onboarding sayfasına sadece giriş yapmış kullanıcılar erişebilir
    if (isOnboarding) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", nextUrl));
        }
        return null;
    }

    if (isProtectedRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", nextUrl));
        }
        return null;
    }

    return null;
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
