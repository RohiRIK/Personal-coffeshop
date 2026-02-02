import { NextRequest, NextResponse } from "next/server";
import {
  sendOrderReadyEmail,
  sendRatingRequestEmail,
  canSendEmail,
  getRemainingEmails,
} from "lib/email";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, orderId, to, customerName, ratingToken } = body;

    // Validate required fields
    if (!type || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields: type, orderId" },
        { status: 400 },
      );
    }

    // Check daily limit first
    if (!(await canSendEmail())) {
      const remaining = await getRemainingEmails();
      return NextResponse.json(
        { error: `Daily email limit reached. Remaining: ${remaining}/95` },
        { status: 429 },
      );
    }

    // Get order from Firestore to get email if not provided
    let email = to;
    let name = customerName;
    let token = ratingToken;

    if (!email) {
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);
      if (orderDoc.exists()) {
        const orderData = orderDoc.data();
        email = orderData.userEmail;
        name = name || orderData.userName || "Customer";
        token = token || orderData.ratingToken;
      }
    }

    // Fetch order details for items
    let items: { name: string; quantity: number; price: number }[] = [];
    let total: number | undefined;
    const orderRef = doc(db, "orders", orderId);
    const orderDoc = await getDoc(orderRef);
    if (orderDoc.exists()) {
      const orderData = orderDoc.data();
      if (orderData.items) {
        items = orderData.items.map(
          (item: {
            drinkName?: string;
            name?: string;
            quantity: number;
            price: number;
          }) => ({
            name: item.drinkName || item.name || "Coffee",
            quantity: item.quantity || 1,
            price: item.price || 0,
          }),
        );
      }
      total = orderData.total;
    }

    if (!email) {
      return NextResponse.json(
        { error: "No email found for this order" },
        { status: 400 },
      );
    }

    const baseUrl =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    let result;

    switch (type) {
      case "ready":
        result = await sendOrderReadyEmail(email, name, orderId, items, total);
        if (result.success) {
          // Mark email as sent (silently fail if order doesn't exist)
          try {
            await updateDoc(doc(db, "orders", orderId), {
              emailSentReady: true,
            });
          } catch {
            // Order may not exist (test mode)
          }
        }
        break;

      case "rating":
        if (!token) {
          return NextResponse.json(
            { error: "No rating token found for this order" },
            { status: 400 },
          );
        }
        result = await sendRatingRequestEmail(
          email,
          name,
          orderId,
          token,
          baseUrl,
        );
        if (result.success) {
          try {
            await updateDoc(doc(db, "orders", orderId), {
              emailSentRating: true,
            });
          } catch {
            // Order may not exist (test mode)
          }
        }
        break;

      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 },
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 },
      );
    }

    const remaining = await getRemainingEmails();
    return NextResponse.json({
      success: true,
      message: `${type} email sent successfully`,
      remaining,
    });
  } catch (error) {
    console.error("Send email API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const remaining = await getRemainingEmails();
    const canSend = await canSendEmail();
    return NextResponse.json({ remaining, canSend, limit: 95 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check email status" },
      { status: 500 },
    );
  }
}
