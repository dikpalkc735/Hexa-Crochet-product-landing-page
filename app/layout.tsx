import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Handmade Crochet Hexagon Shirt | Hexa Crochet Studio", template: "%s | Hexa Crochet Studio" },
  description: "Shop the cream-and-black Handmade Crochet Hexagon Unisex Shirt with Cash on Delivery across Nepal.",
  openGraph: { title: "Handmade Crochet Hexagon Shirt", description: "Handmade character. Everyday comfort. Cash on Delivery across Nepal.", images: ["/images/product-studio.webp"], type: "website" },
  twitter: { card: "summary_large_image", title: "Handmade Crochet Hexagon Shirt", description: "A cream-and-black crochet statement piece, available across Nepal.", images: ["/images/product-studio.webp"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
