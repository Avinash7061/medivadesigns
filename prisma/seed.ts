import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const MANDALA_IMAGES = [
  "https://images.unsplash.com/photo-1609619385002-f40f1df9b7eb?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1596568362037-8769af702e05?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=600&h=600&fit=crop",
];

const PRODUCTS = [
  {
    name: "Sacred Lotus Mandala",
    description: "A stunning handcrafted mandala featuring intricate lotus flower patterns. This piece represents purity, enlightenment, and spiritual growth. Painted on premium canvas with vibrant, fade-resistant colors. Each petal is carefully detailed with golden highlights that catch the light beautifully.",
    price: 2999,
    category: "floral",
    stock: 8,
    featured: true,
  },
  {
    name: "Geometric Harmony",
    description: "A mesmerizing geometric mandala that explores the perfect balance of mathematical precision and artistic beauty. Features concentric circles with precise geometric patterns in deep purple and gold tones. A perfect centerpiece for modern living spaces.",
    price: 3499,
    category: "geometric",
    stock: 5,
    featured: true,
  },
  {
    name: "Spiritual Awakening",
    description: "A deeply spiritual mandala that combines ancient Sanskrit symbols with contemporary art. This painting serves as a meditation focal point, featuring the Om symbol at its center surrounded by radiating energy patterns in warm earth tones.",
    price: 4999,
    category: "spiritual",
    stock: 3,
    featured: true,
  },
  {
    name: "Modern Fusion",
    description: "Where traditional mandala art meets modern abstract expressionism. Bold splashes of color interweave with precise geometric patterns, creating a dynamic piece that brings energy and creativity to any room. Uses metallic accents for a contemporary finish.",
    price: 3999,
    category: "modern",
    stock: 6,
    featured: true,
  },
  {
    name: "Celestial Dream",
    description: "Inspired by the night sky, this mandala features constellation-like patterns with deep indigo backgrounds and silver details. Stars and cosmic elements dance around the central mandala, creating a dreamy, otherworldly atmosphere.",
    price: 5499,
    category: "spiritual",
    stock: 2,
    featured: true,
  },
  {
    name: "Rose Garden Mandala",
    description: "A delicate and romantic mandala covered in detailed rose illustrations. Each rose is carefully painted with soft pink and crimson tones, surrounded by emerald leaves and golden vines. Perfect for bedrooms and cozy spaces.",
    price: 2499,
    category: "floral",
    stock: 10,
    featured: false,
  },
  {
    name: "Infinite Symmetry",
    description: "A hypnotic geometric mandala that plays with optical illusions. The intricate patterns seem to pulse and rotate when you gaze at them, creating a meditative experience. Rendered in monochromatic tones with subtle metallic accents.",
    price: 3799,
    category: "geometric",
    stock: 4,
    featured: true,
  },
  {
    name: "Traditional Rajasthani",
    description: "A vibrant mandala inspired by traditional Rajasthani art forms. Features rich jewel tones — rubies, emeralds, and sapphires — combined with intricate peacock motifs and paisley patterns. A celebration of Indian artistic heritage.",
    price: 4499,
    category: "traditional",
    stock: 5,
    featured: false,
  },
  {
    name: "Zen Circle",
    description: "A minimalist mandala inspired by the enso circle of Zen Buddhism. Clean lines and negative space create a sense of calm and completeness. Painted with Japanese ink techniques on premium textured canvas.",
    price: 1999,
    category: "spiritual",
    stock: 12,
    featured: false,
  },
  {
    name: "Psychedelic Bloom",
    description: "An explosion of color and form, this modern mandala takes inspiration from psychedelic art. Neon pinks, electric blues, and vibrant greens swirl together in intricate spiral patterns that radiate from the center.",
    price: 3299,
    category: "modern",
    stock: 7,
    featured: true,
  },
  {
    name: "Golden Sunflower",
    description: "A warm and inviting mandala featuring sunflower-inspired patterns in rich golden and amber tones. The layered petals create depth and dimension, making this piece a stunning focal point for living rooms and dining areas.",
    price: 2799,
    category: "floral",
    stock: 9,
    featured: false,
  },
  {
    name: "Fractal Universe",
    description: "A complex geometric mandala inspired by mathematical fractals. Each zoom level reveals new details and patterns, making this painting an endless journey of discovery. Created with precision tools and vibrant acrylic paints.",
    price: 5999,
    category: "geometric",
    stock: 1,
    featured: false,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@medivadesigns.shop" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@medivadesigns.shop",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create products
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    await prisma.product.create({
      data: {
        ...p,
        images: JSON.stringify([MANDALA_IMAGES[i % MANDALA_IMAGES.length]]),
      },
    });
    console.log(`✅ Product created: ${p.name}`);
  }

  console.log("\n🎉 Seeding complete!");
  console.log("📧 Admin login: admin@medivadesigns.shop / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
