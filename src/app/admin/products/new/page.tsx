"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

const CATEGORIES = ["geometric", "floral", "spiritual", "modern", "traditional"];

export default function NewProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "geometric",
    stock: "1",
    featured: false,
    images: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          images: form.images.split("\n").filter(Boolean),
        }),
      });

      if (res.ok) {
        router.push("/admin");
      }
    } catch {}
    setLoading(false);
  };

  return (
    <div className="container" style={{ padding: "var(--space-3xl) var(--space-lg)", maxWidth: "700px", position: "relative", zIndex: 1 }}>
      <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-xl)", fontSize: "0.9rem" }}>
        <FiArrowLeft /> Back to Dashboard
      </Link>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, marginBottom: "var(--space-xl)" }}>
        Add New Product
      </h1>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "var(--space-2xl)" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input type="text" className="form-input" placeholder="e.g. Sacred Lotus Mandala" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" style={{ minHeight: "120px", resize: "vertical" }} placeholder="Describe this painting..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-md)" }}>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input type="number" className="form-input" placeholder="2999" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="1" />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Stock</label>
              <input type="number" className="form-input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} min="0" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URLs (one per line)</label>
            <textarea className="form-input" style={{ minHeight: "80px", resize: "vertical" }} placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", cursor: "pointer" }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ accentColor: "var(--primary-light)" }} />
              <span style={{ fontFamily: "var(--font-accent)", fontWeight: 500, color: "var(--text-secondary)" }}>Mark as Featured</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={loading}>
            <FiSave /> {loading ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
