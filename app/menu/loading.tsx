import { Loader2 } from "lucide-react";

export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-stone-900 py-12 px-4 flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
      <h2 className="text-xl font-bold text-stone-200">Brewing the menu...</h2>
      <p className="text-stone-500 mt-2">
        Just a moment while we grind the beans.
      </p>
    </div>
  );
}
