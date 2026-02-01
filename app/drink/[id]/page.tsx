import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getMenuItem, getMenuItems } from "lib/firebase/menu";
import { CustomizationForm } from "components/drink/customization-form";

// Generate static params for all drinks
export async function generateStaticParams() {
  const items = await getMenuItems();
  return items.map((item) => ({
    id: item.id,
  }));
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getMenuItem(id);

  if (!item) {
    return { title: "Drink Not Found" };
  }

  return {
    title: item.name,
    description: item.description,
  };
}

export default async function DrinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getMenuItem(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/menu"
          className="text-amber-400 hover:text-amber-300 text-sm mb-6 inline-block"
        >
          ← Back to Menu
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />

            {/* Tag badge */}
            <div
              className={`absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold ${
                item.tag === "Hot" ? "bg-orange-500" : "bg-blue-500"
              }`}
            >
              {item.tag === "Hot" ? "🔥" : "❄️"} {item.tag}
            </div>

            {/* Sold out overlay */}
            {!item.available && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="px-6 py-3 border-2 border-red-500 text-red-500 font-bold text-xl rounded-lg">
                  SOLD OUT
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-amber-400 text-sm font-medium mb-1">
                {item.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-100">
                {item.name}
              </h1>
              <p className="text-2xl font-bold text-amber-400 mt-2">
                ${item.price.toFixed(2)}
              </p>
            </div>

            <p className="text-stone-400 leading-relaxed">{item.description}</p>

            {item.available ? (
              <CustomizationForm
                menuItemId={item.id}
                imageUrl={item.imageUrl}
                price={item.price}
                itemName={item.name}
              />
            ) : (
              <button
                disabled
                className="w-full py-4 rounded-xl font-bold text-lg bg-stone-700 text-stone-500 cursor-not-allowed"
              >
                Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
