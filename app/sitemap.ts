import { MetadataRoute } from "next";
import { getMenuItems } from "lib/firebase/menu";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: new Date(),
    },
  ];

  // Try to get dynamic drink routes, but gracefully handle errors (e.g., in CI without Firebase credentials)
  let drinkRoutes: MetadataRoute.Sitemap = [];
  try {
    const menuItems = await getMenuItems();
    drinkRoutes = menuItems.map((item) => ({
      url: `${baseUrl}/drink/${item.id}`,
      lastModified: new Date(),
    }));
  } catch (error) {
    console.warn("Could not fetch menu items for sitemap:", error);
  }

  return [...staticRoutes, ...drinkRoutes];
}
