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
    const page = searchParams.get("page");

    const pageNum = page ? Math.max(1, parseInt(page)) : 1;
    const pageSize = limit ? Math.min(100, Math.max(1, parseInt(limit))) : undefined;

    const where: {
      category?: string;
      featured?: boolean;
      OR?: Array<{ name?: { contains: string }; description?: { contains: string } }>;
    } = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (featured === "true") {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    type SortOrder = "asc" | "desc";
    type OrderBy = { createdAt?: SortOrder; price?: SortOrder; name?: SortOrder };
    let orderBy: OrderBy = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "name") orderBy = { name: "asc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: pageSize,
      skip: pageSize ? (pageNum - 1) * pageSize : undefined,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        category: true,
        stock: true,
        featured: true,
        createdAt: true,
      },
    });

    const parsed = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images) as string[],
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
