import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://medivadesigns.shop";

  // Static routes are always safe
  const routes = ["", "/shop", "/auth/signin", "/contact", "/about"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    // Dynamic product routes
    const products = await prisma.product.findMany({
      select: { id: true, updatedAt: true },
      take: 100, // Limit for sitemap
    });

    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/shop/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error("Sitemap generation database error:", error);
    // Return only static routes if DB is unreachable during build
    return routes;
  }
}
