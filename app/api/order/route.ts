import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { appendOrderToSheet, sendOrderEmails, type OrderRecord } from "@/lib/order-services";
import { orderTotal, orderingEnabled, product } from "@/lib/product";

export const runtime = "nodejs";

const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name.").max(100),
  phone: z.string().trim().refine((value) => { const digits = value.replace(/\D/g, ""); return digits.length >= 7 && digits.length <= 15; }, "Please enter a valid mobile number."),
  email: z.string().trim().email("Please enter a valid email address."),
  address: z.string().trim().min(5, "Kindly share your exact location.").max(300),
  city: z.string().trim().min(2, "Please enter your city or district.").max(100),
  postalCode: z.string().trim().min(2, "Please enter a postal code or area code.").max(20),
  size: z.string().trim().min(1, "Please select a size."),
  quantity: z.coerce.number().int().min(1).max(10),
  notes: z.string().trim().max(500).optional(),
  website: z.string().max(0).optional(),
});

function missingConfig() {
  return ["GOOGLE_SHEET_ID", "GOOGLE_SHEET_TAB_NAME", "GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "BUSINESS_EMAIL", "EMAIL_FROM", "EMAIL_SERVICE_API_KEY"].filter((key) => !process.env[key]);
}

export async function POST(request: NextRequest) {
  try {
    const allowed = process.env.FRONTEND_URL;
    const origin = request.headers.get("origin");
    if (allowed && origin && origin !== new URL(allowed).origin) return NextResponse.json({ error: "This origin is not allowed." }, { status: 403 });
    if (!orderingEnabled) return NextResponse.json({ error: "Ordering is not open until verified product sizes are configured." }, { status: 503 });
    const missing = missingConfig();
    if (missing.length) return NextResponse.json({ error: `Order service is not configured yet. Missing: ${missing.join(", ")}.` }, { status: 503 });

    const parsed = orderSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Please correct the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors }, { status: 400 });
    if (parsed.data.website) return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    if (![...product.sizes].includes(parsed.data.size)) return NextResponse.json({ error: "Please choose an available size." }, { status: 400 });

    const now = new Date();
    const orderId = `HCS-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const order: OrderRecord = {
      orderId,
      dateTime: new Intl.DateTimeFormat("en-NP", { timeZone: "Asia/Kathmandu", dateStyle: "medium", timeStyle: "short" }).format(now),
      customerName: parsed.data.customerName,
      phone: parsed.data.phone,
      email: parsed.data.email,
      address: parsed.data.address,
      city: parsed.data.city,
      postalCode: parsed.data.postalCode,
      size: parsed.data.size,
      quantity: parsed.data.quantity,
      notes: parsed.data.notes || undefined,
      productName: product.name,
      pricePerPiece: product.offerPrice,
      deliveryFee: product.deliveryFee,
      totalPrice: orderTotal(parsed.data.quantity),
      paymentMethod: "Cash On Delivery",
      orderStatus: "New Order",
    };

    await appendOrderToSheet(order);
    try {
      await sendOrderEmails(order);
    } catch (emailError) {
      console.error("Order saved, but notification delivery failed", { orderId, error: emailError });
      return NextResponse.json({ error: `Order ${orderId} was saved, but an email notification failed. Please do not resubmit; contact support.`, orderId, orderSaved: true }, { status: 502 });
    }
    return NextResponse.json({ success: true, orderId, order: { productName: order.productName, quantity: order.quantity, totalPrice: order.totalPrice, paymentMethod: order.paymentMethod } });
  } catch (error) {
    console.error("Order submission failed", error);
    return NextResponse.json({ error: "We could not place your order. Nothing has been confirmed. Please check the details and try again." }, { status: 500 });
  }
}

