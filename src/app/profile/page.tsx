"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiPackage, FiShield } from "react-icons/fi";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const isAdmin = (session.user as any)?.role === "ADMIN";

  return (
    <div className="container" style={{ padding: "var(--space-3xl) var(--space-lg)", maxWidth: "700px", position: "relative", zIndex: 1 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, marginBottom: "var(--space-xl)" }}>
        My Profile
      </h1>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "var(--space-2xl)", marginBottom: "var(--space-xl)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-lg)", marginBottom: "var(--space-xl)" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--secondary))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-display)", flexShrink: 0 }}>
            {session.user?.image ? (
              <img src={session.user.image} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              session.user?.name?.charAt(0) || "U"
            )}
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 600 }}>
              {session.user?.name || "User"}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{session.user?.email}</p>
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
