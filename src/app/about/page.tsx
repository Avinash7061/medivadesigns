"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Hero */}
      <section
        style={{
          padding: "var(--space-4xl) 0",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(198, 125, 59, 0.03))",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span
            className="badge badge-gold"
            style={{ marginBottom: "var(--space-lg)", display: "inline-flex" }}
          >
            Our Story
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              marginBottom: "var(--space-lg)",
              lineHeight: 1.2,
            }}
          >
            The Art of{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--secondary), var(--accent-light))",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Sacred Geometry
            </span>
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.15rem",
              lineHeight: 1.8,
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            At Mediva Designs, we believe that art is a bridge between the material and the spiritual.
            Each mandala we create is a meditation in itself — a journey of precision, patience, and passion.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "var(--space-3xl)",
              alignItems: "center",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  fontWeight: 700,
                  marginBottom: "var(--space-lg)",
                }}
              >
                Our Mission
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "var(--space-lg)" }}>
                We are dedicated to keeping the ancient art of mandala alive in the modern world.
                Our artists combine centuries-old techniques with contemporary aesthetics to create
                pieces that resonate with today&apos;s art lovers while honoring timeless traditions.
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "var(--space-lg)" }}>
                Every painting is handcrafted using premium materials — from the finest canvases to
                archival-quality paints that ensure your mandala remains vibrant for generations.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-lg)" }}>
                {[
                  { num: "500+", label: "Paintings Delivered" },
                  { num: "50+", label: "Unique Designs" },
                  { num: "4.9/5", label: "Customer Rating" },
                  { num: "100%", label: "Handcrafted" },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--secondary)" }}>{s.num}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                aspectRatio: "4/5",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=750&fit=crop"
                alt="Artist creating mandala"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--space-xl)", marginTop: "var(--space-2xl)" }}>
            {[
              { icon: "🎨", title: "Authenticity", desc: "Every piece is genuinely handcrafted by skilled artisans, never mass-produced." },
              { icon: "🌿", title: "Sustainability", desc: "We use eco-friendly materials and sustainable packaging for all our shipments." },
              { icon: "💜", title: "Passion", desc: "Art is our language. We pour love and intention into every brushstroke." },
            ].map((v) => (
              <div
                key={v.title}
                style={{
                  padding: "var(--space-2xl)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-md)" }}>{v.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "var(--space-sm)" }}>{v.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: "center" }}>
        <div className="container">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, marginBottom: "var(--space-md)" }}>
            Ready to Explore?
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-xl)", maxWidth: "500px", margin: "0 auto var(--space-xl)" }}>
            Browse our collection and find the perfect mandala for your space.
          </p>
          <Link href="/shop" className="btn btn-primary btn-lg">
            Shop Now →
          </Link>
        </div>
      </section>
    </div>
  );
}
