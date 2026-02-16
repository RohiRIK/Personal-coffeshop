"use client";

import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "lib/firebase";
import { useAuth } from "contexts/auth-context";
import { Coffee } from "lucide-react";

const STAMPS_PER_REWARD = 8;

export function StampCard() {
  const { user } = useAuth();
  const [stamps, setStamps] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchStamps() {
      try {
        const userDoc = await getDoc(doc(db, "users", user!.uid));
        if (userDoc.exists()) {
          setStamps(userDoc.data().stamps || 0);
        }
      } catch (error) {
        console.error("Error fetching stamps:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStamps();
  }, [user]);

  if (loading || !user) return null;

  const currentStamps = stamps % STAMPS_PER_REWARD;
  const rewardsEarned = Math.floor(stamps / STAMPS_PER_REWARD);

  return (
    <div className="bg-stone-800 rounded-2xl border border-stone-700 p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-stone-100 font-bold flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-400" />
            Loyalty Card
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {STAMPS_PER_REWARD - currentStamps} more until free reward!
          </p>
        </div>
        {rewardsEarned > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
            <span className="text-xs font-bold text-amber-400">
              🎁 {rewardsEarned} reward{rewardsEarned > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Stamp Grid */}
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: STAMPS_PER_REWARD }).map((_, i) => {
          const isFilled = i < currentStamps;
          return (
            <div
              key={i}
              className={`
                aspect-square rounded-xl flex items-center justify-center transition-all duration-300
                ${
                  isFilled
                    ? "bg-amber-500/20 border-2 border-amber-500/50 scale-100"
                    : "bg-stone-900 border-2 border-stone-700 border-dashed"
                }
              `}
            >
              {isFilled ? (
                <Coffee className="w-5 h-5 text-amber-400" />
              ) : (
                <span className="text-xs text-stone-600">{i + 1}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-stone-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${(currentStamps / STAMPS_PER_REWARD) * 100}%` }}
        />
      </div>
    </div>
  );
}

// Helper to add a stamp after order — call from createOrder
export async function addStamp(userId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      stamps: increment(1),
    });
  } catch (error) {
    console.error("Error adding stamp:", error);
  }
}
