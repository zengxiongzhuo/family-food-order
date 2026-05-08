import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-me"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes except /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect admin API routes
  if (
    pathname.startsWith("/api/categories") &&
    request.method !== "GET"
  ) {
    return checkAdminAuth(request);
  }
  if (
    pathname.startsWith("/api/dishes") &&
    request.method !== "GET"
  ) {
    return checkAdminAuth(request);
  }
  if (pathname.startsWith("/api/upload")) {
    return checkAdminAuth(request);
  }
  if (pathname.startsWith("/api/orders") && request.method === "GET") {
    // Only admin can list all orders
    if (!pathname.includes("/api/orders/")) {
      return checkAdminAuth(request);
    }
  }

  return NextResponse.next();
}

async function checkAdminAuth(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
