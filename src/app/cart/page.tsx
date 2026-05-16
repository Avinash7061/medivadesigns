"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/hooks/useUser";
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingBag } from "react-icons/fi";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const { user } = useUser();

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "var(--space-4xl) var(--space-lg)", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "4rem", marginBottom: "var(--space-lg)" }}>🛒</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", marginBottom: "var(--space-md)" }}>
          Your Cart is Empty
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-xl)" }}>
          Discover our beautiful mandala paintings and add them to your cart
        </p>
        <Link href="/shop" className="btn btn-primary btn-lg">
          <FiShoppingBag /> Browse Paintings
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "var(--space-3xl) var(--space-lg)", position: "relative", zIndex: 1 }}>
      <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-xl)", fontFamily: "var(--font-accent)", fontSize: "0.9rem" }}>
        <FiArrowLeft /> Continue Shopping
      </Link>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, marginBottom: "var(--space-xl)" }}>
        Shopping Cart <span style={{ color: "var(--text-muted)", fontSize: "1rem", fontWeight: 400 }}>({totalItems} items)</span>
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "var(--space-2xl)", alignItems: "start" }}>
        {/* Cart Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {items.map((item) => (
            <div
              key={item.product.id}
              style={{
                display: "flex",
                gap: "var(--space-lg)",
                padding: "var(--space-lg)",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                transition: "all 0.2s",
              }}
            >
              <div style={{ width: "120px", height: "120px", borderRadius: "var(--radius-md)", overflow: "hidden", flexShrink: 0 }}>
                <img src={item.product.image} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.75rem", color: "var(--secondary)", fontFamily: "var(--font-accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.product.category}</p>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 600, marginBottom: "var(--space-sm)" }}>{item.product.name}</h3>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "1.15rem", fontWeight: 700, color: "var(--secondary)", marginBottom: "var(--space-md)" }}>₹{item.product.price.toLocaleString()}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", cursor: "pointer" }}>
                      <FiMinus size={14} />
                    </button>
                    <span style={{ width: "40px", textAlign: "center", fontWeight: 600, fontSize: "0.9rem" }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", cursor: "pointer" }}>
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.product.id)} style={{ color: "var(--error)", display: "flex", alignItems: "center", gap: "var(--space-xs)", fontSize: "0.85rem", cursor: "pointer" }}>
                    <FiTrash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ position: "sticky", top: "calc(var(--header-height) + var(--space-lg))", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "var(--space-xl)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "var(--space-lg)" }}>Order Summary</h3>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-sm) 0", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            <span>Subtotal ({totalItems} items)</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-sm) 0", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            <span>Shipping</span>
            <span style={{ color: "var(--success)" }}>Free</span>
          </div>
          <div style={{ height: "1px", background: "var(--border)", margin: "var(--space-md) 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-sm) 0", fontSize: "1.15rem", fontWeight: 700 }}>
            <span>Total</span>
            <span style={{ background: "linear-gradient(135deg, var(--secondary), var(--secondary-light))", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>₹{totalPrice.toLocaleString()}</span>
          </div>

          {user ? (
            <Link href="/checkout" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "var(--space-lg)" }}>
              Proceed to Checkout
            </Link>
          ) : (
            <Link href="/auth/signin" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "var(--space-lg)" }}>
              Sign In to Checkout
            </Link>
          )}

          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "var(--space-md)" }}>
            🔒 Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
