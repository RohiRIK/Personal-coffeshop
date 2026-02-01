"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { rateOrder } from "lib/firebase/orders";
import { toast } from "sonner";
import { Order } from "lib/firebase/types";

interface RateOrderModalProps {
    order: Order;
    onClose: () => void;
    onRatingSubmit: () => void;
}

export function RateOrderModal({
    order,
    onClose,
    onRatingSubmit,
}: RateOrderModalProps) {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await rateOrder(order.id, rating, review);
            toast.success("Thank you for your feedback!");
            onRatingSubmit();
            onClose();
        } catch (error) {
            console.error("Error submitting rating:", error);
            toast.error("Failed to submit rating. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-300 hover:bg-stone-800 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-stone-100 mb-2">Rate your Order</h2>
                <p className="text-stone-400 text-sm mb-6">
                    How was your {order.items.map((i) => i.name).join(", ")}?
                </p>

                {/* Start Rating */}
                <div className="flex justify-center gap-2 mb-8">
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
                                className={`w-10 h-10 ${star <= (hoveredRating || rating)
                                        ? "fill-amber-500 text-amber-500"
                                        : "text-stone-600"
                                    } transition-colors duration-200`}
                            />
                        </button>
                    ))}
                </div>

                {/* Review Text */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-stone-300 mb-2">
                        Leave a comment (optional)
                    </label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Tell us what you liked..."
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 min-h-[100px] resize-none"
                    />
                </div>

                {/* Actions */}
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? "Submitting..." : "Submit Review"}
                </button>
            </div>
        </div>
    );
}
