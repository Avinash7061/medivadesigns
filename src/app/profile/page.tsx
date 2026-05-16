"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiPackage, FiShield } from "react-icons/fi";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  if (authLoading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  const isAdmin = user.app_metadata?.role === "ADMIN";

  return (
    <div className="container" style={{ padding: "var(--space-3xl) var(--space-lg)", maxWidth: "700px", position: "relative", zIndex: 1 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, marginBottom: "var(--space-xl)" }}>
        My Profile
      </h1>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "var(--space-2xl)", marginBottom: "var(--space-xl)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-lg)", marginBottom: "var(--space-xl)" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--secondary))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-display)", flexShrink: 0 }}>
            {user.user_metadata?.avatar_url || user.user_metadata?.image ? (
              <img src={user.user_metadata?.avatar_url || user.user_metadata?.image} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"
            )}
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 600 }}>
              {user.user_metadata?.full_name || user.email?.split("@")[0]}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{user.email}</p>
            {isAdmin && <span className="badge badge-gold" style={{ marginTop: "var(--space-xs)" }}>Admin</span>}
          </div>
        </div>

        <div style={{ display: "grid", gap: "var(--space-sm)" }}>
          <Link href="/profile/orders" style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", padding: "var(--space-md) var(--space-lg)", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", color: "var(--text-secondary)", transition: "all 0.2s" }}>
            <FiPackage /> My Orders
          </Link>
          {isAdmin && (
            <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", padding: "var(--space-md) var(--space-lg)", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", color: "var(--text-secondary)", transition: "all 0.2s" }}>
              <FiShield /> Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
