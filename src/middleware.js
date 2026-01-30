import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    const authRoutes = [
        "/auth/login",
        "/auth/register",
    ];

    // пропускаем API
    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    // ❌ не авторизован
    if (!token) {
        if (authRoutes.includes(pathname)) {
            return NextResponse.next();
        }

        return NextResponse.redirect(
            new URL("/auth/login", request.url)
        );
    }

    // ✅ авторизован
    if (token) {
        // запрещаем auth-страницы и /
        if (authRoutes.includes(pathname) || pathname === "/") {
            return NextResponse.redirect(
                new URL("/profile", request.url)
            );
        }

        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        "/((?!_next|api|.*\\..*).*)",
    ],
};
