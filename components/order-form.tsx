"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle, Minus, Plus, ShieldCheck } from "lucide-react";
import { formatNpr, orderTotal, orderingEnabled, product } from "@/lib/product";

type FieldErrors = Record<string, string[] | undefined>;
type OrderResponse = {
  success?: boolean;
  error?: string;
  orderSaved?: boolean;
  orderId?: string;
  fieldErrors?: FieldErrors;
  order?: { productName: string; quantity: number; totalPrice: number; paymentMethod: string };
};

export function OrderForm({ initialQuantity = 1, compact = false }: { initialQuantity?: number; compact?: boolean }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(Math.min(10, Math.max(1, initialQuantity)));
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "saved"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const total = useMemo(() => orderTotal(quantity), [quantity]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !orderingEnabled) return;
    setSubmitting(true); setMessage(null); setFieldErrors({});
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, quantity }) });
      const result = await response.json() as OrderResponse;
      if (!response.ok) {
        setFieldErrors(result.fieldErrors || {});
        setMessage({ type: result.orderSaved ? "saved" : "error", text: result.error || "Order submission failed." });
        return;
      }
      if (!result.orderId || !result.order) throw new Error("The order service returned an incomplete success response.");
      const params = new URLSearchParams({ orderId: result.orderId, product: result.order.productName, quantity: String(result.order.quantity), total: String(result.order.totalPrice) });
      router.push(`/thank-you?${params.toString()}`);
    } catch {
      setMessage({ type: "error", text: "We couldn’t connect to the order service. Nothing has been confirmed. Please try again." });
    } finally { setSubmitting(false); }
  }

  const error = (name: string) => fieldErrors[name]?.[0] ? <span className="field-error">{fieldErrors[name]?.[0]}</span> : null;

  return <div className={compact ? "embedded-form" : "checkout-form-card"}>
    <div className="form-intro"><p className="eyebrow">Cash on delivery</p><h2>{compact ? "Place your order" : "Delivery details"}</h2><p>We’ll call you to confirm before dispatch.</p></div>
    {!orderingEnabled && <div className="config-alert"><AlertCircle/><div><strong>Ordering is not open yet.</strong><p>Verified size options and garment measurements must be added before the form can accept orders.</p></div></div>}
    <form onSubmit={submit} noValidate>
      <div className="form-grid">
        <label><span>Full name *</span><input name="customerName" autoComplete="name" required placeholder="Your full name" />{error("customerName")}</label>
        <label><span>Mobile phone number *</span><input name="phone" type="tel" autoComplete="tel" required placeholder="98XXXXXXXX" />{error("phone")}</label>
        <label className="full-field"><span>Email address *</span><input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />{error("email")}</label>
        <label className="full-field"><span>Delivery address *</span><input name="address" autoComplete="street-address" required placeholder="Kindly share your exact location" />{error("address")}</label>
        <label><span>City / district *</span><input name="city" autoComplete="address-level2" required placeholder="Kathmandu" />{error("city")}</label>
        <label><span>Postal / area code *</span><input name="postalCode" autoComplete="postal-code" required placeholder="44600" />{error("postalCode")}</label>
        <label><span>Product size *</span><select name="size" required disabled={!orderingEnabled}><option value="">Select size</option>{product.sizes.map((size) => <option key={size} value={size}>{size}</option>)}</select>{error("size")}</label>
        <label><span>Quantity *</span><div className="form-quantity"><button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={16}/></button><output>{quantity}</output><button type="button" onClick={() => setQuantity((q) => Math.min(10, q + 1))} aria-label="Increase quantity"><Plus size={16}/></button></div>{error("quantity")}</label>
        <label className="full-field"><span>Order notes <i>(optional)</i></span><textarea name="notes" rows={3} placeholder="Landmark or helpful delivery note" />{error("notes")}</label>
        <label className="honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="order-summary-inline"><div><span>Product</span><strong>{product.shortName}</strong></div><div><span>Price per piece</span><strong>{formatNpr(product.offerPrice)}</strong></div><div><span>Delivery</span><strong>{formatNpr(product.deliveryFee)}</strong></div><div className="summary-total"><span>Total</span><strong>{formatNpr(total)}</strong></div></div>
      {message && <div className={`submission-message ${message.type}`} role="alert">{message.type === "saved" ? <CheckCircle2/> : <AlertCircle/>}<span>{message.text}</span></div>}
      <button className="button-primary order-submit" disabled={submitting || !orderingEnabled}>{submitting ? <><LoaderCircle className="animate-spin"/>Confirming order...</> : "Confirm COD order"}</button>
      <p className="form-assurance"><ShieldCheck/> Your order is not confirmed until the backend reports success.</p>
    </form>
  </div>;
}

