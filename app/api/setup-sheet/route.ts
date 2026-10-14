import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { setupOrderSheet } from "@/lib/order-services";

export const runtime = "nodejs";

function authorized(request: NextRequest) {
  const supplied = request.headers.get("x-sheet-setup-token") || request.nextUrl.searchParams.get("setup_token") || "";
  const expected = process.env.SHEET_SETUP_TOKEN || "";
  if (!supplied || !expected) return false;
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  return suppliedBuffer.length === expectedBuffer.length && timingSafeEqual(suppliedBuffer, expectedBuffer);
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ success: false }, { status: 401 });
  try {
    await setupOrderSheet();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sheet setup failed", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Sheet setup failed." }, { status: 500 });
  }
}
