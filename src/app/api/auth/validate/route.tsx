// app/api/auth/validate/route.ts
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: any) {
  const token = req.cookies.get("Authentication")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({ user: payload });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}