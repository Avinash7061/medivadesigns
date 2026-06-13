import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import styles from "./home.module.css";
import { FiTruck, FiShield, FiHeart, FiMail } from "react-icons/fi";

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
    return products.map((p) => ({ ...p, images: JSON.parse(p.images) }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* ═══════════════ Hero Section ═══════════════ */}
      <section className={styles.hero}>
        <div className={styles["hero-bg"]}>
          <div className={`${styles["hero-mandala"]} ${styles["hero-mandala-1"]}`} />
          <div className={`${styles["hero-mandala"]} ${styles["hero-mandala-2"]}`} />
          <div className={`${styles["hero-mandala"]} ${styles["hero-mandala-3"]}`} />
          <div className={`${styles["hero-mandala"]} ${styles["hero-mandala-4"]}`} />
          <div className={`${styles["hero-glow"]} ${styles["hero-glow-1"]}`} />
          <div className={`${styles["hero-glow"]} ${styles["hero-glow-2"]}`} />
        </div>

        <div className={styles["hero-content"]}>
          <div className={styles["hero-text"]}>
            <div className={styles["hero-badge"]}>
              ✦ Handcrafted Mandala Art
            </div>
            <h1 className={styles["hero-title"]}>
              Where Art Meets{" "}
              <span className={styles["hero-title-gradient"]}>Sacred Geometry</span>
            </h1>
            <p className={styles["hero-description"]}>
              Each mandala painting is a unique masterpiece, meticulously handcrafted
              to bring harmony, balance, and spiritual energy to your living space.
            </p>
            <div className={styles["hero-actions"]}>
              <Link href="/shop" className="btn btn-primary btn-lg">
                Explore Collection
              </Link>
              <Link href="/about" className="btn btn-secondary btn-lg">
                Our Story
              </Link>
            </div>
            <div className={styles["hero-stats"]}>
              <div>
                <div className={styles["hero-stat-number"]}>500+</div>
                <div className={styles["hero-stat-label"]}>Paintings Sold</div>
              </div>
              <div>
                <div className={styles["hero-stat-number"]}>50+</div>
                <div className={styles["hero-stat-label"]}>Unique Designs</div>
              </div>
              <div>
                <div className={styles["hero-stat-number"]}>4.9★</div>
                <div className={styles["hero-stat-label"]}>Avg Rating</div>
              </div>
            </div>
          </div>

          <div className={styles["hero-visual"]}>
            <div className={styles["hero-image-wrap"]}>
              <Image
                src="https://swsdrfmcuuycklfijgws.supabase.co/storage/v1/object/public/products/Selected%20Image/IMG_4424.jpeg"
                alt="Goddess Durga Mandala — Handcrafted by Mediva Designs"
                width={600}
                height={750}
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
            <div className={`${styles["hero-floating-card"]} ${styles["hero-floating-card-1"]}`}>
              <div className={styles["hero-floating-label"]}>Starting From</div>
              <div className={styles["hero-floating-value"]}>₹1,499</div>
            </div>
            <div className={`${styles["hero-floating-card"]} ${styles["hero-floating-card-2"]}`}>
              <div className={styles["hero-floating-label"]}>Free Shipping</div>
              <div className={styles["hero-floating-value"]}>Pan India</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ Categories Section ═══════════════ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Explore by Category</h2>
          <p className="section-subtitle">
            Find the perfect mandala that resonates with your spirit
          </p>
          <div className={styles["categories-grid"]}>
            {[
              { name: "Geometric", count: 12, img: "https://images.unsplash.com/photo-1609619385002-f40f1df9b7eb?w=400&h=400&fit=crop", slug: "geometric" },
              { name: "Floral", count: 10, img: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=400&h=400&fit=crop", slug: "floral" },
              { name: "Spiritual", count: 8, img: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=400&fit=crop", slug: "spiritual" },
              { name: "Modern", count: 6, img: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop", slug: "modern" },
            ].map((cat) => (
              <Link href={`/shop?category=${cat.slug}`} key={cat.slug} className={styles["category-card"]}>
                <Image src={cat.img} alt={cat.name} width={400} height={400} style={{ objectFit: "cover" }} />
                <div className={styles["category-overlay"]}>
                  <h3 className={styles["category-name"]}>{cat.name}</h3>
                  <p className={styles["category-count"]}>{cat.count} paintings</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ Featured Products ═══════════════ */}
      {featured.length > 0 && (
        <section className="section" style={{ background: "var(--bg-secondary)" }}>
          <div className="container">
            <h2 className="section-title">Featured Collection</h2>
            <p className="section-subtitle">
              Our most loved mandala paintings, handpicked for you
            </p>
            <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-xl)" }}>
              {featured.map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.images[0] || "https://images.unsplash.com/photo-1609619385002-f40f1df9b7eb?w=400&h=400&fit=crop"}
                  category={product.category}
                  stock={product.stock}
                  featured={product.featured}
                />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "var(--space-2xl)" }}>
              <Link href="/shop" className="btn btn-secondary btn-lg">
                View All Paintings →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ Features Section ═══════════════ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Choose Mediva Designs</h2>
          <p className="section-subtitle">
            Every painting tells a story, every brushstroke carries intention
          </p>
          <div className={styles["features-grid"]}>
            <div className={styles["feature-card"]}>
              <div className={styles["feature-icon"]}>🎨</div>
              <h3 className={styles["feature-title"]}>Handcrafted with Love</h3>
              <p className={styles["feature-desc"]}>
                Each mandala is meticulously created by skilled artists, ensuring every piece is one-of-a-kind and carries authentic spiritual energy.
              </p>
            </div>
            <div className={styles["feature-card"]}>
              <div className={styles["feature-icon"]}>🚚</div>
              <h3 className={styles["feature-title"]}>Free Pan-India Shipping</h3>
              <p className={styles["feature-desc"]}>
                We deliver your art piece safely to your doorstep with premium packaging, absolutely free across India.
              </p>
            </div>
            <div className={styles["feature-card"]}>
              <div className={styles["feature-icon"]}>🛡️</div>
              <h3 className={styles["feature-title"]}>Quality Guaranteed</h3>
              <p className={styles["feature-desc"]}>
                Premium materials, vibrant colors that last a lifetime. Every painting comes with a quality certificate and return guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ Testimonials ═══════════════ */}
      <section className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">
            Join 500+ happy customers who brought mandala magic into their homes
          </p>
          <div className={styles["testimonials-grid"]}>
            {[
              {
                name: "Priya Sharma",
                role: "Interior Designer",
                initial: "P",
                text: "The mandala paintings from Mediva Designs transformed my client's living room. The level of detail and vibrant colors are absolutely stunning. Truly premium quality!",
              },
              {
                name: "Rahul Mehta",
                role: "Art Collector",
                initial: "R",
                text: "I've been collecting mandala art for years, and Mediva Designs stands out. Their geometric mandalas are precisely crafted and the spiritual energy they bring is palpable.",
              },
              {
                name: "Ananya Patel",
                role: "Yoga Instructor",
                initial: "A",
                text: "I use their mandala paintings in my yoga studio. The intricate patterns help my students find focus and peace during meditation. Absolutely beautiful work!",
              },
            ].map((t, i) => (
              <div key={i} className={styles["testimonial-card"]}>
                <div className={styles["testimonial-stars"]}>★★★★★</div>
                <p className={styles["testimonial-text"]}>&quot;{t.text}&quot;</p>
                <div className={styles["testimonial-author"]}>
                  <div className={styles["testimonial-avatar"]}>{t.initial}</div>
                  <div>
                    <div className={styles["testimonial-name"]}>{t.name}</div>
                    <div className={styles["testimonial-role"]}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ Newsletter Section ═══════════════ */}
      <section className="section">
        <div className="container">
          <div className={styles["newsletter-card"]}>
            <div className={styles["newsletter-content"]}>
              <h2 className={styles["newsletter-title"]}>Join the Inner Circle</h2>
              <p className={styles["newsletter-desc"]}>
                Subscribe to receive early access to new collections, exclusive art tips, and 10% off your first order.
              </p>
              <form className={styles["newsletter-form"]}>
                <input type="email" placeholder="your@email.com" required className={styles["newsletter-input"]} />
                <button type="submit" className="btn btn-primary">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA Section ═══════════════ */}
      <section className={styles["cta-section"]}>
        <div className={styles["cta-bg"]} />
        <div className="container">
          <div className={styles["cta-content"]}>
            <h2 className={styles["cta-title"]}>Ready to Transform Your Space?</h2>
            <p className={styles["cta-desc"]}>
              Browse our exclusive collection of handcrafted mandala paintings and find the perfect piece that speaks to your soul.
            </p>
            <Link href="/shop" className="btn btn-gold btn-lg">
              Shop Now →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

