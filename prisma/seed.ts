/**
 * seed.ts — Mediva Designs database seeder
 * Run with: npx prisma db seed  (or: npx tsx prisma/seed.ts)
 *
 * Products: 10 real mandala paintings with name, price, category, imageUrl, description, stock
 * Also seeds an admin user for the dashboard.
 */
import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Real mandala painting data ──────────────────────────────────────────────
const PRODUCTS = [
  {
    name: "Sacred Lotus Mandala",
    description:
      "A stunning handcrafted mandala featuring intricate lotus flower patterns in vibrant pink and gold. Each petal is carefully detailed with golden highlights that catch light beautifully. Symbolises purity, enlightenment, and spiritual growth. Painted on 300 GSM premium cold-press cotton canvas with professional-grade acrylic pigments.",
    price: 2999,
    category: "floral",
    stock: 8,
    featured: true,
    dimensions: "12 × 12 inches",
    medium: "Acrylic on canvas",
    tags: JSON.stringify(["lotus", "pink", "gold", "spiritual"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1609619385002-f40f1df9b7eb?w=800&h=800&fit=crop&auto=format",
    ]),
  },
  {
    name: "Geometric Harmony",
    description:
      "A mesmerising geometric mandala exploring the perfect balance of mathematical precision and artistic beauty. Features concentric circles with precise geometric patterns in deep purple and gold tones — a perfect centrepiece for modern living spaces.",
    price: 3499,
    category: "geometric",
    stock: 5,
    featured: true,
    dimensions: "14 × 14 inches",
    medium: "Acrylic on canvas",
    tags: JSON.stringify(["geometric", "purple", "gold", "modern"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&h=800&fit=crop&auto=format",
    ]),
  },
  {
    name: "Spiritual Awakening",
    description:
      "A deeply spiritual mandala combining ancient Sanskrit symbols with contemporary art. Serves as a meditation focal point, featuring the Om symbol at its centre surrounded by radiating energy patterns in warm earth tones. Ideal for yoga studios and meditation rooms.",
    price: 4999,
    category: "spiritual",
    stock: 3,
    featured: true,
    dimensions: "16 × 16 inches",
    medium: "Acrylic & gold leaf on canvas",
    tags: JSON.stringify(["om", "spiritual", "earth tones", "meditation"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=800&fit=crop&auto=format",
    ]),
  },
  {
    name: "Celestial Dream",
    description:
      "Inspired by the night sky, this mandala features constellation-like patterns with a deep indigo background and silver details. Stars and cosmic elements dance around the central mandala, creating a dreamy, otherworldly atmosphere. Perfect for bedrooms.",
    price: 5499,
    category: "spiritual",
    stock: 2,
    featured: true,
    dimensions: "18 × 18 inches",
    medium: "Acrylic & silver metallic on canvas",
    tags: JSON.stringify(["stars", "indigo", "silver", "cosmic"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1596568362037-8769af702e05?w=800&h=800&fit=crop&auto=format",
    ]),
  },
  {
    name: "Modern Fusion Mandala",
    description:
      "Where traditional mandala art meets modern abstract expressionism. Bold splashes of colour interweave with precise geometric patterns, creating a dynamic piece that brings energy and creativity to any room. Uses metallic acrylic accents for a contemporary finish.",
    price: 3999,
    category: "modern",
    stock: 6,
    featured: true,
    dimensions: "14 × 14 inches",
    medium: "Acrylic & metallic ink on canvas",
    tags: JSON.stringify(["abstract", "colorful", "modern", "metallic"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=800&fit=crop&auto=format",
    ]),
  },
  {
    name: "Rose Garden Mandala",
    description:
      "A delicate and romantic mandala covered in detailed rose illustrations. Each rose is carefully painted with soft pink and crimson tones, surrounded by emerald leaves and golden vines. A timeless piece perfect for bedrooms and cosy spaces.",
    price: 2499,
    category: "floral",
    stock: 10,
    featured: false,
    dimensions: "12 × 12 inches",
    medium: "Acrylic on canvas",
    tags: JSON.stringify(["roses", "pink", "romantic", "floral"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=800&fit=crop&auto=format",
    ]),
  },
  {
    name: "Traditional Rajasthani",
    description:
      "A vibrant mandala inspired by traditional Rajasthani art forms. Features rich jewel tones — rubies, emeralds, and sapphires — combined with intricate peacock motifs and paisley patterns. A celebration of Indian artistic heritage.",
    price: 4499,
    category: "traditional",
    stock: 5,
    featured: false,
    dimensions: "16 × 16 inches",
    medium: "Acrylic & pigment ink on canvas",
    tags: JSON.stringify(["rajasthani", "peacock", "jewel tones", "indian"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=800&fit=crop&auto=format",
    ]),
  },
  {
    name: "Zen Circle",
    description:
      "A minimalist mandala inspired by the enso circle of Zen Buddhism. Clean lines and negative space create a sense of calm and completeness. Painted with Japanese ink techniques on premium textured cotton canvas.",
    price: 1999,
    category: "spiritual",
    stock: 12,
    featured: false,
    dimensions: "10 × 10 inches",
    medium: "Ink on textured canvas",
    tags: JSON.stringify(["zen", "minimalist", "black", "ink"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&h=800&fit=crop&auto=format",
    ]),
  },
  {
    name: "Psychedelic Bloom",
    description:
      "An explosion of colour and form — neon pinks, electric blues, and vibrant greens swirl together in intricate spiral patterns that radiate from the centre. Takes inspiration from psychedelic art while maintaining the precision of classical mandala geometry.",
    price: 3299,
    category: "modern",
    stock: 7,
    featured: true,
    dimensions: "14 × 14 inches",
    medium: "Acrylic on canvas",
    tags: JSON.stringify(["neon", "colorful", "psychedelic", "spiral"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&h=800&fit=crop&auto=format",
    ]),
  },
  {
    name: "Golden Sunflower Mandala",
    description:
      "A warm and inviting mandala featuring sunflower-inspired patterns in rich golden and amber tones. The layered petals create depth and dimension, making this a stunning focal point for living rooms and dining areas. Brings sunshine into any space.",
    price: 2799,
    category: "floral",
    stock: 9,
    featured: false,
    dimensions: "12 × 12 inches",
    medium: "Acrylic on canvas",
    tags: JSON.stringify(["sunflower", "golden", "amber", "warm"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=800&fit=crop&auto=format",
    ]),
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Seeding Mediva Designs database...\n");

  // 1. Admin user (idempotent)
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@medivadesigns.shop" },
    update: { password: hashedPassword },
    create: {
      name: "Mediva Admin",
      email: "admin@medivadesigns.shop",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user ready:", admin.email);

  // 2. Products (upsert by name — idempotent)
  for (const product of PRODUCTS) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: product,
      });
      console.log(`🔄 Updated: ${product.name}`);
    } else {
      await prisma.product.create({ data: product });
      console.log(`✅ Created: ${product.name}`);
    }
  }

  const total = await prisma.product.count();
  console.log(`\n🎉 Seeding complete! Total products in DB: ${total}`);
  console.log("📧 Admin login: admin@medivadesigns.shop / admin123");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
