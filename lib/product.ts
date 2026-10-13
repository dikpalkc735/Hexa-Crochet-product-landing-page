export const product = {
  brand: "Hexa Crochet Studio",
  name: "Handmade Crochet Hexagon Unisex Shirt – Cream & Black",
  shortName: "Crochet Hexagon Shirt",
  tagline: "Handmade style. Everyday comfort. Timeless fashion.",
  promo: "Refresh Your Style with Handmade Crochet Fashion!",
  description:
    "A distinctive cream-and-black crochet shirt with geometric detailing, an open textured construction, short sleeves and a button-front silhouette.",
  currency: "NPR",
  regularPrice: 4999,
  offerPrice: 1999,
  deliveryFee: 150,
  deliveryLabel: "Flat NPR 150 delivery across Nepal",
  businessEmail: "dikpalkc735@gmail.com",
  sizes: [] as string[],
  images: [
    { src: "/images/product-studio.webp", alt: "Cream and black crochet shirt on a warm studio background" },
    { src: "/images/product-lifestyle.webp", alt: "Model wearing the cream and black crochet shirt with black trousers" },
    { src: "/images/product-detail.webp", alt: "Close-up of the crochet stitches, collar and buttons" },
    { src: "/images/product-flatlay.webp", alt: "Crochet shirt styled in a fashion flat lay" },
    { src: "/images/product-hanger.webp", alt: "Cream and black crochet shirt displayed on a wooden hanger" },
  ],
  videos: [
    {
      src: "/videos/crochet-shirt-nepal-promo.mp4",
      poster: "/images/product-hanger.webp",
      title: "Crochet shirt showcase",
    },
  ],
  benefits: [
    "Unique hexagon-inspired design",
    "Cream-and-black statement palette",
    "Versatile unisex styling",
    "Open, airy crochet texture",
    "Short sleeves and button front",
    "Easy to pair with everyday outfits",
  ],
  faqs: [
    { question: "Is this crochet shirt suitable for both men and women?", answer: "Yes. The shirt has a versatile unisex look designed to complement a wide range of outfits and personal styles." },
    { question: "Is the crochet shirt comfortable to wear?", answer: "Its open crochet construction creates a textured, airy feel. Comfort and fit depend on the final yarn composition, size and your personal preferences." },
    { question: "What can I wear with this crochet shirt?", answer: "Style it with jeans, casual trousers, shorts or layered outfits. The cream-and-black palette works easily with neutral wardrobes." },
    { question: "What sizes are available?", answer: "Verified sizes and garment measurements will be published before ordering opens. Please check the size guide once it is available." },
    { question: "How long will delivery take?", answer: "Delivery timing depends on your location in Nepal. Our team will confirm the expected timeline when we call to verify your order." },
  ],
} as const;

export const orderingEnabled = product.sizes.length > 0;

export function formatNpr(value: number) {
  return `NPR ${new Intl.NumberFormat("en-NP").format(value)}`;
}

export function orderTotal(quantity: number) {
  return product.offerPrice * quantity + product.deliveryFee;
}

