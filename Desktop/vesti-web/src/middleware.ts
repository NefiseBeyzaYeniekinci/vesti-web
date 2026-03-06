import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;

    const isAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
    const isAdminRoute = nextUrl.pathname.startsWith('/admin');
    const isProtectedRoute =
        nextUrl.pathname.startsWith('/wardrobe') ||
        nextUrl.pathname.startsWith('/outfits') ||
        nextUrl.pathname.startsWith('/messages') ||
        nextUrl.pathname.startsWith('/profile');

    if (isAuthRoute) {
        if (isLoggedIn) {
            if (userRole === "admin") {
                return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
            }
            return NextResponse.redirect(new URL("/wardrobe", nextUrl));
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
