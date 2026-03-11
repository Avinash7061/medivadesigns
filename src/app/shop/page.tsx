"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import styles from "./shop.module.css";
import { FiSearch } from "react-icons/fi";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  featured: boolean;
  description: string;
}

const CATEGORIES = ["all", "geometric", "floral", "spiritual", "modern", "traditional"];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  // Debounce search to avoid excessive API calls
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(
    async (searchTerm: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== "all") params.set("category", category);
        if (searchTerm) params.set("search", searchTerm);
        if (sort === "price-asc") params.set("sort", "price-asc");
        else if (sort === "price-desc") params.set("sort", "price-desc");
        else if (sort === "name") params.set("sort", "name");

        const res = await fetch(`/api/products?${params}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [category, sort]
  );

  // Fetch when category or sort changes immediately
  useEffect(() => {
    fetchProducts(search);
  }, [category, sort, fetchProducts]);

  // Debounce search input: wait 400ms after user stops typing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      fetchProducts(value);
    }, 400);
  };

  return (
    <>
      <div className={styles["shop-header"]}>
        <h1 className={styles["shop-title"]}>Our Collection</h1>
        <p className={styles["shop-count"]}>
          {products.length} {products.length === 1 ? "painting" : "paintings"} found
        </p>
      </div>

      <div className={styles["shop-controls"]}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <FiSearch style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search paintings..."
            className={styles["shop-search"]}
            style={{ paddingLeft: "2.5rem" }}
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className={styles["shop-filters"]}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles["filter-btn"]} ${category === cat ? styles["filter-btn-active"] : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <select
          className={styles["shop-sort"]}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
        </div>
      ) : products.length === 0 ? (
        <div className={styles["shop-empty"]}>
          <h3>No paintings found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-xl)" }}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.images[0] || "https://images.unsplash.com/photo-1609619385002-f40f1df9b7eb?w=400&h=400&fit=crop"}
              category={product.category}
              stock={product.stock}
              featured={product.featured}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function ShopPage() {
  return (
    <div className={`container ${styles["shop-page"]}`}>
      <Suspense fallback={<div className="loading-container"><div className="spinner" /></div>}>
        <ShopContent />
      </Suspense>
    </div>
  );
}
