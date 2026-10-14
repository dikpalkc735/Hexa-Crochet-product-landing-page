import { timingSafeEqual } from "node:crypto";
import { setupOrderSheet } from "@/lib/order-services";

export const dynamic = "force-dynamic";

function validToken(supplied: string) {
  const expected = process.env.SHEET_SETUP_TOKEN || "";
  if (!supplied || !expected) return false;
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  return suppliedBuffer.length === expectedBuffer.length && timingSafeEqual(suppliedBuffer, expectedBuffer);
}

export default async function InternalSheetSetupPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  if (!validToken(params.token || "")) return <main><h1>Not authorized</h1></main>;

  try {
    await setupOrderSheet();
    return <main><h1>Sheet setup complete</h1><p>The Google order sheet is connected and formatted.</p></main>;
  } catch (error) {
    return <main><h1>Sheet setup failed</h1><p>{error instanceof Error ? error.message : "Unknown error"}</p></main>;
  }
}
