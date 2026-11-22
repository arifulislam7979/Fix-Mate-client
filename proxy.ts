import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const AUTH_ROUTES = ["/sign-in", "/sign-up"];

function getDashboardRouteByRole(role?: string): string {
  switch (role?.toLowerCase()) {
    case "admin":
      return "/dashboard/admin";

    case "technician":
      return "/dashboard/technician";

    default:
      return "/dashboard/customer";
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session) {
      const role = session.user.role;

      const targetUrl = new URL(getDashboardRouteByRole(role), request.url);

      return NextResponse.redirect(targetUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up"],
};
