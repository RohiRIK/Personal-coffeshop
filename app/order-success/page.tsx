"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Coffee, Clock, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { reactToOrder } from "lib/firebase/orders";

const REACTION_EMOJIS = ["☕", "🔥", "❤️", "😍", "🎉", "🙏"];

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [showConfetti, setShowConfetti] = useState(false);
  const [sentReaction, setSentReaction] = useState<string | null>(null);

  useEffect(() => {
    // Trigger confetti on mount
    if (!showConfetti) {
      setShowConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#d97706", "#fbbf24"],
      });
    }
  }, [showConfetti]);

  const handleReaction = async (emoji: string) => {
    if (!orderId || sentReaction) return;
    setSentReaction(emoji);
    try {
      await reactToOrder(orderId, emoji);
      // Mini confetti burst for the reaction
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.7 },
        colors: ["#f59e0b", "#fbbf24"],
      });
    } catch {
      // Silently fail — don't ruin the moment
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-12 h-12 text-amber-400" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
            <Coffee className="w-8 h-8 text-amber-500 animate-pulse" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-stone-100 mb-2">
          Order Placed!
        </h1>
        <p className="text-stone-400 mb-8">
          Your order has been received and is being prepared.
        </p>

        {/* Order Info Card */}
        <div className="bg-stone-800 rounded-2xl p-6 border border-stone-700 mb-6">
          <div className="flex items-center justify-center gap-2 text-amber-400 mb-4">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Estimated: 5-10 minutes</span>
          </div>

          {orderId && (
            <div className="text-stone-500 text-sm">
              Order ID:{" "}
              <span className="font-mono text-stone-400">
                {orderId.slice(0, 8)}...
              </span>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-stone-700">
            <p className="text-stone-300 text-sm">
              💵 Please pay at the counter when your order is ready.
            </p>
          </div>
        </div>

        {/* Emoji Reactions */}
        {orderId && (
          <div className="mb-8">
            <p className="text-stone-500 text-xs uppercase tracking-wider mb-3">
              {sentReaction
                ? "Thanks for the feedback!"
                : "How are you feeling?"}
            </p>
            <div className="flex items-center justify-center gap-2">
              {REACTION_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  disabled={!!sentReaction}
                  className={`text-2xl p-2 rounded-xl transition-all duration-200 ${
                    sentReaction === emoji
                      ? "bg-amber-500/20 scale-125 ring-2 ring-amber-500/50"
                      : sentReaction
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-stone-800 hover:scale-110 active:scale-95"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/orders"
            className="flex items-center justify-center gap-2 w-full py-4 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl transition-colors"
          >
            View My Orders
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/menu"
            className="flex items-center justify-center gap-2 w-full py-4 bg-stone-800 hover:bg-stone-700 text-stone-100 font-medium rounded-xl border border-stone-700 transition-colors"
          >
            Order More
          </Link>
        </div>
      </div>
    </div>
  );
}
