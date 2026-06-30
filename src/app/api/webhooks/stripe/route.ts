import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

/**
 * Razorpay Webhook Handler
 * Verifies the webhook signature using RAZORPAY_KEY_SECRET
 * and updates order status based on payment events.
 *
 * Set this URL in your Razorpay dashboard:
 * https://medivadesigns.shop/api/webhooks/razorpay
 */
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || "";

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("[WEBHOOK] Invalid Razorpay signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const { event: eventType, payload } = event;

    console.log("[WEBHOOK] Razorpay event:", eventType);

    switch (eventType) {
      case "payment.captured": {
        const payment = payload.payment?.entity;
        const orderId = payment?.notes?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: "PAID",
              stripeSessionId: payment.id, // store Razorpay payment ID
            },
          });
          console.log(`[WEBHOOK] Order ${orderId} marked as PAID`);
        }
        break;
      }

      case "payment.failed": {
        const payment = payload.payment?.entity;
        const orderId = payment?.notes?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "FAILED" },
          });
          console.log(`[WEBHOOK] Order ${orderId} marked as FAILED`);
        }
        break;
      }

      case "refund.created": {
        const refund = payload.refund?.entity;
        console.log("[WEBHOOK] Refund created:", refund?.id);
        // Handle refund logic here if needed
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[WEBHOOK] Error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
