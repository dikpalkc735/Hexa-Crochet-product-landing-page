import Image from "next/image";

type BrandLogoProps = {
  variant?: "primary" | "checkout";
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ variant = "primary", className = "", priority = false }: BrandLogoProps) {
  const checkout = variant === "checkout";
  return <Image
    src={checkout ? "/logos/hexa-logo-checkout.webp" : "/logos/hexa-logo-primary.webp"}
    alt="Hexa Crochet Studio"
    width={760}
    height={checkout ? 264 : 262}
    priority={priority}
    sizes="(max-width: 600px) 180px, 240px"
    className={`brand-logo-image ${className}`}
  />;
}
