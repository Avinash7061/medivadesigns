import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// POST /api/checkout/verify - Verify Razorpay Payment
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = await request.json();

    // Verify signature — this is critical for security
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("[VERIFY] Signature mismatch — possible tampered payment");
      return NextResponse.json(
        { error: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    // Signature valid — update order to PAID
    await prisma.order.update({
      where: { id: dbOrderId },
      data: {
        status: "PAID",
        stripeSessionId: razorpay_payment_id, // store payment ID
      },
    });

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id });
  } catch (error: any) {
    console.error("[VERIFY] Error:", error);
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}
