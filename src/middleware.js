import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    const isAuthPage =
        pathname.startsWith("/auth/login") ||
        pathname.startsWith("/auth/register");

    if (pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    if (!token) {
        if (!isAuthPage) {
            return NextResponse.redirect(
                new URL("/auth/login", request.url)
            );
        }
        return NextResponse.next();
    }

    if (pathname === "/") {
        return NextResponse.redirect(
            new URL("/auth/login", request.url)
        );
    }


    let user;
    try {
        user = JSON.parse(token);
    } catch {
        return NextResponse.redirect(
            new URL("/auth/login", request.url)
        );
    }

    const isAdminRoute = pathname.startsWith("/admin");

    if (user.admin) {
        if (!isAdminRoute) {
            return NextResponse.redirect(
                new URL("/admin/profile", request.url)
            );
        }
    }

    if (!user.admin) {
        if (isAdminRoute) {
            return NextResponse.redirect(
                new URL("/profile", request.url)
            );
        }
    }

    if (isAuthPage) {
        return NextResponse.redirect(
            new URL(user.admin ? "/admin/profile" : "/profile", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!.*\\.(?:png|jpg|jpeg|svg|webp|ico|css|js|map|woff|woff2|ttf|eot)$|_next|api).*)",
    ],
};
