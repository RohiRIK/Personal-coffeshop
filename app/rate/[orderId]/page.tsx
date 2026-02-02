"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "lib/firebase";
import { Order } from "lib/firebase/types";
import { Star, Coffee, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PublicRatingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const token = searchParams.get("token");
  const preSelectedRating = searchParams.get("rating");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(
    preSelectedRating ? parseInt(preSelectedRating) : 5,
  );
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId || !token) {
        setError("Invalid rating link");
        setLoading(false);
        return;
      }

      try {
        const orderRef = doc(db, "orders", orderId);
        const orderDoc = await getDoc(orderRef);

        if (!orderDoc.exists()) {
          setError("Order not found");
          setLoading(false);
          return;
        }

        const orderData = orderDoc.data();

        // Validate token
        if (orderData.ratingToken !== token) {
          setError("Invalid or expired rating link");
          setLoading(false);
          return;
        }

        // Check if already rated
        if (orderData.rating) {
          setSubmitted(true);
          setRating(orderData.rating);
          setReview(orderData.review || "");
        }

        setOrder({
          id: orderDoc.id,
          ...orderData,
          createdAt: orderData.createdAt?.toDate() || new Date(),
          updatedAt: orderData.updatedAt?.toDate(),
        } as Order);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order");
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, token]);

  const handleSubmit = async () => {
    if (!order) return;

    setSubmitting(true);
    try {
      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, {
        rating,
        review: review || null,
        updatedAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting rating:", err);
      setError("Failed to submit rating. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-stone-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <Coffee className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-stone-100 mb-2">Oops!</h1>
        <p className="text-stone-400 mb-6">{error}</p>
        <Link
          href="/"
          className="px-6 py-3 bg-amber-500 text-stone-900 font-bold rounded-xl hover:bg-amber-400 transition-colors"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-stone-100 mb-2">
          Thank You! ⭐
        </h1>
        <p className="text-stone-400 mb-4">
          Your feedback helps us make better coffee!
        </p>
        <div className="flex gap-1 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-8 h-8 ${
                star <= rating
                  ? "fill-amber-500 text-amber-500"
                  : "text-stone-700"
              }`}
            />
          ))}
        </div>
        {review && <p className="text-stone-300 italic max-w-md">"{review}"</p>}
        <Link
          href="/"
          className="mt-8 px-6 py-3 bg-stone-800 text-stone-300 font-medium rounded-xl hover:bg-stone-700 transition-colors"
        >
          Visit Brista Coffee
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <Coffee className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold text-stone-100 mb-2">
            How was your coffee?
          </h1>
          <p className="text-stone-400">
            Your feedback means the world to us ☕
          </p>
        </div>

        {/* Order Summary */}
        {order && (
          <div className="bg-stone-800/50 rounded-xl p-4 mb-6 border border-stone-700">
            <div className="text-xs text-stone-500 mb-2">Your Order</div>
            <div className="space-y-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="text-stone-300">
                  {item.quantity}x {item.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Star Rating */}
        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`w-12 h-12 ${
                  star <= (hoveredRating || rating)
                    ? "fill-amber-500 text-amber-500"
                    : "text-stone-600"
                } transition-colors duration-200`}
              />
            </button>
          ))}
        </div>

        {/* Review Text */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-stone-400 mb-2">
            Leave a comment (optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Tell us what you loved..."
            className="w-full bg-stone-800 border border-stone-700 rounded-xl p-4 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 min-h-[120px] resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {submitting ? "Submitting..." : "Submit Rating ⭐"}
        </button>

        <p className="text-center text-stone-600 text-xs mt-4">
          Powered by Brista Coffee
        </p>
      </div>
    </div>
  );
}
