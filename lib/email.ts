import { Resend } from "resend";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

// Lazy initialization to avoid build-time errors when API key is missing
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

const DAILY_LIMIT = 95;
const FROM_EMAIL =
  process.env.EMAIL_FROM || "noreply@personal-coffe.rohi-lab.org";

// Simple coffee emoji for email header
const COFFEE_ICON = `<span style="font-size: 48px;">☕</span>`;

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayKey(): string {
  const date = new Date().toISOString().split("T")[0];
  return date as string;
}

/**
 * Check if we can send more emails today
 */
export async function canSendEmail(): Promise<boolean> {
  try {
    const todayKey = getTodayKey();
    const statsRef = doc(db, "emailStats", todayKey);
    const statsDoc = await getDoc(statsRef);

    if (!statsDoc.exists()) {
      return true; // No emails sent today
    }

    const count = statsDoc.data()?.count || 0;
    return count < DAILY_LIMIT;
  } catch (error) {
    console.error("Error checking email limit:", error);
    return false;
  }
}

/**
 * Increment the daily email counter
 */
async function incrementEmailCount(): Promise<void> {
  const todayKey = getTodayKey();
  const statsRef = doc(db, "emailStats", todayKey);
  const statsDoc = await getDoc(statsRef);

  if (!statsDoc.exists()) {
    await setDoc(statsRef, { count: 1, date: todayKey });
  } else {
    await updateDoc(statsRef, { count: increment(1) });
  }
}

/**
 * Get remaining emails for today
 */
export async function getRemainingEmails(): Promise<number> {
  try {
    const todayKey = getTodayKey();
    const statsRef = doc(db, "emailStats", todayKey);
    const statsDoc = await getDoc(statsRef);

    if (!statsDoc.exists()) {
      return DAILY_LIMIT;
    }

    const count = statsDoc.data()?.count || 0;
    return Math.max(0, DAILY_LIMIT - count);
  } catch (error) {
    console.error("Error getting remaining emails:", error);
    return 0;
  }
}

/**
 * Send order ready notification email
 */
export async function sendOrderReadyEmail(
  to: string,
  customerName: string,
  orderId: string,
  items?: { name: string; quantity: number; price: number }[],
  total?: number,
): Promise<{ success: boolean; error?: string }> {
  if (!(await canSendEmail())) {
    return { success: false, error: "Daily email limit reached (95/day)" };
  }

  // Generate items HTML if items provided
  const orderIdDisplay =
    orderId.length > 6
      ? orderId.slice(-6).toUpperCase()
      : orderId.toUpperCase();

  const itemsHtml =
    items && items.length > 0
      ? `
      <div style="background-color: #292524; padding: 16px; border-radius: 12px; margin: 20px 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <p style="color: #a8a29e; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Your Order</p>
          <p style="color: #78716c; font-size: 10px; margin: 0;">#${orderIdDisplay}</p>
        </div>
        ${items
          .map(
            (item) => `
          <div style="padding: 8px 0; border-bottom: 1px solid #44403c;">
            <span style="color: #e7e5e4; font-size: 14px;">${item.quantity}x ${item.name}</span>
            <span style="color: #f59e0b; font-size: 14px; font-weight: bold; float: right;">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `,
          )
          .join("")}
        ${
          total
            ? `
          <div style="padding: 12px 0 0 0; margin-top: 8px;">
            <span style="color: #a8a29e; font-size: 14px; font-weight: bold;">Total</span>
            <span style="color: #f59e0b; font-size: 18px; font-weight: bold; float: right;">$${total.toFixed(2)}</span>
          </div>
        `
            : ""
        }
      </div>
    `
      : `
      <div style="background-color: #292524; padding: 16px; border-radius: 12px; margin: 20px 0; text-align: center;">
        <p style="color: #a8a29e; font-size: 12px; margin: 0;">Order ID</p>
        <p style="color: #f59e0b; font-size: 18px; font-weight: bold; margin: 4px 0;">#${orderIdDisplay}</p>
      </div>
    `;

  try {
    const { error } = await getResendClient().emails.send({
      from: `Brista Coffee <${FROM_EMAIL}>`,
      to: [to],
      subject: "☕ Your coffee is ready!",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background-color: #1c1917; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 20px;">
            ${COFFEE_ICON}
          </div>
          <h1 style="color: #f59e0b; margin-bottom: 10px; text-align: center;">Your order is ready! ☕</h1>
          <p style="color: #e7e5e4; font-size: 16px; text-align: center;">
            Hey ${customerName}! Your coffee order is ready for pickup.
          </p>
          ${itemsHtml}
          <p style="color: #a8a29e; font-size: 14px; text-align: center;">
            Head over and grab it while it's fresh! ☕✨
          </p>
          <hr style="border: none; border-top: 1px solid #44403c; margin: 20px 0;" />
          <div style="text-align: center;">
            <p style="color: #78716c; font-size: 11px; margin: 0;">Powered by caffeine and questionable life choices ☕</p>
            <p style="color: #57534e; font-size: 10px; margin: 4px 0 0 0;">Brista - Your Personal Coffee Shop</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    await incrementEmailCount();
    return { success: true };
  } catch (error) {
    console.error("Error sending ready email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send rating request email
 */
export async function sendRatingRequestEmail(
  to: string,
  customerName: string,
  orderId: string,
  ratingToken: string,
  baseUrl: string,
): Promise<{ success: boolean; error?: string }> {
  if (!(await canSendEmail())) {
    return { success: false, error: "Daily email limit reached (95/day)" };
  }

  const ratingUrl = `${baseUrl}/rate/${orderId}?token=${ratingToken}`;

  // Generate star rating buttons (each links to rating page with pre-selected rating)
  const starButtons = [1, 2, 3, 4, 5]
    .map(
      (rating) => `
    <a href="${ratingUrl}&rating=${rating}" style="display: inline-block; width: 44px; height: 44px; background-color: #292524; border-radius: 8px; text-decoration: none; font-size: 24px; line-height: 44px; margin: 0 4px;">
      ⭐
    </a>
  `,
    )
    .join("");

  try {
    const { error } = await getResendClient().emails.send({
      from: `Brista Coffee <${FROM_EMAIL}>`,
      to: [to],
      subject: "How was your coffee? ⭐",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background-color: #1c1917; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 20px;">
            ${COFFEE_ICON}
          </div>
          <h1 style="color: #f59e0b; margin-bottom: 10px; text-align: center;">How was your coffee? ⭐</h1>
          <p style="color: #e7e5e4; font-size: 16px; text-align: center;">
            Hey ${customerName}! We hope you enjoyed your coffee.
          </p>
          <p style="color: #a8a29e; font-size: 14px; text-align: center; margin-bottom: 8px;">
            Tap a star to rate your experience:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            ${starButtons}
          </div>
          <p style="color: #78716c; font-size: 10px; text-align: center; margin-top: 8px;">
            1 = Meh &nbsp; • &nbsp; 5 = Amazing!
          </p>
          <hr style="border: none; border-top: 1px solid #44403c; margin: 20px 0;" />
          <div style="text-align: center;">
            <p style="color: #78716c; font-size: 11px; margin: 0;">Powered by caffeine and questionable life choices ☕</p>
            <p style="color: #57534e; font-size: 10px; margin: 4px 0 0 0;">Brista - Your Personal Coffee Shop</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    await incrementEmailCount();
    return { success: true };
  } catch (error) {
    console.error("Error sending rating email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
