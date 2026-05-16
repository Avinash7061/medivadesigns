"use client";

import { useState, useRef } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { FiSave, FiArrowLeft, FiUpload, FiX, FiCheckCircle, FiAlertCircle, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { uploadProductImage } from "@/utils/supabase/storage";

const CATEGORIES = ["geometric", "floral", "spiritual", "modern", "traditional"];

interface EditProductClientProps {
  product: any;
}

export default function EditProductClient({ product }: EditProductClientProps) {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>(product.images || []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    category: product.category,
    stock: product.stock.toString(),
    featured: product.featured,
  });

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const newUrls = [];
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          showToast("error", `${file.name} is too large (max 10MB)`);
          continue;
        }
        const url = await uploadProductImage(file);
        newUrls.push(url);
      }
      setImageUrls((prev) => [...prev, ...newUrls]);
      showToast("success", "Images uploaded successfully!");
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to upload images");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          images: imageUrls,
        }),
      });

      if (res.ok) {
        showToast("success", "Product updated successfully!");
        setTimeout(() => router.push("/admin"), 1000);
      } else {
        showToast("error", "Failed to update product");
      }
    } catch {
      showToast("error", "Network error. Please try again.");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this painting? This cannot be undone.")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("success", "Product deleted successfully");
        router.push("/admin");
      } else {
        showToast("error", "Failed to delete product");
      }
    } catch {
      showToast("error", "Failed to delete product");
    }
    setLoading(false);
  };

  if (authLoading) return <div className="loading-container"><div className="spinner" /></div>;

  const isAdmin = user?.user_metadata?.role === "ADMIN" || user?.app_metadata?.role === "ADMIN" || user?.email === "admin@medivadesigns.shop";
  if (!user || !isAdmin) {
    router.push("/");
    return null;
  }

  return (
    <div className="container" style={{ padding: "var(--space-3xl) var(--space-lg)", maxWidth: "750px", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xl)" }}>
        <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          <FiArrowLeft /> Back to Dashboard
        </Link>
        <button onClick={handleDelete} className="btn btn-secondary" style={{ color: "var(--error)", border: "1px solid var(--error)" }}>
          <FiTrash2 /> Delete
        </button>
      </div>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, marginBottom: "var(--space-xl)" }}>
        Edit Painting
      </h1>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "var(--space-2xl)" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Painting Name *</label>
            <input type="text" className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-input" style={{ minHeight: "130px", resize: "vertical" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-md)" }}>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input type="number" className="form-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="1" />
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
            <label className="form-label">Painting Images *</label>
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              style={{
                border: "2px dashed var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-2xl)",
                textAlign: "center",
                cursor: uploading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                background: "var(--bg-tertiary)",
                opacity: uploading ? 0.6 : 1
              }}
            >
              <FiUpload style={{ fontSize: "2rem", color: "var(--text-muted)", marginBottom: "var(--space-sm)" }} />
              <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-accent)", fontWeight: 500 }}>
                {uploading ? "Uploading..." : "Click to add more photos"}
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleImageUpload}
              disabled={uploading}
            />

            {imageUrls.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "var(--space-sm)", marginTop: "var(--space-md)" }}>
                {imageUrls.map((url, i) => (
                  <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border)" }}>
                    <img src={url} alt={`Upload ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "rgba(239,68,68,0.9)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                      }}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", cursor: "pointer" }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ accentColor: "var(--primary-light)", width: "18px", height: "18px" }} />
              <span style={{ fontFamily: "var(--font-accent)", fontWeight: 500, color: "var(--text-secondary)" }}>Feature on Homepage</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "var(--space-md)" }} disabled={loading || uploading}>
            <FiSave /> {loading ? "Updating..." : "Update Painting"}
          </button>
        </form>
      </div>

      {toast && (
        <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
