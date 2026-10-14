export type Testimonial = {
  id: string;
  quote: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  customerName?: string;
  profilePhoto?: string;
  verified: boolean;
  sample: boolean;
};

// Demo content only. Replace each entry with genuine customer feedback before
// changing `sample` to false. Set `verified` to true only after verification.
export const testimonials: Testimonial[] = [
  {
    id: "sample-kathmandu",
    quote:
      "The crochet work looks beautiful and the shirt feels much more premium than I expected. The black and cream design really stands out.",
    location: "Kathmandu",
    rating: 5,
    verified: false,
    sample: true,
  },
  {
    id: "sample-lalitpur",
    quote:
      "I love the handmade look. It feels different from the usual shirts you find in stores, and it works really well with both jeans and trousers.",
    location: "Lalitpur",
    rating: 5,
    verified: false,
    sample: true,
  },
  {
    id: "sample-pokhara",
    quote:
      "The open crochet texture makes it comfortable and stylish at the same time. I received several compliments the first time I wore it.",
    location: "Pokhara",
    rating: 5,
    verified: false,
    sample: true,
  },
  {
    id: "sample-bhaktapur",
    quote:
      "The finishing and details are my favourite part. It has a clean premium look without feeling too formal.",
    location: "Bhaktapur",
    rating: 5,
    verified: false,
    sample: true,
  },
  {
    id: "sample-chitwan",
    quote:
      "Really unique design. I wanted something handmade that I could wear casually, and this is exactly the kind of style I was looking for.",
    location: "Chitwan",
    rating: 5,
    verified: false,
    sample: true,
  },
  {
    id: "sample-butwal",
    quote:
      "The cream and black combination looks even better when styled with simple black trousers. A very distinctive shirt.",
    location: "Butwal",
    rating: 5,
    verified: false,
    sample: true,
  },
];
