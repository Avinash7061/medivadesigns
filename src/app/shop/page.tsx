import { Suspense } from "react";
import prisma from "@/lib/prisma";
import ShopClient from "./ShopClient";
import styles from "./shop.module.css";
import { ProductSkeleton } from "@/components/Skeleton";

// Render at request time, not build time (DB not available during build)
export const dynamic = "force-dynamic";

async function getProducts() {
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
      <Suspense fallback={<ShopLoading />}>
        <ShopClient initialProducts={products} />
      </Suspense>
    </div>
  );
}

