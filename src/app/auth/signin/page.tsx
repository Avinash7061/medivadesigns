"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { createClient } from "@/utils/supabase/client";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) {
      if (urlError === "OAuthSignin") setError("Could not start Google sign in. Try again.");
      else if (urlError === "OAuthCallback") setError("Google sign in failed. Database connection error.");
      else setError("An unexpected error occurred. Please try again.");
    }
  }, [searchParams]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Failed to connect to the server.");
      setLoading(false);
    }
  };

  return (
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
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "var(--space-sm)",
          }}
        >
          Welcome Back
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Sign in to your Mediva Designs account
        </p>
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
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
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          marginBottom: "var(--space-xl)",
          opacity: loading ? 0.7 : 1,
        }}
      >
        <FcGoogle size={20} />
        Continue with Google
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-md)",
          marginBottom: "var(--space-xl)",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontFamily: "var(--font-accent)" }}>
          or sign in with email
        </span>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      </div>

      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "var(--error)",
            fontSize: "0.9rem",
            marginBottom: "var(--space-lg)",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <div style={{ position: "relative" }}>
            <FiMail
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="email"
              className="form-input"
              style={{ paddingLeft: "2.5rem" }}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: "relative" }}>
            <FiLock
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="password"
              className="form-input"
              style={{ paddingLeft: "2.5rem" }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: "100%", marginTop: "var(--space-md)" }}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
          <FiArrowRight />
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          color: "var(--text-secondary)",
          marginTop: "var(--space-xl)",
          fontSize: "0.9rem",
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          style={{ color: "var(--primary-light)", fontWeight: 600 }}
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
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
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
