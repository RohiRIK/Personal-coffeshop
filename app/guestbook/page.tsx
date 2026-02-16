"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "lib/firebase";
import { useAuth } from "contexts/auth-context";
import Link from "next/link";
import { BookOpen, Send, ArrowLeft, MessageCircle, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GuestbookEntry {
  id: string;
  userId: string;
  userName: string;
  message: string;
  emoji: string;
  createdAt: Date;
}

const MOOD_EMOJIS = ["☕", "🫶", "🔥", "✨", "🎉", "😋", "💛", "🥰"];

export default function GuestbookPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("☕");
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "guestbook"),
      orderBy("createdAt", "desc"),
      limit(50),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const newEntries: GuestbookEntry[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        newEntries.push({
          id: doc.id,
          userId: data.userId,
          userName: data.userName,
          message: data.message,
          emoji: data.emoji || "☕",
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : new Date(),
        });
      });
      setEntries(newEntries);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handlePost = useCallback(async () => {
    if (!user || !message.trim() || posting) return;
    setPosting(true);

    try {
      await addDoc(collection(db, "guestbook"), {
        userId: user.uid,
        userName: user.displayName || user.email?.split("@")[0] || "Anon",
        message: message.trim(),
        emoji: selectedEmoji,
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (error) {
      console.error("Error posting to guestbook:", error);
    } finally {
      setPosting(false);
    }
  }, [user, message, selectedEmoji, posting]);

  return (
    <div className="min-h-screen bg-stone-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href="/menu"
            className="text-amber-400 hover:text-amber-300 text-sm mb-4 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Menu
          </Link>
          <div className="flex items-center justify-center gap-3 mb-3">
            <BookOpen className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold text-stone-100">Guestbook</h1>
          </div>
          <p className="text-stone-400">
            Leave a note, share a memory, or just say hi! ☕
          </p>
        </div>

        {/* Post Form */}
        {user ? (
          <div className="bg-stone-800 rounded-2xl border border-stone-700 p-5 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">
                {(user.displayName || user.email || "?")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div className="flex-1 space-y-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  maxLength={280}
                  rows={2}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 text-sm resize-none focus:border-amber-500 focus:outline-none"
                />

                <div className="flex items-center justify-between">
                  {/* Emoji picker */}
                  <div className="flex gap-1">
                    {MOOD_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`text-lg p-1 rounded-lg transition-all ${
                          selectedEmoji === emoji
                            ? "bg-amber-500/20 scale-110"
                            : "opacity-50 hover:opacity-100"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Post button */}
                  <button
                    onClick={handlePost}
                    disabled={!message.trim() || posting}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-stone-900 text-sm font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {posting ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 mb-8 bg-stone-800/50 rounded-2xl border border-stone-700">
            <p className="text-stone-400 text-sm">
              <Link href="/login" className="text-amber-400 hover:underline">
                Sign in
              </Link>{" "}
              to leave a message
            </p>
          </div>
        )}

        {/* Entries */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-stone-800/50 rounded-xl p-5 animate-pulse"
              >
                <div className="h-4 bg-stone-700 rounded w-1/3 mb-3" />
                <div className="h-3 bg-stone-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : entries.length > 0 ? (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-stone-800/50 rounded-xl p-5 border border-stone-800 hover:border-stone-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{entry.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-stone-200 text-sm">
                        {entry.userName}
                      </span>
                      <span className="text-xs text-stone-600">
                        {formatDistanceToNow(entry.createdAt, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-stone-300 text-sm leading-relaxed">
                      {entry.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-stone-500">
            <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-lg">Be the first to write something!</p>
            <p className="text-sm mt-1">Your notes will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
