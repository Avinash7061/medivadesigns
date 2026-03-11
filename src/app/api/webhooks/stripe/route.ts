import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId && session.amount_total) {
      try {
        await prisma.order.create({
          data: {
            userId,
            total: session.amount_total / 100,
            status: "PAID",
            stripeSessionId: session.id,
          },
        });

        // Clear the user's cart after successful payment
        await prisma.cartItem.deleteMany({ where: { userId } });
      } catch (error) {
        console.error("Failed to process completed checkout session:", error);
        // Return 500 so Stripe retries the webhook
        return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
