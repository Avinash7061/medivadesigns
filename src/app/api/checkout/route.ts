import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// POST /api/checkout - Create Razorpay Order
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Calculate total in paise (₹1 = 100 paise)
    const totalInRupees = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const totalInPaise = Math.round(totalInRupees * 100);

    // Create a pending order in our database first
    const dbOrder = await prisma.order.create({
      data: {
        userId: user.id,
        total: totalInRupees,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalInPaise,
      currency: "INR",
      receipt: dbOrder.id, // our DB order ID as receipt
      notes: {
        userId: user.id,
        orderId: dbOrder.id,
        customerEmail: user.email || "",
      },
    });

    // Save Razorpay order ID to our DB order
    await prisma.order.update({
      where: { id: dbOrder.id },
      data: { stripeSessionId: razorpayOrder.id }, // reusing the field for Razorpay order ID
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: dbOrder.id,
      customerEmail: user.email,
      customerName: user.user_metadata?.full_name || user.email,
    });
  } catch (error: any) {
    console.error("[CHECKOUT] Error:", error);
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
