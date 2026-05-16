export function parseProductImages(images: unknown): string[] {
  if (Array.isArray(images)) {
    return images.filter((image): image is string => typeof image === "string");
  }

  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed)
        ? parsed.filter((image): image is string => typeof image === "string")
        : [];
    } catch {
      return [];
    }
  }

  return [];
}

export function normalizeProductImages<T extends { images?: unknown }>(product: T) {
  return { ...product, images: parseProductImages(product.images) };
}
