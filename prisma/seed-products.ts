/**
 * Seed script for Mediva Designs actual products
 * Run: npx tsx prisma/seed-products.ts
 *
 * INSTRUCTIONS:
 * 1. First upload your images via /admin/products/new
 * 2. Replace the imageUrl below with the actual Supabase Storage URL
 * 3. Then run this script OR just add via the Admin Panel directly
 */

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const products = [
  {
    name: "Sunburst Fan Mandala",
    description:
      "A striking quarter-circle fan mandala hand-drawn in fine black ink. Alternating bright yellow and white sunburst stripes radiate outward, creating a bold, energetic composition that brings warmth and vibrancy to any space.",
    price: 2999,
    category: "geometric",
    stock: 1,
    featured: true,
    dimensions: "12 x 12 inches",
    medium: "Ink on Cartridge Paper",
    tags: ["fan mandala", "sunburst", "geometric", "yellow", "wall art"],
    images: [], // Replace with actual Supabase URL after upload
  },
  {
    name: "Purple Radiance Mandala",
    description:
      "An incredibly intricate fully concentric circular mandala drawn in bold black ink, set against a breathtaking background of deep purple and white rays radiating from the core. Meditative, precise, and deeply calming.",
    price: 3499,
    category: "spiritual",
    stock: 1,
    featured: true,
    dimensions: "14 x 14 inches",
    medium: "Ink on Cartridge Paper",
    tags: ["circular mandala", "purple", "concentric", "spiritual", "meditation"],
    images: [],
  },
  {
    name: "Sacred Peacock",
    description:
      "A majestic hand-drawn peacock standing on a decorative patterned base. Every feather, wing and body part is adorned with fine mandala-inspired lines, grids, and circular motifs — a true symbol of beauty, grace, and spiritual protection.",
    price: 3999,
    category: "traditional",
    stock: 1,
    featured: false,
    dimensions: "10 x 14 inches",
    medium: "Ink on Cartridge Paper",
    tags: ["peacock", "bird art", "traditional", "mandala texture", "black ink"],
    images: [],
  },
  {
    name: "Maroon Half-Moon Mandala",
    description:
      "A large, serene semi-circular mandala rendered in warm brownish-red ink. Multiple concentric layers of delicate patterns, cross-hatching, and spiral fans create a meditative quality, perfect for bringing earthy warmth to a room.",
    price: 2799,
    category: "geometric",
    stock: 1,
    featured: false,
    dimensions: "12 x 8 inches",
    medium: "Ink on Cartridge Paper",
    tags: ["half moon", "semi-circle", "maroon", "geometric", "earthy"],
    images: [],
  },
  {
    name: "Goddess Durga Mandala",
    description:
      "The powerful face of Goddess Durga rendered in bold black strokes at the centre of a mandala, surrounded by intricate concentric rings of fine geometric grid patterns, leaf shapes, and cross-hatching. A deeply spiritual and commanding piece.",
    price: 4999,
    category: "spiritual",
    stock: 1,
    featured: true,
    dimensions: "14 x 14 inches",
    medium: "Ink on Cartridge Paper",
    tags: ["goddess", "durga", "spiritual", "deity", "sacred art", "mandala"],
    images: [],
  },
  {
    name: "Golden Bloom Mandala",
    description:
      "A circular mandala with a blooming pink floral core, surrounded by golden-yellow scale-like geometric mesh layers. Framed by decorative pink horizontal borders, this vibrant and cheerful piece is guaranteed to brighten any wall.",
    price: 3299,
    category: "floral",
    stock: 1,
    featured: false,
    dimensions: "12 x 12 inches",
    medium: "Ink & Watercolor on Cartridge Paper",
    tags: ["floral", "golden", "pink", "bloom", "colorful", "mandala"],
    images: [],
  },
  {
    name: "Crimson Celestial Mandala",
    description:
      "A highly detailed and densely layered circular mandala with a star-burst flower center. Alternating deep red, orange, and brown patterns, grids, loops, and petal divisions create a rich, warm composition full of life and energy.",
    price: 3799,
    category: "geometric",
    stock: 1,
    featured: false,
    dimensions: "14 x 14 inches",
    medium: "Ink & Watercolor on Cartridge Paper",
    tags: ["crimson", "red", "starburst", "geometric", "dense", "mandala"],
    images: [],
  },
  {
    name: "Ocean Star Mandala",
    description:
      "A stunning 16-pointed star mandala rendered in shades of light blue, deep blue, and black ink. Each petal is filled with intricate detailing — loops, dots, and organic leaf motifs — evoking the calm, depth and clarity of the ocean.",
    price: 3599,
    category: "modern",
    stock: 1,
    featured: true,
    dimensions: "12 x 12 inches",
    medium: "Ink & Watercolor on Cartridge Paper",
    tags: ["ocean", "blue", "star", "modern", "calming", "mandala"],
    images: [],
  },
  {
    name: "Triangle & Moon Duality",
    description:
      "A unique split composition: the top half is a large triangle filled with intricate black ink geometric patterns, concentric triangles, and spirals. The bottom half is a semi-circular mandala in warm golden-brown ink with delicate floral lace textures. A symbol of balance between the earthly and the divine.",
    price: 4499,
    category: "modern",
    stock: 1,
    featured: false,
    dimensions: "10 x 14 inches",
    medium: "Ink on Cartridge Paper",
    tags: ["triangle", "duality", "geometric", "modern", "golden", "mixed"],
    images: [],
  },
];

async function main() {
  console.log("🎨 Seeding Mediva Designs products...\n");

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        stock: p.stock,
        featured: p.featured,
        dimensions: p.dimensions,
        medium: p.medium,
        tags: JSON.stringify(p.tags),
        images: JSON.stringify(p.images),
      },
    });
    console.log(`✅ Created: ${product.name} (₹${product.price})`);
  }

  console.log("\n🚀 All 9 products seeded successfully!");
  console.log("📸 Now go to /admin to upload photos for each product.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
