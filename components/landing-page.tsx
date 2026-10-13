import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Box, HeartHandshake, Mail, MapPin, ShieldCheck, Sparkles, Truck, Wind } from "lucide-react";
import { ProductGallery } from "@/components/product-gallery";
import { QuantityOrder } from "@/components/quantity-order";
import { OrderForm } from "@/components/order-form";
import { formatNpr, orderingEnabled, product } from "@/lib/product";

const benefitIcons = [Sparkles, BadgeCheck, Wind, HeartHandshake, Box, ShieldCheck];

export function LandingPage() {
  return <main>
    <div className="announcement">Launch offer · Save NPR 1,000 · Cash on delivery across Nepal</div>
    <header className="site-header shell">
      <Link href="/" className="brand-mark" aria-label={`${product.brand} home`}><span>H</span><div><b>HEXA</b><small>CROCHET STUDIO</small></div></Link>
      <nav aria-label="Main navigation"><a href="#details">The shirt</a><a href="#craft">Craft</a><a href="#faq">FAQ</a></nav>
      <Link href="/checkout" className="button-small">Order now</Link>
    </header>

    <section className="hero shell">
      <div className="hero-copy reveal">
        <span className="eyebrow">A statement in every stitch</span>
        <h1>Handmade character.<br/><em>Effortless style.</em></h1>
        <p>{product.description}</p>
        <div className="hero-price"><b>{formatNpr(product.offerPrice)}</b><span>{formatNpr(product.regularPrice)}</span><i>20% off</i></div>
        <div className="flex flex-wrap gap-3"><Link href="/checkout" className="button-primary">Order now <ArrowRight size={17}/></Link><a href={`mailto:${product.businessEmail}`} className="button-secondary">Have questions?</a></div>
        {!orderingEnabled && <p className="configuration-note">Ordering activates as soon as verified size options are added.</p>}
        <div className="trust-row"><span><ShieldCheck/>Cash on delivery</span><span><Truck/>Across Nepal</span><span><HeartHandshake/>Human confirmation</span></div>
      </div>
      <div className="hero-image reveal reveal-delay">
        <Image src={product.images[0].src} alt={product.images[0].alt} fill priority sizes="(max-width: 900px) 100vw, 48vw" className="object-cover" />
        <div className="image-note"><span>01</span><p>CREAM / BLACK<br/>CROCHET EDITION</p></div>
      </div>
    </section>

    <section id="details" className="section shell showcase-grid">
      <ProductGallery images={product.images} />
      <div className="showcase-copy"><p className="eyebrow">The signature piece</p><h2>{product.shortName}</h2><p className="section-lead">Designed to bring texture and personality to simple outfits—whether you pair it with tailored trousers, denim or shorts.</p>
        <ul className="check-list">{product.benefits.slice(0, 4).map((item) => <li key={item}><BadgeCheck size={18}/>{item}</li>)}</ul>
        <QuantityOrder />
      </div>
    </section>

    <section className="ink-section"><div className="shell section">
      <div className="section-heading light"><p className="eyebrow">Why you’ll love it</p><h2>Texture that does the talking.</h2><p>Every detail is designed to make an everyday outfit feel considered.</p></div>
      <div className="benefit-grid">{product.benefits.map((benefit, index) => { const Icon = benefitIcons[index]; return <article key={benefit}><Icon/><span>0{index + 1}</span><h3>{benefit}</h3></article>; })}</div>
      <div className="center-cta"><Link href="/checkout" className="button-gold">Purchase now <ArrowRight size={17}/></Link></div>
    </div></section>

    <section id="craft" className="section shell editorial-grid">
      <div className="editorial-image detail-image"><Image src={product.images[2].src} alt={product.images[2].alt} fill sizes="(max-width: 800px) 100vw, 48vw" className="object-cover" /></div>
      <div className="editorial-copy"><p className="eyebrow">Product details</p><h2>A closer look at the craft.</h2><p>The open stitch pattern gives the shirt its airy visual rhythm. Black framing traces the collar, shoulders and front panels, turning a neutral piece into a distinctive statement.</p>
        <dl className="detail-list"><div><dt>Design</dt><dd>Hexagon-inspired geometric framing</dd></div><div><dt>Colour</dt><dd>Cream with black contrast details</dd></div><div><dt>Shape</dt><dd>Short sleeve, collared, button front</dd></div><div><dt>Styling</dt><dd>Wear open, buttoned or layered</dd></div></dl>
        <p className="fact-note">Material composition and care instructions will be added once verified.</p>
      </div>
    </section>

    <section className="lifestyle-section"><div className="shell lifestyle-grid">
      <div className="lifestyle-copy"><p className="eyebrow">One piece, your way</p><h2>Made to stand out.<br/>Easy to make yours.</h2><p>Ground the bold crochet texture with clean black trousers, relaxed denim or holiday-ready shorts.</p><Link href="/checkout" className="text-link">Buy now <ArrowRight size={17}/></Link></div>
      <div className="lifestyle-image"><Image src={product.images[1].src} alt={product.images[1].alt} fill sizes="(max-width: 800px) 100vw, 55vw" className="object-cover" /></div>
    </div></section>

    <section className="section shell size-section"><div><p className="eyebrow">Size & fit</p><h2>Choose with confidence.</h2><p>Verified sizes and exact garment measurements are still pending. We won’t guess them—and ordering will remain disabled until the size chart is complete.</p></div><div className="size-card"><span>Size guide</span><strong>Coming soon</strong><p>Add options and measurements in the central product configuration before launch.</p></div></section>

    <section className="offer-section"><div className="shell offer-inner"><div><p className="eyebrow">Limited launch price</p><h2>Refresh your style with handmade crochet fashion.</h2><p>Pay only when your order arrives. We’ll call first to confirm every detail.</p></div><div className="offer-price"><span>{formatNpr(product.regularPrice)}</span><strong>{formatNpr(product.offerPrice)}</strong><small>+ {formatNpr(product.deliveryFee)} delivery</small><Link href="/checkout" className="button-primary">Order now</Link></div></div></section>

    <section id="faq" className="section shell faq-grid"><div className="section-heading"><p className="eyebrow">Need to know</p><h2>Frequently asked questions.</h2><p>Still unsure? Email us and we’ll help.</p><a href={`mailto:${product.businessEmail}`} className="text-link"><Mail size={17}/> Contact us</a></div><div className="faq-list">{product.faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></section>

    <section className="order-form-section"><div className="shell order-form-grid"><div><p className="eyebrow">Prefer to order here?</p><h2>Simple details.<br/>No online payment.</h2><p>Complete the form and pay cash when your order arrives. We’ll confirm everything by phone first.</p><div className="mini-trust"><span><ShieldCheck/>Secure server submission</span><span><Truck/>Nationwide delivery</span><span><HeartHandshake/>Personal confirmation</span></div></div><OrderForm compact /></div></section>

    <section className="final-cta shell"><div><p className="eyebrow">Your next signature piece</p><h2>Wear something worth noticing.</h2><p>Cash on delivery. Nationwide in Nepal. Personal order confirmation.</p></div><Link href="/checkout" className="button-gold">Order your shirt <ArrowRight size={18}/></Link></section>

    <footer className="footer"><div className="shell footer-grid"><div className="brand-mark inverse"><span>H</span><div><b>HEXA</b><small>CROCHET STUDIO</small></div></div><p>A considered crochet statement for everyday wardrobes.</p><div><a href={`mailto:${product.businessEmail}`}><Mail size={16}/>{product.businessEmail}</a><span><MapPin size={16}/>Delivery across Nepal</span></div></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} {product.brand}</span><span>Cash on Delivery · Nepal</span></div></footer>
  </main>;
}

