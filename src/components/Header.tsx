"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { FiShoppingBag, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiSettings } from "react-icons/fi";
import styles from "./Header.module.css";

export default function Header() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles["header-scrolled"] : ""}`}>
        <div className={styles["header-inner"]}>
          <Link href="/" className={styles["header-logo"]}>
            <span className={styles["header-logo-icon"]}>✦</span>
            Mediva Designs
          </Link>

          <nav className={styles["header-nav"]}>
            <Link href="/" className={styles["header-nav-link"]}>Home</Link>
            <Link href="/shop" className={styles["header-nav-link"]}>Shop</Link>
            <Link href="/about" className={styles["header-nav-link"]}>About</Link>
            <Link href="/contact" className={styles["header-nav-link"]}>Contact</Link>
          </nav>

          <div className={styles["header-actions"]}>
            <Link href="/cart" className={styles["header-cart-btn"]}>
              <FiShoppingBag />
              {totalItems > 0 && (
                <span className={styles["header-cart-count"]}>{totalItems}</span>
              )}
            </Link>

            {session ? (
              <div ref={menuRef} style={{ position: "relative" }}>
                <button
                  className={styles["header-user-btn"]}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className={styles["header-avatar"]}
                    />
                  ) : (
                    <FiUser />
                  )}
                  <span>{session.user?.name?.split(" ")[0] || "Account"}</span>
                </button>

                {menuOpen && (
                  <div className={styles["header-menu-dropdown"]}>
                    <Link href="/profile" className={styles["header-menu-item"]} onClick={() => setMenuOpen(false)}>
                      <FiUser /> Profile
                    </Link>
                    <Link href="/profile/orders" className={styles["header-menu-item"]} onClick={() => setMenuOpen(false)}>
                      <FiPackage /> Orders
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className={styles["header-menu-item"]} onClick={() => setMenuOpen(false)}>
                        <FiSettings /> Admin
                      </Link>
                    )}
                    <div className={styles["header-menu-divider"]} />
                    <button
                      className={styles["header-menu-item"]}
                      onClick={() => signOut()}
                    >
                      <FiLogOut /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin" className="btn btn-primary btn-sm">
                Sign In
              </Link>
            )}

            <button
              className={styles["header-mobile-toggle"]}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`${styles["header-mobile-menu"]} ${mobileOpen ? styles.open : ""}`}>
        <Link href="/" className={styles["header-mobile-link"]} onClick={() => setMobileOpen(false)}>Home</Link>
        <Link href="/shop" className={styles["header-mobile-link"]} onClick={() => setMobileOpen(false)}>Shop</Link>
        <Link href="/about" className={styles["header-mobile-link"]} onClick={() => setMobileOpen(false)}>About</Link>
        <Link href="/contact" className={styles["header-mobile-link"]} onClick={() => setMobileOpen(false)}>Contact</Link>
        {!session && (
          <Link href="/auth/signin" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Sign In</Link>
        )}
      </div>
    </>
  );
}
