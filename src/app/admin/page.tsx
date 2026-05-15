"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FiPackage, 
  FiShoppingBag, 
  FiDollarSign, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiMail, 
  FiCheckCircle, 
  FiClock, 
  FiUser 
} from "react-icons/fi";
import Image from "next/image";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      if ((session?.user as any)?.role !== "ADMIN") {
        router.push("/");
        return;
      }
      fetchAllData();
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, session]);

  async function fetchAllData() {
    setLoading(true);
    try {
      const [prodRes, orderRes, msgRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/orders"),
        fetch("/api/admin/messages")
      ]);
      
      setProducts(await prodRes.json());
      setOrders(await orderRes.json());
      setMessages(await msgRes.json());
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (err) {
      alert("Failed to delete product");
    }
  }

  async function updateMessageStatus(id: string, newStatus: string) {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
      }
    } catch (err) {
      console.error("Failed to update message status");
    }
  }

  if (status === "loading" || loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  const totalRevenue = orders
    .filter(o => o.status === "PAID")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="container" style={{ padding: "var(--space-3xl) var(--space-lg)", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2xl)", flexWrap: "wrap", gap: "var(--space-md)" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700 }}>Admin Panel</h1>
          <p style={{ color: "var(--text-secondary)" }}>Managing Mediva Designs Business</p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <Link href="/admin/products/new" className="btn btn-primary">
            <FiPlus /> New Product
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-xl)", borderBottom: "1px solid var(--border)", paddingBottom: "1px" }}>
        {[
          { id: "overview", label: "Overview", icon: <FiDollarSign /> },
          { id: "products", label: "Products", icon: <FiPackage /> },
          { id: "orders", label: "Orders", icon: <FiShoppingBag /> },
          { id: "messages", label: "Messages", icon: <FiMail /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-sm)",
              padding: "0.75rem 1.5rem",
              borderBottom: activeTab === tab.id ? "2px solid var(--primary-light)" : "2px solid transparent",
              color: activeTab === tab.id ? "var(--primary-light)" : "var(--text-secondary)",
              fontWeight: activeTab === tab.id ? 600 : 500,
              transition: "all 0.2s",
              fontFamily: "var(--font-accent)",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-lg)" }}>
          {[
            { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <FiDollarSign />, color: "var(--secondary)" },
            { label: "Total Orders", value: orders.length, icon: <FiShoppingBag />, color: "var(--primary-light)" },
            { label: "Inquiries", value: messages.length, icon: <FiMail />, color: "var(--accent)" },
            { label: "Active Products", value: products.length, icon: <FiPackage />, color: "var(--success)" },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: "var(--space-xl)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "var(--space-sm)" }}>
                <span style={{ color: stat.color }}>{stat.icon}</span> {stat.label}
              </div>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-tertiary)" }}>
                  {["Image", "Name", "Category", "Price", "Stock", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ width: "50px", height: "50px", position: "relative", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                        <Image src={p.images?.[0] || ""} alt="" fill style={{ objectFit: "cover" }} />
                      </div>
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: "1rem" }}><span className="badge badge-primary">{p.category}</span></td>
                    <td style={{ padding: "1rem", fontWeight: 600 }}>₹{p.price.toLocaleString()}</td>
                    <td style={{ padding: "1rem" }}>{p.stock}</td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                        <Link href={`/admin/products/${p.id}`} className="btn btn-secondary btn-sm"><FiEdit /></Link>
                        <button onClick={() => deleteProduct(p.id)} className="btn btn-secondary btn-sm" style={{ color: "var(--error)" }}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-tertiary)" }}>
                  {["Order ID", "Customer", "Date", "Total", "Status"].map((h) => (
                    <th key={h} style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>#{o.id.slice(0, 8)}</td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: 500 }}>{o.user.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{o.user.email}</div>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.9rem" }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "1rem", fontWeight: 600 }}>₹{o.total.toLocaleString()}</td>
                    <td style={{ padding: "1rem" }}>
                      <span className={`badge ${o.status === "PAID" ? "badge-success" : "badge-warning"}`} style={{ display: "flex", alignItems: "center", gap: "4px", width: "fit-content" }}>
                        {o.status === "PAID" ? <FiCheckCircle /> : <FiClock />} {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <div style={{ display: "grid", gap: "var(--space-md)" }}>
          {messages.map((m) => (
            <div key={m.id} style={{ padding: "var(--space-xl)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-md)" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-accent)", fontSize: "1.1rem", fontWeight: 600 }}>{m.subject}</h3>
                  <div style={{ display: "flex", gap: "var(--space-md)", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><FiUser /> {m.name}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><FiMail /> {m.email}</span>
                  </div>
                </div>
                <select 
                  value={m.status} 
                  onChange={(e) => updateMessageStatus(m.id, e.target.value)}
                  style={{ padding: "0.4rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-tertiary)", fontSize: "0.85rem" }}
                >
                  <option value="UNREAD">Unread</option>
                  <option value="READ">Read</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>{m.message}</p>
              <div style={{ marginTop: "var(--space-md)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Received on {new Date(m.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
