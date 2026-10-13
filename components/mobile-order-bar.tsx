import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatNpr, product } from "@/lib/product";

export function MobileOrderBar() {
  return <div className="mobile-order-bar" aria-label="Quick order">
    <div><small>Launch offer</small><strong>{formatNpr(product.offerPrice)}</strong></div>
    <Link href="/checkout">Order now <ArrowRight size={16}/></Link>
  </div>;
}
