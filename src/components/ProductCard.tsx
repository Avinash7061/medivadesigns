"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  featured?: boolean;
}

export default function ProductCard({ id, name, price, image, category, stock, featured }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, image, category }, 1);
  };

  return (
    <Link href={`/shop/${id}`} className={styles["product-card"]}>
      <div className={styles["product-image-wrap"]}>
        <img src={image} alt={name} className={styles["product-image"]} />
        {featured && (
          <span className={`badge badge-gold ${styles["product-badge"]}`}>Featured</span>
        )}
        <div className={styles["product-overlay"]}>
          <button
            className={`btn btn-primary ${styles["product-overlay-btn"]}`}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
      <div className={styles["product-info"]}>
        <p className={styles["product-category"]}>{category}</p>
        <h3 className={styles["product-name"]}>{name}</h3>
        <div className={styles["product-price-row"]}>
          <span className={styles["product-price"]}>₹{price.toLocaleString()}</span>
          {stock <= 3 && stock > 0 && (
            <span className={`${styles["product-stock"]} ${styles["product-stock-low"]}`}>
              Only {stock} left
            </span>
          )}
          {stock === 0 && (
            <span className={styles["product-stock"]} style={{ color: "var(--error)" }}>
              Sold Out
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
