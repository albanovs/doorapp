import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    const publicRoutes = [
        "/auth/login",
        "/auth/register",
    ];

    // API auth
    if (pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // 🔐 страницы
    if (!token && !publicRoutes.includes(pathname)) {
        return NextResponse.redirect(
            new URL("/auth/login", request.url)
        );
    }

    if (token && publicRoutes.includes(pathname)) {
        return NextResponse.redirect(
            new URL("/", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // ❗ только страницы, без файлов
        "/((?!.*\\.(?:png|jpg|jpeg|svg|webp|ico|css|js|map|woff|woff2|ttf|eot)$|_next|api).*)",
    ],
};
