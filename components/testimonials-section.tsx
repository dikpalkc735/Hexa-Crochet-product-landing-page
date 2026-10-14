import Image from "next/image";
import { BadgeCheck, Star } from "lucide-react";
import { formatNpr, product } from "@/lib/product";
import { testimonials, type Testimonial } from "@/lib/testimonials";

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="testimonial-card">
      <div className="testimonial-stars" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, index) => (
          <Star key={index} aria-hidden="true" className={index < testimonial.rating ? "star-filled" : ""} />
        ))}
      </div>
      <blockquote>“{testimonial.quote}”</blockquote>
      <footer className="testimonial-meta">
        {testimonial.profilePhoto && (
          <Image
            src={testimonial.profilePhoto}
            alt={testimonial.customerName ? `${testimonial.customerName} profile` : "Customer profile"}
            width={42}
            height={42}
            className="testimonial-avatar"
          />
        )}
        <div>
          {testimonial.customerName && <strong>{testimonial.customerName}</strong>}
          <span>{testimonial.location}</span>
        </div>
        {testimonial.sample ? (
          <small className="sample-label">Sample feedback</small>
        ) : testimonial.verified ? (
          <small className="verified-label"><BadgeCheck aria-hidden="true" />Verified purchase</small>
        ) : null}
      </footer>
    </article>
  );
}

export function TestimonialsSection() {
  return (
    <section id="feedback" className="testimonials-section section" aria-labelledby="testimonials-heading">
      <div className="shell">
        <div className="testimonials-heading">
          <div>
            <p className="eyebrow">Customer feedback</p>
            <h2 id="testimonials-heading">Worn. Loved. Remembered.</h2>
          </div>
          <p>See why customers love the comfort, craftsmanship and distinctive look of HEXA.</p>
        </div>
        <div className="demo-disclosure" role="note">Sample content for layout preview — not verified customer reviews</div>
        <div className="testimonials-track" aria-label="Sample testimonials">
          {testimonials.map((testimonial) => <TestimonialCard key={testimonial.id} testimonial={testimonial} />)}
        </div>
        <p className="testimonial-swipe-hint" aria-hidden="true">Swipe to explore</p>
        <div className="testimonials-cta">
          <p>Ready to make it yours?</p>
          <a href="/checkout" className="button-primary">Order Yours — {formatNpr(product.offerPrice)}</a>
          <small>Cash on Delivery <span aria-hidden="true">•</span> Nationwide Delivery Across Nepal</small>
        </div>
      </div>
    </section>
  );
}
