import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { getSessionOptions, type SessionData } from "@/lib/session";

const isLogin = (p: string) => p === "/admin/login" || p === "/admin/login/";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");

  if (pathname.startsWith("/admin") && !isLogin(pathname)) {
    let email: string | undefined;
    try {
      email = (await getIronSession<SessionData>(req, res, getSessionOptions())).email;
    } catch {
      email = undefined;
    }
    if (!email) {
      const redirect = NextResponse.redirect(new URL("/admin/login", req.url));
      redirect.headers.set("X-Robots-Tag", "noindex, nofollow");
      return redirect;
    }
  }
  return res;
}

// Never matches /api/*, /_next/* or static files.
export const config = { matcher: ["/admin/:path*", "/i/:path*"] };
