import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const limit = searchParams.get("limit");

    const where: any = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (featured === "true") {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "name") orderBy = { name: "asc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit ? parseInt(limit) : undefined,
    });

    // Parse images JSON string
    const parsed = products.map((p) => {
      let images: string[] = [];
      try {
        images = JSON.parse(p.images);
      } catch {
        images = [];
      }
      return { ...p, images };
    });

    return NextResponse.json(parsed, {
      headers: { "Cache-Control": "no-store, must-revalidate" },
    });
  } catch (error) {
    console.error("[PRODUCTS_GET] Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

