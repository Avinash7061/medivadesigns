import { MetadataRoute } from "next";

// Force dynamic rendering so sitemap is generated at request time, not build time
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://medivadesigns.shop";

  // Static routes
  const routes = ["", "/shop", "/about", "/contact", "/auth/signin"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic product routes — fetched at request time, not build time
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const products = await prisma.product.findMany({
      select: { id: true, updatedAt: true },
    });

    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/shop/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...routes, ...productRoutes];
  } catch {
    // If DB is unreachable (e.g. during build), return static routes only
    return routes;
  }
}
