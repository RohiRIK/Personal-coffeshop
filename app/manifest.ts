import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Personal Coffeshop",
        short_name: "Coffeshop",
        description: "Your personal coffee ordering companion.",
        start_url: "/",
        display: "standalone",
        background_color: "#0c0a09",
        theme_color: "#0c0a09",
        icons: [
            {
                src: "/icon.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
