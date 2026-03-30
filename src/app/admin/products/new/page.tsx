"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiSave, FiArrowLeft, FiUpload, FiX, FiImage, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import Link from "next/link";

const CATEGORIES = ["geometric", "floral", "spiritual", "modern", "traditional"];

export default function NewProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "geometric",
    stock: "1",
    featured: false,
  });

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showToast("error", `${file.name} is too large (max 5MB)`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setImagePreviews((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price) {
      showToast("error", "Please fill in all required fields");
      return;
    }

    if (imagePreviews.length === 0) {
      showToast("error", "Please add at least one image");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          images: imagePreviews,
        }),
      });

      if (res.ok) {
        showToast("success", "Product created successfully!");
        setTimeout(() => router.push("/admin"), 1000);
      } else {
        showToast("error", "Failed to create product");
      }
    } catch {
      showToast("error", "Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ padding: "var(--space-3xl) var(--space-lg)", maxWidth: "750px", position: "relative", zIndex: 1 }}>
      <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-xl)", fontSize: "0.9rem" }}>
        <FiArrowLeft /> Back to Dashboard
      </Link>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, marginBottom: "var(--space-xl)" }}>
        Add New Product
      </h1>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "var(--space-2xl)" }}>
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input type="text" className="form-input" placeholder="e.g. Sacred Lotus Mandala" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-input" style={{ minHeight: "130px", resize: "vertical" }} placeholder="Describe this painting in detail — materials, size, techniques, inspiration..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>

          {/* Price / Category / Stock row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-md)" }}>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
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

          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Product Images *</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-2xl)",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                background: "var(--bg-tertiary)",
              }}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--primary-light)"; }}
              onDragLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "var(--border)";
                const files = Array.from(e.dataTransfer.files);
                const input = fileInputRef.current;
                if (input) {
                  const dt = new DataTransfer();
                  files.forEach((f) => dt.items.add(f));
                  input.files = dt.files;
                  input.dispatchEvent(new Event("change", { bubbles: true }));
                }
              }}
            >
              <FiUpload style={{ fontSize: "2rem", color: "var(--text-muted)", marginBottom: "var(--space-sm)" }} />
              <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-accent)", fontWeight: 500 }}>
                Click to upload or drag and drop
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "var(--space-xs)" }}>
                PNG, JPG or WebP up to 5MB each
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "var(--space-sm)", marginTop: "var(--space-md)" }}>
                {imagePreviews.map((src, i) => (
                  <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border)" }}>
                    <img src={src} alt={`Preview ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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

          {/* Featured checkbox */}
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", cursor: "pointer" }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ accentColor: "var(--primary-light)", width: "18px", height: "18px" }} />
              <span style={{ fontFamily: "var(--font-accent)", fontWeight: 500, color: "var(--text-secondary)" }}>Mark as Featured</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "var(--space-md)" }} disabled={loading}>
            <FiSave /> {loading ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
