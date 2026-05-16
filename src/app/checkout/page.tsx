"use client";

import { useCart } from "@/context/CartContext";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiCreditCard, FiLock } from "react-icons/fi";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!authLoading && !user) {
    router.push("/auth/signin");
    return null;
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Checkout failed. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "var(--space-3xl) var(--space-lg)", maxWidth: "600px", position: "relative", zIndex: 1 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, marginBottom: "var(--space-xl)", textAlign: "center" }}>
        Checkout
      </h1>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
        <h3 style={{ fontFamily: "var(--font-accent)", fontWeight: 600, marginBottom: "var(--space-lg)", color: "var(--text-secondary)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Order Summary
        </h3>
        {items.map((item) => (
          <div key={item.product.id} style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-sm) 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text-secondary)" }}>
              {item.product.name} × {item.quantity}
            </span>
            <span style={{ fontWeight: 600 }}>₹{(item.product.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-sm) 0", color: "var(--text-secondary)" }}>
          <span>Shipping</span>
          <span style={{ color: "var(--success)" }}>Free</span>
        </div>
        <div style={{ height: "1px", background: "var(--border)", margin: "var(--space-md) 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 700 }}>
          <span>Total</span>
          <span style={{ color: "var(--secondary)" }}>₹{totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {error && (
        <div style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "var(--error)", fontSize: "0.9rem", marginBottom: "var(--space-lg)" }}>
          {error}
        </div>
      )}

      <button className="btn btn-gold btn-lg" style={{ width: "100%" }} onClick={handleCheckout} disabled={loading}>
        <FiCreditCard />
        {loading ? "Redirecting to Stripe..." : `Pay ₹${totalPrice.toLocaleString()}`}
      </button>
      <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "var(--space-md)", display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-xs)" }}>
        <FiLock /> Secure payment powered by Stripe
      </p>
    </div>
  );
}
