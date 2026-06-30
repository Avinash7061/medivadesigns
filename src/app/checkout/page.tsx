"use client";

import { useCart } from "@/context/CartContext";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiCreditCard, FiLock, FiShoppingBag, FiTruck, FiShield } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

// Extend Window for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => setError("Failed to load payment gateway. Please refresh.");
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  if (!authLoading && !user) {
    router.push("/auth/signin");
    return null;
  }

  if (!authLoading && items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleCheckout = async () => {
    if (!razorpayLoaded) {
      setError("Payment gateway is still loading. Please wait a moment.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Create Razorpay order on server
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.orderId) {
        throw new Error(data.error || "Failed to create order");
      }

      // Step 2: Open Razorpay checkout popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Mediva Designs",
        description: "Handcrafted Mandala Paintings",
        image: "/logo.png", // optional: your logo
        order_id: data.orderId,
        prefill: {
          name: data.customerName || "",
          email: data.customerEmail || "",
          contact: "",
        },
        theme: {
          color: "#7c3aed", // purple to match your brand
        },
        // Step 3: Handle payment success
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // Verify payment on server
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: data.dbOrderId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(`/checkout/success?payment_id=${response.razorpay_payment_id}`);
            } else {
              setError("Payment verification failed. Please contact us at avinash@medivadesigns.shop");
            }
          } catch {
            setError("Could not verify payment. Please contact us with your payment ID.");
          }
          setLoading(false);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment was cancelled. Your cart is still saved.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const shippingCost = 0; // Free shipping
  const tax = Math.round(totalPrice * 0.18); // 18% GST display

  return (
    <div
      className="container"
      style={{
        padding: "var(--space-3xl) var(--space-lg)",
        maxWidth: "900px",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "var(--space-2xl)" }}>
        <Link
          href="/cart"
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            fontFamily: "var(--font-accent)",
          }}
        >
          ← Back to Cart
        </Link>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 700,
            marginTop: "var(--space-md)",
          }}
        >
          Checkout
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "var(--space-2xl)",
          alignItems: "start",
        }}
      >
        {/* ── LEFT: Order Summary ── */}
        <div>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              marginBottom: "var(--space-lg)",
            }}
          >
            <div
              style={{
                padding: "var(--space-lg) var(--space-xl)",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg-tertiary)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-accent)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--text-muted)",
                }}
              >
                <FiShoppingBag style={{ marginRight: "6px", verticalAlign: "middle" }} />
                Order Summary ({items.length} item{items.length !== 1 ? "s" : ""})
              </span>
            </div>

            <div style={{ padding: "var(--space-md) var(--space-xl)" }}>
              {items.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: "flex",
                    gap: "var(--space-md)",
                    padding: "var(--space-md) 0",
                    borderBottom: "1px solid var(--border)",
                    alignItems: "center",
                  }}
                >
                  {item.product.image && (
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        position: "relative",
                        borderRadius: "var(--radius-md)",
                        overflow: "hidden",
                        flexShrink: 0,
                        border: "1px solid var(--border)",
                      }}
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        marginBottom: "2px",
                      }}
                    >
                      {item.product.name}
                    </div>
                    <div
                      style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                    >
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--secondary)" }}>
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div style={{ paddingTop: "var(--space-md)" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "var(--space-xs) 0",
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                  }}
                >
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "var(--space-xs) 0",
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                  }}
                >
                  <span>Shipping</span>
                  <span style={{ color: "var(--success)" }}>FREE</span>
                </div>
                <div
                  style={{
                    height: "1px",
                    background: "var(--border)",
                    margin: "var(--space-md) 0",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                  }}
                >
                  <span>Total</span>
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg, var(--secondary), var(--secondary-light))",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assurance chips */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--space-sm)",
            }}
          >
            {[
              { icon: <FiTruck />, label: "Free Pan-India Delivery" },
              { icon: <FiShield />, label: "Secure Payment" },
              { icon: "🎨", label: "100% Handcrafted" },
              { icon: "📜", label: "Certificate Included" },
            ].map((f) => (
              <div
                key={f.label}
                style={{
                  padding: "var(--space-sm) var(--space-md)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-sm)",
                  fontSize: "0.78rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span style={{ color: "var(--primary-light)" }}>{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Payment Panel ── */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-2xl)",
            position: "sticky",
            top: "120px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.35rem",
              fontWeight: 700,
              marginBottom: "var(--space-lg)",
            }}
          >
            Pay with Razorpay
          </h2>

          {/* Payment methods */}
          <div
            style={{
              display: "flex",
              gap: "var(--space-sm)",
              flexWrap: "wrap",
              marginBottom: "var(--space-xl)",
            }}
          >
            {["UPI", "Cards", "Net Banking", "Wallets", "EMI"].map((m) => (
              <span
                key={m}
                style={{
                  padding: "0.25rem 0.65rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-accent)",
                  color: "var(--text-secondary)",
                  background: "var(--bg-tertiary)",
                }}
              >
                {m}
              </span>
            ))}
          </div>

          {error && (
            <div
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                color: "var(--error)",
                fontSize: "0.88rem",
                marginBottom: "var(--space-lg)",
                lineHeight: 1.5,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <button
            className="btn btn-primary btn-lg"
            style={{
              width: "100%",
              fontSize: "1.05rem",
              marginBottom: "var(--space-md)",
              background: loading ? "var(--text-muted)" : undefined,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={handleCheckout}
            disabled={loading || !razorpayLoaded}
          >
            <FiCreditCard />
            {loading
              ? "Opening Payment..."
              : `Pay ₹${totalPrice.toLocaleString("en-IN")}`}
          </button>

          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "0.78rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-xs)",
            }}
          >
            <FiLock size={12} /> 256-bit encrypted · Powered by Razorpay
          </p>

          <div
            style={{
              marginTop: "var(--space-lg)",
              padding: "var(--space-md)",
              background: "var(--bg-tertiary)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
            }}
          >
            💡 You'll be redirected to a secure Razorpay popup to complete your payment. 
            Supports UPI, Google Pay, PhonePe, Paytm, all major credit & debit cards, 
            and net banking.
          </div>
        </div>
      </div>
    </div>
  );
}
