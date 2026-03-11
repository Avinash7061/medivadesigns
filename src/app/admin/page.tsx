"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPackage, FiShoppingBag, FiDollarSign, FiUsers, FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      if ((session?.user as any)?.role !== "ADMIN") {
        router.push("/");
        return;
      }
      fetchProducts();
    }
  }, [status, session]);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      setProducts(await res.json());
    } catch {}
    setLoading(false);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  }

  if (status === "loading" || loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  const totalValue = products.reduce((sum: number, p: any) => sum + p.price * (p.stock || 0), 0);

  return (
    <div className="container" style={{ padding: "var(--space-3xl) var(--space-lg)", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2xl)" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700 }}>Admin Dashboard</h1>
          <p style={{ color: "var(--text-secondary)" }}>Manage your products and orders</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          <FiPlus /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-lg)", marginBottom: "var(--space-2xl)" }}>
        {[
          { icon: <FiShoppingBag />, label: "Total Products", value: products.length, color: "var(--primary-light)" },
          { icon: <FiPackage />, label: "In Stock", value: products.filter((p: any) => p.stock > 0).length, color: "var(--success)" },
          { icon: <FiDollarSign />, label: "Inventory Value", value: `₹${totalValue.toLocaleString()}`, color: "var(--secondary)" },
          { icon: <FiUsers />, label: "Featured", value: products.filter((p: any) => p.featured).length, color: "var(--accent)" },
        ].map((stat) => (
          <div key={stat.label} style={{ padding: "var(--space-xl)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "var(--space-sm)" }}>
              <span style={{ color: stat.color }}>{stat.icon}</span> {stat.label}
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <div style={{ padding: "var(--space-lg) var(--space-xl)", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "var(--font-accent)", fontWeight: 600 }}>Products</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Image", "Name", "Category", "Price", "Stock", "Featured", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "var(--space-md) var(--space-lg)", textAlign: "left", fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "var(--font-accent)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product: any) => {
                const images = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
                return (
                  <tr key={product.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "var(--space-md) var(--space-lg)" }}>
                      <div style={{ width: "50px", height: "50px", borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--bg-tertiary)" }}>
                        <img src={images?.[0] || ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    </td>
                    <td style={{ padding: "var(--space-md) var(--space-lg)", fontWeight: 500 }}>{product.name}</td>
                    <td style={{ padding: "var(--space-md) var(--space-lg)" }}>
                      <span className="badge badge-primary">{product.category}</span>
                    </td>
                    <td style={{ padding: "var(--space-md) var(--space-lg)", color: "var(--secondary)", fontWeight: 600 }}>₹{product.price.toLocaleString()}</td>
                    <td style={{ padding: "var(--space-md) var(--space-lg)" }}>
                      <span style={{ color: product.stock > 0 ? "var(--success)" : "var(--error)" }}>{product.stock}</span>
                    </td>
                    <td style={{ padding: "var(--space-md) var(--space-lg)" }}>
                      {product.featured ? "⭐" : "—"}
                    </td>
                    <td style={{ padding: "var(--space-md) var(--space-lg)" }}>
                      <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                        <Link href={`/admin/products/${product.id}`} className="btn btn-secondary btn-sm" style={{ padding: "0.35rem 0.75rem" }}>
                          <FiEdit size={14} />
                        </Link>
                        <button className="btn btn-secondary btn-sm" style={{ padding: "0.35rem 0.75rem", color: "var(--error)" }} onClick={() => deleteProduct(product.id)}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
