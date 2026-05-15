"use client";

import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <section style={{ padding: "var(--space-4xl) 0", textAlign: "center" }}>
        <div className="container">
          <span className="badge badge-primary" style={{ marginBottom: "var(--space-lg)", display: "inline-flex" }}>
            Get In Touch
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, marginBottom: "var(--space-md)" }}>
            Contact Us
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Have questions about our paintings, custom orders, or shipping? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: "var(--space-4xl)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-3xl)", alignItems: "start" }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "var(--space-xl)" }}>
                Let&apos;s Connect
              </h2>
              {[
                { icon: <FiMail />, label: "Email", value: "hello@medivadesigns.shop" },
                { icon: <FiPhone />, label: "Phone", value: "+91 98765 43210" },
                { icon: <FiMapPin />, label: "Studio", value: "Mumbai, Maharashtra, India" },
              ].map((info) => (
                <div
                  key={info.label}
                  style={{
                    display: "flex",
                    gap: "var(--space-md)",
                    padding: "var(--space-lg)",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "var(--space-md)",
                  }}
                >
                  <div style={{ width: "44px", height: "44px", borderRadius: "var(--radius-md)", background: "linear-gradient(135deg, var(--primary), var(--primary-light))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                    {info.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "var(--font-accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{info.label}</div>
                    <div style={{ fontWeight: 500 }}>{info.value}</div>
                  </div>
                </div>
              ))}

              <div style={{ padding: "var(--space-xl)", background: "linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(198, 125, 59, 0.05))", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", marginTop: "var(--space-xl)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "var(--space-sm)" }}>Custom Orders</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  Want a personalized mandala painting? We offer custom designs tailored to your preferences. Reach out to discuss your vision.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "var(--space-2xl)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "var(--space-xl)" }}>
                Send a Message
              </h2>

              {sent && (
                <div style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(5, 150, 105, 0.08)", border: "1px solid rgba(5, 150, 105, 0.2)", color: "var(--success)", fontSize: "0.9rem", marginBottom: "var(--space-lg)" }}>
                  ✓ Message sent! We&apos;ll get back to you soon.
                </div>
              )}

              {error && (
                <div style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(220, 38, 38, 0.08)", border: "1px solid rgba(220, 38, 38, 0.2)", color: "var(--error)", fontSize: "0.9rem", marginBottom: "var(--space-lg)" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-input" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required disabled={loading} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required disabled={loading} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input type="text" className="form-input" placeholder="What's this about?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required disabled={loading} />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-input" style={{ minHeight: "150px", resize: "vertical" }} placeholder="Tell us more..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required disabled={loading} />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", opacity: loading ? 0.7 : 1 }} disabled={loading}>
                  {loading ? <div className="spinner" style={{ width: "20px", height: "20px" }} /> : <><FiSend /> Send Message</>}
                </button>
              </form>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
