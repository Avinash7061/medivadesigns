"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import {
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowLeft,
  FiHeart,
  FiShare2,
  FiCheck,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiAward,
} from "react-icons/fi";

interface ProductDetailClientProps {
  product: any;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCart();

  let tags: string[] = [];
  try {
    tags = product.tags ? JSON.parse(product.tags) : [];
  } catch {
    tags = [];
  }

  const handleAddToCart = () => {
    if (!product) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || "",
        category: product.category,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const specs = [
    product.dimensions && { label: "Dimensions", value: product.dimensions, icon: "📐" },
    product.medium && { label: "Medium", value: product.medium, icon: "🎨" },
    { label: "Category", value: product.category.charAt(0).toUpperCase() + product.category.slice(1), icon: "🏷️" },
    { label: "Availability", value: product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock", icon: product.stock > 0 ? "✅" : "❌" },
  ].filter(Boolean) as { label: string; value: string; icon: string }[];

  const features = [
    { icon: <FiTruck />, title: "Free Shipping", desc: "Pan-India delivery at no extra cost" },
    { icon: <FiRefreshCw />, title: "7-Day Returns", desc: "Hassle-free returns within 7 days" },
    { icon: <FiShield />, title: "Secure Payment", desc: "100% secure & encrypted checkout" },
    { icon: <FiAward />, title: "Authenticity", desc: "Certificate of authenticity included" },
  ];

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Breadcrumb */}
      <div className="container" style={{ paddingTop: "var(--space-xl)", paddingBottom: 0 }}>
        <nav style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "var(--font-accent)" }}>
          <Link href="/" style={{ color: "var(--text-muted)" }}>Home</Link>
          <span>/</span>
          <Link href="/shop" style={{ color: "var(--text-muted)" }}>Shop</Link>
          <span>/</span>
          <span style={{ color: "var(--text-primary)" }}>{product.name}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <section className="container" style={{ padding: "var(--space-2xl) var(--space-lg)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-3xl)", alignItems: "start" }}>

          {/* ── Left: Image Gallery ── */}
          <div style={{ position: "sticky", top: "120px" }}>
            {/* Main Image */}
            <div
              style={{
                aspectRatio: "1",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                border: "1px solid var(--border)",
                background: "var(--bg-tertiary)",
                marginBottom: "var(--space-md)",
                position: "relative",
                cursor: "zoom-in",
              }}
            >
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                  priority
                  onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>🎨</div>
              )}
              {product.featured && (
                <div style={{ position: "absolute", top: "var(--space-md)", left: "var(--space-md)", background: "linear-gradient(135deg, var(--secondary), var(--secondary-light))", color: "white", padding: "0.3rem 0.8rem", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", fontWeight: 700, fontFamily: "var(--font-accent)", letterSpacing: "0.05em" }}>
                  ★ FEATURED
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "var(--radius-md)",
                      overflow: "hidden",
                      border: selectedImage === i ? "2px solid var(--primary-light)" : "1px solid var(--border)",
                      cursor: "pointer",
                      opacity: selectedImage === i ? 1 : 0.55,
                      transition: "all 0.2s",
                      position: "relative",
                      padding: 0,
                      background: "var(--bg-tertiary)",
                    }}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill style={{ objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product Info ── */}
          <div>
            {/* Category Badge */}
            <span className="badge badge-primary" style={{ marginBottom: "var(--space-md)", display: "inline-block" }}>
              {product.category}
            </span>

            {/* Name */}
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, marginBottom: "var(--space-sm)", lineHeight: 1.2 }}>
              {product.name}
            </h1>

            {/* Stars (decorative) */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
              <div style={{ color: "#f59e0b", fontSize: "1rem" }}>★★★★★</div>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "var(--font-accent)" }}>Handcrafted with love</span>
            </div>

            {/* Price */}
            <div style={{ fontFamily: "var(--font-accent)", fontSize: "2.25rem", fontWeight: 800, background: "linear-gradient(135deg, var(--secondary), var(--secondary-light))", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "var(--space-xl)" }}>
              ₹{product.price.toLocaleString("en-IN")}
            </div>

            {/* Description */}
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.9, marginBottom: "var(--space-xl)", fontSize: "1.02rem" }}>
              {product.description}
            </p>

            {/* ── Painting Specs ── */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "var(--space-xl)" }}>
              <div style={{ padding: "var(--space-md) var(--space-lg)", borderBottom: "1px solid var(--border)", background: "var(--bg-tertiary)" }}>
                <span style={{ fontFamily: "var(--font-accent)", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)" }}>Painting Details</span>
              </div>
              {specs.map((spec) => (
                <div key={spec.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-md) var(--space-lg)", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", color: "var(--text-muted)", fontSize: "0.9rem", fontFamily: "var(--font-accent)" }}>
                    <span>{spec.icon}</span> {spec.label}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: "0.95rem", color: spec.label === "Availability" && product.stock > 0 ? "var(--success)" : "var(--text-primary)" }}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", marginBottom: "var(--space-xl)" }}>
                {tags.map((tag: string) => (
                  <span key={tag} style={{ padding: "0.3rem 0.8rem", background: "rgba(139, 92, 246, 0.08)", border: "1px solid rgba(139, 92, 246, 0.2)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", color: "var(--primary-light)", fontFamily: "var(--font-accent)" }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Quantity & Actions ── */}
            {product.stock > 0 ? (
              <>
                <div style={{ marginBottom: "var(--space-lg)" }}>
                  <label style={{ display: "block", fontFamily: "var(--font-accent)", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "var(--space-sm)" }}>Quantity</label>
                  <div style={{ display: "inline-flex", alignItems: "center", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: "46px", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", cursor: "pointer", transition: "background 0.2s" }}>
                      <FiMinus />
                    </button>
                    <span style={{ width: "54px", textAlign: "center", fontFamily: "var(--font-accent)", fontWeight: 700, fontSize: "1.1rem" }}>{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{ width: "46px", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", cursor: "pointer", transition: "background 0.2s" }}>
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleAddToCart}
                    style={{ flex: 1, transition: "all 0.3s", background: added ? "var(--success)" : undefined }}
                  >
                    {added ? <><FiCheck /> Added to Cart!</> : <><FiShoppingBag /> Add to Cart</>}
                  </button>
                  <button
                    onClick={() => setWishlisted((w) => !w)}
                    className="btn btn-secondary btn-icon"
                    style={{ width: "52px", height: "52px", color: wishlisted ? "#ef4444" : undefined, borderColor: wishlisted ? "#ef4444" : undefined }}
                    title="Wishlist"
                  >
                    <FiHeart style={{ fill: wishlisted ? "#ef4444" : "none" }} />
                  </button>
                  <button onClick={handleShare} className="btn btn-secondary btn-icon" style={{ width: "52px", height: "52px" }} title="Share">
                    <FiShare2 />
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: "var(--space-lg)", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-xl)", textAlign: "center", color: "var(--error)", fontWeight: 600 }}>
                ✕ Currently Out of Stock — <Link href="/contact" style={{ color: "var(--primary-light)" }}>Enquire for Custom Order</Link>
              </div>
            )}

            {/* ── Feature Badges ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm)" }}>
              {features.map((f) => (
                <div key={f.title} style={{ padding: "var(--space-md)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", display: "flex", gap: "var(--space-sm)", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--primary-light)", fontSize: "1.1rem", marginTop: "2px", flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-accent)", fontWeight: 700, fontSize: "0.85rem" }}>{f.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Back to Shop ── */}
      <div className="container" style={{ paddingBottom: "var(--space-4xl)" }}>
        <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-accent)", fontSize: "0.9rem", transition: "color 0.2s" }}>
          <FiArrowLeft /> Back to All Paintings
        </Link>
      </div>
    </div>
  );
}
