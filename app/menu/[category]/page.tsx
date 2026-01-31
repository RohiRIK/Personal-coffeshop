import Link from 'next/link';
import Image from 'next/image';
import { getMenuByCategory, getCategories } from 'lib/firebase/menu';
import type { MenuItem } from 'lib/firebase/types';
import { CATEGORIES } from 'lib/constants';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return CATEGORIES.filter(c => c.id !== 'all').map((category) => ({
        category: category.id,
    }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
    const category = CATEGORIES.find(c => c.id === params.category);
    return {
        title: category ? `${category.name} Menu` : 'Menu',
        description: `Browse our ${category?.name.toLowerCase()} selection`,
    };
}

// Reusing components from main menu page for consistency
// Ideally these should be refactored into shared components
function MenuCard({ item }: { item: MenuItem }) {
    return (
        <Link
            href={`/drink/${item.id}`}
            className={`group relative bg-stone-800 rounded-xl overflow-hidden transition-all duration-300 
        ${item.available
                    ? 'hover:shadow-xl hover:shadow-amber-500/10 hover:scale-[1.02] cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                }`}
        >
            <div className="aspect-square relative">
                <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={`object-cover transition-transform duration-500 ${item.available ? 'group-hover:scale-110' : 'grayscale'
                        }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Tag badge */}
                <div className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${item.tag === 'Hot' ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                    {item.tag === 'Hot' ? '🔥' : '❄️'} {item.tag}
                </div>

                {/* Sold out overlay */}
                {!item.available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <span className="px-4 py-2 border-2 border-red-500 text-red-500 font-bold rounded-lg">
                            SOLD OUT
                        </span>
                    </div>
                )}

                {/* Price badge */}
                <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-sm px-3 py-1 rounded-full border border-amber-500/20">
                    <span className="text-amber-400 font-bold">${item.price.toFixed(2)}</span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors">
                    {item.name}
                </h3>
                <p className="text-sm text-stone-400 mt-1 line-clamp-2">
                    {item.description}
                </p>
                <p className="text-xs text-stone-500 mt-2">{item.category}</p>
            </div>
        </Link>
    );
}

function CategoryFilter({ activeCategory }: { activeCategory?: string }) {
    return (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
            {CATEGORIES.map((cat) => (
                <Link
                    key={cat.id}
                    href={cat.path}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${(activeCategory === cat.id)
                            ? 'bg-amber-500 text-stone-900'
                            : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                        }`}
                >
                    {cat.name}
                </Link>
            ))}
        </div>
    );
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;

    // Validate category
    const validCategory = CATEGORIES.find(c => c.id === category);
    if (!validCategory && category !== 'all') {
        notFound();
    }

    // Fetch items
    let menuItems: MenuItem[] = [];
    try {
        // Map URL slug to Firestore category name if needed
        // Assuming simple mapping for now, but might need adjustment based on how data is stored
        // Firestore categories: "Coffee", "Iced", "Non-Coffee", "Dessert"
        // URL slugs: "coffee", "iced", "non-coffee", "dessert"

        // Capitalize for Firestore query (simple approach)
        // A better approach would be to have a mapping in the constants file
        const dbCategory = validCategory?.name || 'Coffee';
        menuItems = await getMenuByCategory(dbCategory);
    } catch (error) {
        console.error('Error loading menu category:', error);
    }

    return (
        <div className="min-h-screen bg-stone-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link href="/" className="text-amber-400 hover:text-amber-300 text-sm mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-stone-100">Our Menu</h1>
                    <p className="text-stone-400 mt-3 text-lg">Hand-crafted beverages and artisanal pastries</p>
                    <p className="text-sm text-stone-500 italic mt-2">Powered by caffeine and questionable life choices ☕</p>
                </div>

                {/* Category Filter */}
                <CategoryFilter activeCategory={category} />

                {/* Menu Grid */}
                {menuItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {menuItems.map((item) => (
                            <MenuCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-stone-400 text-lg">No items found in this category.</p>
                        <Link href="/menu" className="text-amber-400 hover:text-amber-300 mt-4 inline-block">
                            View all items
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
