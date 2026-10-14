"use client";

import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { formatNpr, orderTotal, product } from "@/lib/product";

export function QuantityOrder() {
  const [quantity, setQuantity] = useState(1);
  return <div className="order-card">
    <div className="flex items-end justify-between gap-4">
      <div><p className="eyebrow">Launch offer</p><div className="mt-1 flex flex-wrap items-baseline gap-3"><span className="text-3xl font-semibold">{formatNpr(product.offerPrice)}</span><span className="text-sm text-stone-500 line-through">{formatNpr(product.regularPrice)}</span></div></div>
      <span className="offer-pill">Save {Math.round((1 - product.offerPrice / product.regularPrice) * 100)}%</span>
    </div>
    <p className="mt-3 text-sm text-stone-600">+ {formatNpr(product.deliveryFee)} delivery anywhere in Nepal</p>
    <div className="my-6 flex items-center justify-between border-y border-black/10 py-4"><span className="text-sm font-medium">Quantity</span><div className="quantity-control"><button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={16} /></button><output aria-live="polite">{quantity}</output><button onClick={() => setQuantity((q) => Math.min(10, q + 1))} aria-label="Increase quantity"><Plus size={16} /></button></div></div>
    <div className="mb-5 flex items-center justify-between"><span className="text-sm text-stone-600">Total incl. delivery</span><strong className="text-xl">{formatNpr(orderTotal(quantity))}</strong></div>
    <Link href={`/checkout?quantity=${quantity}`} className="button-primary w-full">Order now — cash on delivery</Link>
  </div>;
}

