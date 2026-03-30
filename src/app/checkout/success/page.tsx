"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FiCheckCircle, FiPackage } from "react-icons/fi";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared) {
      clearCart();
      setCleared(true);
    }
  }, [cleared, clearCart]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - var(--header-height))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-xl)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "500px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-3xl)",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto var(--space-xl)",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(5, 150, 105, 0.04))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            color: "var(--success)",
          }}
        >
          <FiCheckCircle />
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "var(--space-md)",
          }}
        >
          Order Confirmed!
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            marginBottom: "var(--space-xl)",
          }}
        >
          Thank you for your purchase! Your beautiful mandala painting is on its way.
          You will receive an email confirmation shortly.
        </p>

        <div
          style={{
            padding: "var(--space-lg)",
            background: "var(--bg-tertiary)",
            borderRadius: "var(--radius-md)",
            marginBottom: "var(--space-xl)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-md)",
            justifyContent: "center",
            color: "var(--text-secondary)",
          }}
        >
          <FiPackage />
          <span>Estimated delivery: 5-7 business days</span>
        </div>

        <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "center" }}>
          <Link href="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
          <Link href="/profile/orders" className="btn btn-secondary">
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
