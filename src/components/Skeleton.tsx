import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export default function Skeleton({ width, height, borderRadius, className }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className || ""}`}
      style={{
        width: width || "100%",
        height: height || "100%",
        borderRadius: borderRadius || "var(--radius-md)",
      }}
    />
  );
}

export function ProductSkeleton() {
  return (
    <div className={styles["product-skeleton"]}>
      <Skeleton height={280} borderRadius="var(--radius-lg)" />
      <div style={{ padding: "1rem 0" }}>
        <Skeleton width="40%" height={14} borderRadius={4} />
        <div style={{ margin: "0.75rem 0 0.5rem" }}>
          <Skeleton width="80%" height={20} borderRadius={4} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Skeleton width="30%" height={24} borderRadius={4} />
        </div>
      </div>
    </div>
  );
}
