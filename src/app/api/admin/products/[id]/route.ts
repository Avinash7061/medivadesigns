import { NextResponse } from "next/server";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

function isAdmin(session: Session | null) {
  return session?.user?.role === "ADMIN";
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }
    if (typeof body.price !== "number" || body.price <= 0) {
      return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name.trim(),
        description: body.description ?? "",
        price: body.price,
        category: body.category ?? "",
        stock: typeof body.stock === "number" ? body.stock : 0,
        featured: body.featured === true,
        images: JSON.stringify(Array.isArray(body.images) ? body.images : []),
      },
    });
    return NextResponse.json({ ...product, images: JSON.parse(product.images) as string[] });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
