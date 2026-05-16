import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { normalizeProductImages } from "@/utils/products";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is admin
    const isAdmin = user?.app_metadata?.role === "ADMIN";

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(normalizeProductImages(product));
  } catch (error) {
    console.error("[ADMIN_PRODUCT_GET] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is admin
    const isAdmin = user?.app_metadata?.role === "ADMIN";

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, category, stock, featured, images } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        category,
        stock,
        featured,
        images: images ? JSON.stringify(images) : undefined,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[ADMIN_PRODUCT_PATCH] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is admin
    const isAdmin = user?.app_metadata?.role === "ADMIN";

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_PRODUCT_DELETE] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
