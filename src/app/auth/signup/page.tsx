"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto sign in after registration
      await signIn("credentials", { email, password, redirect: false });
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

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
          width: "100%",
          maxWidth: "440px",
          background: "var(--bg-card)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-3xl)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, marginBottom: "var(--space-sm)" }}>
            Create Account
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Join our community of art lovers
          </p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          style={{
            width: "100%",
            padding: "0.85rem",
            borderRadius: "var(--radius-md)",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            fontSize: "0.95rem",
            fontFamily: "var(--font-accent)",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-sm)",
            cursor: "pointer",
            marginBottom: "var(--space-xl)",
          }}
        >
          <FcGoogle size={20} />
          Sign up with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        {error && (
          <div style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "var(--error)", fontSize: "0.9rem", marginBottom: "var(--space-lg)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: "relative" }}>
              <FiUser style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input type="text" className="form-input" style={{ paddingLeft: "2.5rem" }} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: "relative" }}>
              <FiMail style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input type="email" className="form-input" style={{ paddingLeft: "2.5rem" }} placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <FiLock style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input type="password" className="form-input" style={{ paddingLeft: "2.5rem" }} placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "var(--space-md)" }} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
            <FiArrowRight />
          </button>
        </form>

        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "var(--space-xl)", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link href="/auth/signin" style={{ color: "var(--primary-light)", fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
