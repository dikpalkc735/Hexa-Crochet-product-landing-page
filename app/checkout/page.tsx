import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, PhoneCall, ShieldCheck, Truck } from "lucide-react";
import { OrderForm } from "@/components/order-form";
import { formatNpr, orderTotal, product } from "@/lib/product";

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ quantity?: string }> }) {
  const params = await searchParams;
  const parsed = Number(params.quantity || 1);
  const quantity = Number.isInteger(parsed) ? Math.min(10, Math.max(1, parsed)) : 1;
  return <main className="checkout-page">
    <header className="checkout-header shell"><Link href="/" className="brand-mark"><span>H</span><div><b>HEXA</b><small>CROCHET STUDIO</small></div></Link><div><LockKeyhole size={15}/>Secure order form</div></header>
    <div className="checkout-shell shell">
      <section><Link href="/" className="back-link"><ArrowLeft size={16}/>Back to product</Link><div className="checkout-logo-feature" aria-label={product.brand}><span>H</span><div><small>HANDMADE IN STYLE</small><strong>HEXA CROCHET STUDIO</strong></div></div><div className="checkout-title"><p className="eyebrow">One last step</p><h1>Confirm your order.</h1><p>Enter your delivery details and confirm with one tap. No online payment is required.</p></div><OrderForm initialQuantity={quantity}/></section>
      <aside className="checkout-aside"><div className="checkout-product"><div className="checkout-product-logo"><span>H</span><b>HEXA</b></div><div className="relative aspect-[4/5] overflow-hidden rounded-2xl"><Image src={product.images[0].src} alt={product.images[0].alt} fill priority sizes="360px" className="object-cover"/></div><p className="eyebrow">Your order</p><h2>{product.name}</h2><div className="checkout-price"><span>{formatNpr(product.offerPrice)} × {quantity}</span><strong>{formatNpr(orderTotal(quantity))}</strong></div><small>Includes {formatNpr(product.deliveryFee)} delivery.</small></div><div className="aside-trust"><span><ShieldCheck/>Cash on Delivery</span><span><Truck/>Delivery across Nepal</span><span><PhoneCall/>Call before dispatch</span></div></aside>
    </div>
  </main>;
}

