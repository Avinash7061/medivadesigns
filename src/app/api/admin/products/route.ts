import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { normalizeProductImages } from "@/utils/products";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is admin
    const isAdmin = user?.app_metadata?.role === "ADMIN";

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    const parsed = products.map(normalizeProductImages);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[ADMIN_PRODUCTS_GET] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is admin
    const isAdmin = user?.app_metadata?.role === "ADMIN";

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, category, stock, featured, images } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        category,
        stock,
        featured,
        images: JSON.stringify(images || []),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[ADMIN_PRODUCTS_POST] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
