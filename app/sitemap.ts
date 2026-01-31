import { MetadataRoute } from 'next';
import { getMenuItems } from 'lib/firebase/menu';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const menuItems = await getMenuItems();

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

    // Dynamic drink routes
    const drinkRoutes = menuItems.map((item) => ({
        url: `${baseUrl}/drink/${item.id}`,
        lastModified: new Date(),
    }));

    return [...staticRoutes, ...drinkRoutes];
}
