"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import styles from "./shop.module.css";
import { FiSearch } from "react-icons/fi";

const CATEGORIES = ["all", "geometric", "floral", "spiritual", "modern", "traditional"];

interface ShopClientProps {
  initialProducts: any[];
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  // Client-side filtering and sorting
  const filtered = initialProducts
    .filter((p) => {
      const matchesSearch = 
        (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || p.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <>
      <div className={styles["shop-header"]}>
        <h1 className={styles["shop-title"]}>Our Collection</h1>
        <p className={styles["shop-count"]}>
          {filtered.length} {filtered.length === 1 ? "painting" : "paintings"} found
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
            onChange={(e) => setSearch(e.target.value)}
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

      {filtered.length === 0 ? (
        <div className={styles["shop-empty"]}>
          <h3>No paintings found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-xl)" }}>
          {filtered.map((product: any) => (
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
