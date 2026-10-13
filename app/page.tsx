import { LandingPage } from "@/components/landing-page";
import { product } from "@/lib/product";

export default function Home() {
  const data = { "@context": "https://schema.org", "@type": "Product", name: product.name, image: product.images.map((image) => image.src), description: product.description, brand: { "@type": "Brand", name: product.brand }, offers: { "@type": "Offer", priceCurrency: product.currency, price: product.offerPrice, url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000" } };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} /><LandingPage /></>;
}
