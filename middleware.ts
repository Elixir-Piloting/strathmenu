import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (!request.cookies.has("session_id")) {
    response.cookies.set("session_id", crypto.randomUUID(), {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
