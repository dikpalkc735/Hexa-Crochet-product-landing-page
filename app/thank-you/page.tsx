import Link from "next/link";
import { ArrowLeft, Check, PhoneCall } from "lucide-react";
import { formatNpr, product } from "@/lib/product";

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const quantity = Math.max(1, Number(params.quantity || 1));
  const total = Number(params.total || 0);
  return <main className="thank-you-page"><div className="thank-you-card"><div className="success-mark"><Check/></div><p className="eyebrow">Order {params.orderId || "received"}</p><h1>Thank you for your order!</h1><p className="thank-you-lead">We have received your order successfully.</p><div className="thank-you-details"><div><span>Product ordered</span><strong>{params.product || product.name}</strong></div><div><span>Quantity</span><strong>{quantity}</strong></div><div><span>Total price</span><strong>{total ? formatNpr(total) : "Confirmed by our team"}</strong></div><div><span>Payment method</span><strong>Cash On Delivery</strong></div></div><div className="callout"><PhoneCall/><p>Our sales representative will call you soon to confirm your order.</p></div><Link href="/" className="button-primary"><ArrowLeft size={17}/>Back to home</Link><p className="support-line">Questions? <a href={`mailto:${product.businessEmail}`}>{product.businessEmail}</a></p></div></main>;
}

