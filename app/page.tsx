import Link from 'next/link';
import { getMenuItems } from 'lib/firebase/menu';
import type { MenuItem } from 'lib/firebase/types';
import Image from 'next/image';

// Featured drinks section
function FeaturedDrinks({ items }: { items: MenuItem[] }) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-amber-400">
          Our Menu
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.slice(0, 8).map((item) => (
            <Link
              key={item.id}
              href={`/drink/${item.id}`}
              className="group relative bg-stone-800 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="aspect-square relative">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Tag badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold ${item.tag === 'Hot' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                  {item.tag}
                </div>

                {/* Price badge */}
                <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
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
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/menu"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3 rounded-full transition-colors"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}

// Hero section
function Hero() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-900/90 to-stone-900" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-amber-400">Brista</span>{' '}
          <span className="text-stone-100">Coffee</span>
        </h1>
        <p className="text-xl md:text-2xl text-stone-300 mb-4 max-w-2xl mx-auto">
          Hand-crafted beverages made with love, served in our cozy home café
        </p>
        <p className="text-sm text-stone-500 italic mb-8">
          Powered by caffeine and questionable life choices ☕
        </p>
        <Link
          href="/menu"
          className="inline-block bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-4 rounded-full text-lg transition-colors"
        >
          Order Now
        </Link>
      </div>
    </section>
  );
}

export default async function HomePage() {
  let menuItems: MenuItem[] = [];

  try {
    menuItems = await getMenuItems();
  } catch (error) {
    console.error('Error loading menu:', error);
  }

  return (
    <>
      <Hero />
      <FeaturedDrinks items={menuItems} />
    </>
  );
}
