import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "epic_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || "admin@epicstore.in").trim().toLowerCase(),
    altEmail: "store.epicsports@gmail.com",
    password: process.env.ADMIN_PASSWORD || "EpicAdmin@2026",
    secret:
      process.env.ADMIN_SESSION_SECRET ||
      process.env.GMAIL_APP_PASSWORD ||
      "epic-store-admin-session-secret-2026",
  };
}

function signToken(payload: string, secret: string) {
  const sig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

function verifyToken(token: string | undefined, secret: string): string | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }
  const [email, expStr] = payload.split("|");
  const exp = Number(expStr);
  if (!email || !Number.isFinite(exp) || Date.now() > exp) {
    return null;
  }
  return email;
}

export async function GET(request: NextRequest) {
  const { secret } = getAdminCredentials();
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const email = verifyToken(token, secret);

  if (!email) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      name: "Admin User",
      email,
      role: "Administrator",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      remember?: boolean;
    };

    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";
    const creds = getAdminCredentials();

    const validEmail = email === creds.email || email === creds.altEmail;
    const validPassword = password === creds.password;

    if (!validEmail || !validPassword) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid admin email or password. Please try again.",
        },
        { status: 401 }
      );
    }

    const ttlMs = (body.remember === false ? 60 * 60 * 12 : SESSION_TTL_SECONDS) * 1000;
    const payload = `${email}|${Date.now() + ttlMs}`;
    const token = signToken(payload, creds.secret);

    const res = NextResponse.json({
      ok: true,
      admin: {
        name: "Admin User",
        email,
        role: "Administrator",
      },
    });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: body.remember === false ? 60 * 60 * 12 : SESSION_TTL_SECONDS,
    });

    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

