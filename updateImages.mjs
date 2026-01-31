/**
 * Update specific drink images
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDycX1uw1SWdv9kcO-Q4hGdADSXK48kyfQ",
    authDomain: "home-coffee-shop-app.firebaseapp.com",
    projectId: "home-coffee-shop-app",
    storageBucket: "home-coffee-shop-app.firebasestorage.app",
    messagingSenderId: "551187742299",
    appId: "1:551187742299:web:0574d5f02b8ea1f035097e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const updates = [
    {
        id: "moka-pot",
        imageUrl: "https://www.equatorcoffees.com/cdn/shop/files/Bialetti-Moka-Pot-Stovetop-Coffee-Maker-Equator-Coffees-1.jpg?v=1760459763"
    },
    {
        id: "turkish-coffee",
        imageUrl: "https://colombiancoffee.us/cdn/shop/articles/turkish-coffee-a-distinction-of-the-people-of-turkey-209132_15e8ba02-8035-4262-93f4-83aae3ed6526.png?v=1751659690&width=900"
    },
    {
        id: "mocha",
        imageUrl: "https://www.laurafuentes.com/wp-content/uploads/2025/01/Hot-chocolate-mocha_post_01-1.jpg"
    },
    {
        id: "iced-mocha",
        imageUrl: "https://easyweeknightrecipes.com/wp-content/uploads/2020/08/Mocha-Iced-Coffee-5.jpg"
    }
];

async function updateImages() {
    console.log("📷 Updating drink images...\n");

    for (const item of updates) {
        try {
            await updateDoc(doc(db, 'menu', item.id), { imageUrl: item.imageUrl });
            console.log(`   ✅ ${item.id}`);
        } catch (e) {
            console.log(`   ❌ ${item.id}: ${e.message}`);
        }
    }

    console.log("\n✨ Done!");
    process.exit(0);
}

updateImages();
