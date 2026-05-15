"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { FiMinus, FiPlus, FiShoppingBag, FiArrowLeft, FiHeart } from "react-icons/fi";

interface ProductDetailClientProps {
  product: any;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

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
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container" style={{ padding: "var(--space-3xl) var(--space-lg)", position: "relative", zIndex: 1 }}>
      <Link
        href="/shop"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-sm)",
          color: "var(--text-secondary)",
          marginBottom: "var(--space-xl)",
          fontFamily: "var(--font-accent)",
          fontSize: "0.9rem",
          transition: "color 0.2s",
        }}
      >
        <FiArrowLeft /> Back to Shop
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "var(--space-3xl)",
          alignItems: "start",
        }}
      >
        {/* Image Gallery */}
        <div>
          <div
            style={{
              aspectRatio: "1",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--bg-tertiary)",
              marginBottom: "var(--space-md)",
              position: "relative",
            }}
          >
            <Image
              src={product.images[selectedImage] || "https://images.unsplash.com/photo-1609619385002-f40f1df9b7eb?w=600&h=600&fit=crop"}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div style={{ display: "flex", gap: "var(--space-sm)" }}>
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: selectedImage === i ? "2px solid var(--primary-light)" : "1px solid var(--border)",
                    cursor: "pointer",
                    opacity: selectedImage === i ? 1 : 0.6,
                    transition: "all 0.2s",
                    position: "relative",
                  }}
                >
                  <Image src={img} alt="" fill style={{ objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <span className="badge badge-primary" style={{ marginBottom: "var(--space-md)" }}>
            {product.category}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: 700,
              marginBottom: "var(--space-md)",
              lineHeight: 1.2,
            }}
          >
            {product.name}
          </h1>
          <div
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: "2rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, var(--secondary), var(--secondary-light))",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "var(--space-lg)",
            }}
          >
            ₹{product.price.toLocaleString()}
          </div>

          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              marginBottom: "var(--space-xl)",
              fontSize: "1.05rem",
            }}
          >
            {product.description}
          </p>

          {/* Stock */}
          <div style={{ marginBottom: "var(--space-xl)" }}>
            {product.stock > 0 ? (
              <span className="badge badge-success">
                ● In Stock ({product.stock} available)
              </span>
            ) : (
              <span style={{ color: "var(--error)", fontWeight: 600 }}>Out of Stock</span>
            )}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <>
              <div style={{ marginBottom: "var(--space-xl)" }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-accent)",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    marginBottom: "var(--space-sm)",
                  }}
                >
                  Quantity
                </label>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: "44px",
                      height: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                    }}
                  >
                    <FiMinus />
                  </button>
                  <span
                    style={{
                      width: "50px",
                      textAlign: "center",
                      fontFamily: "var(--font-accent)",
                      fontWeight: 600,
                    }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={{
                      width: "44px",
                      height: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                    }}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
                <button className="btn btn-primary btn-lg" onClick={handleAddToCart} style={{ flex: 1 }}>
                  <FiShoppingBag />
                  {added ? "Added!" : "Add to Cart"}
                </button>
                <button className="btn btn-secondary btn-icon" style={{ width: "52px", height: "52px" }}>
                  <FiHeart />
                </button>
              </div>
            </>
          )}

          {/* Features list */}
          <div
            style={{
              padding: "var(--space-lg)",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
            }}
          >
            {[
              "🎨 100% Handcrafted",
              "🚚 Free Pan-India Shipping",
              "🔄 7-Day Return Policy",
              "📜 Certificate of Authenticity",
            ].map((feat) => (
              <div
                key={feat}
                style={{
                  padding: "var(--space-sm) 0",
                  borderBottom: "1px solid var(--border)",
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                }}
              >
                {feat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
