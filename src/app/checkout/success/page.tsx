"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { FiCheckCircle, FiPackage } from "react-icons/fi";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");

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
          maxWidth: "520px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-3xl)",
        }}
      >
        {/* Animated check */}
        <div
          style={{
            width: "90px",
            height: "90px",
            margin: "0 auto var(--space-xl)",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(5, 150, 105, 0.15), rgba(5, 150, 105, 0.05))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.8rem",
            color: "var(--success)",
            border: "2px solid rgba(5, 150, 105, 0.2)",
          }}
        >
          <FiCheckCircle />
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2.2rem",
            fontWeight: 700,
            marginBottom: "var(--space-md)",
          }}
        >
          Payment Successful! 🎉
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            marginBottom: "var(--space-lg)",
          }}
        >
          Thank you for your purchase! Your beautiful mandala painting is being
          carefully packed and will be on its way soon.
        </p>

        {/* Payment ID */}
        {paymentId && (
          <div
            style={{
              padding: "var(--space-md) var(--space-lg)",
              background: "var(--bg-tertiary)",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--space-lg)",
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              fontFamily: "monospace",
            }}
          >
            Payment ID: <strong style={{ color: "var(--text-primary)" }}>{paymentId}</strong>
          </div>
        )}

        {/* Delivery info */}
        <div
          style={{
            padding: "var(--space-lg)",
            background: "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(139,92,246,0.02))",
            border: "1px solid rgba(139,92,246,0.15)",
            borderRadius: "var(--radius-md)",
            marginBottom: "var(--space-xl)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-md)",
            justifyContent: "center",
            color: "var(--text-secondary)",
          }}
        >
          <FiPackage style={{ color: "var(--primary-light)", fontSize: "1.3rem", flexShrink: 0 }} />
          <span style={{ textAlign: "left", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--text-primary)", display: "block" }}>
              Estimated Delivery: 5–7 business days
            </strong>
            We'll send tracking details to your registered email.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "var(--space-md)",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
          <Link href="/profile/orders" className="btn btn-secondary">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="loading-container"><div className="spinner" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
