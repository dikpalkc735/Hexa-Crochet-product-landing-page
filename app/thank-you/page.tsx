import Link from "next/link";
import { ArrowLeft, Check, CheckCircle2, PhoneCall, Truck } from "lucide-react";
import { formatNpr, product } from "@/lib/product";
import { BrandLogo } from "@/components/brand-logo";

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const quantity = Math.max(1, Number(params.quantity || 1));
  const total = Number(params.total || 0);
  const confirmed = Boolean(params.orderId);
  return <main className="thank-you-page"><div className="thank-you-card">
    <Link href="/" className="thank-you-logo" aria-label={`${product.brand} home`}><BrandLogo className="brand-logo-thank-you" priority /></Link>
    <div className={`success-mark ${confirmed ? "confirmed" : ""}`}><Check/></div>
    <p className={`order-status-badge ${confirmed ? "confirmed" : "pending"}`}>{confirmed ? "Order confirmed" : "Confirmation unavailable"}</p>
    <p className="eyebrow">{confirmed ? `Order ${params.orderId}` : "No verified order ID"}</p>
    <h1>{confirmed ? "Your order is confirmed!" : "We couldn’t verify this order."}</h1>
    <p className="thank-you-lead">{confirmed ? "Your order was saved successfully and is now with our team." : "Please submit the checkout form and wait for a successful confirmation before leaving the page."}</p>
    {confirmed && <><div className="order-progress" aria-label="Order progress"><div className="current"><CheckCircle2/><span><b>Order confirmed</b><small>Received successfully</small></span></div><div><PhoneCall/><span><b>Confirmation call</b><small>Our team calls you next</small></span></div><div><Truck/><span><b>Delivery</b><small>Cash on delivery</small></span></div></div>
    <div className="thank-you-details"><div><span>Product ordered</span><strong>{params.product || product.name}</strong></div><div><span>Quantity</span><strong>{quantity}</strong></div><div><span>Total price</span><strong>{total ? formatNpr(total) : "Confirmed by our team"}</strong></div><div><span>Payment method</span><strong>Cash On Delivery</strong></div></div><div className="callout"><PhoneCall/><p>Our sales representative will call you soon to confirm your delivery details.</p></div></>}
    <Link href={confirmed ? "/" : "/checkout"} className="button-primary"><ArrowLeft size={17}/>{confirmed ? "Back to home" : "Go to checkout"}</Link><p className="support-line">Questions? <a href={`mailto:${product.businessEmail}`}>{product.businessEmail}</a></p>
  </div></main>;
}

