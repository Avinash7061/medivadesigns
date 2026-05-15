import { Suspense } from "react";
import prisma from "@/lib/prisma";
import ShopClient from "./ShopClient";
import styles from "./shop.module.css";
import { ProductSkeleton } from "@/components/Skeleton";

// This makes the page dynamically rendered or revalidated
export const revalidate = 3600; // Revalidate every hour

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Parse images JSON string
    return products.map((p) => {
      let images: string[] = [];
      try {
        images = JSON.parse(p.images);
      } catch {
        images = [];
      }
      return { ...p, images };
    });
  } catch (error) {
    console.error("Failed to fetch products for shop:", error);
    // Return empty array if DB is unreachable during build
    return [];
  }
}

function ShopLoading() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-xl)", marginTop: "var(--space-2xl)" }}>
      {[...Array(8)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className={`container ${styles["shop-page"]}`}>
      <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 700 }}>Our Collection</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-sm)" }}>Explore our handcrafted mandala paintings</p>
      </div>
      
      <Suspense fallback={<ShopLoading />}>
        <ShopClient initialProducts={products} />
      </Suspense>
    </div>
  );
}
