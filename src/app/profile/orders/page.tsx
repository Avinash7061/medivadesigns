"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiPackage, FiCalendar, FiCheckCircle, FiClock, FiArrowLeft } from "react-icons/fi";
import Image from "next/image";

export default function UserOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchOrders();
    }
  }, [status]);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  return (
    <div className="container" style={{ padding: "var(--space-3xl) var(--space-lg)", position: "relative", zIndex: 1 }}>
      <Link
        href="/profile"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-sm)",
          color: "var(--text-secondary)",
          marginBottom: "var(--space-xl)",
          fontFamily: "var(--font-accent)",
          fontSize: "0.9rem",
        }}
      >
        <FiArrowLeft /> Back to Profile
      </Link>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, marginBottom: "var(--space-xl)" }}>
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-4xl) 0", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)" }}>
          <FiPackage size={48} style={{ color: "var(--text-muted)", marginBottom: "var(--space-md)" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "var(--space-sm)" }}>No orders yet</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-xl)" }}>When you make a purchase, it will appear here.</p>
          <Link href="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "var(--space-lg)" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "var(--space-lg) var(--space-xl)",
                  background: "var(--bg-tertiary)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "var(--space-md)",
                }}
              >
                <div style={{ display: "flex", gap: "var(--space-xl)", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Order Date</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                      <FiCalendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Total Amount</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--secondary)" }}>₹{order.total.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Status</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "var(--space-xs)", color: order.status === "PAID" ? "var(--success)" : "var(--warning)" }}>
                      {order.status === "PAID" ? <FiCheckCircle size={14} /> : <FiClock size={14} />} {order.status}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  ID: {order.id.slice(0, 8)}...
                </div>
              </div>

              <div style={{ padding: "var(--space-xl)" }}>
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: "var(--space-lg)",
                      padding: "var(--space-md) 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ width: "80px", height: "80px", position: "relative", borderRadius: "var(--radius-md)", overflow: "hidden", flexShrink: 0 }}>
                      <Image
                        src={JSON.parse(item.product.images)[0] || ""}
                        alt={item.product.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: 600, marginBottom: "4px" }}>{item.product.name}</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{item.product.category}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-sm)" }}>
                        <span style={{ fontSize: "0.9rem" }}>Qty: {item.quantity}</span>
                        <span style={{ fontWeight: 600 }}>₹{item.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
