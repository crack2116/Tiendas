import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, writeBatch } from 'firebase/firestore';
import { config } from 'dotenv';

// Load environment variables from .env file
config({ path: './.env' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.error("Firebase project ID is not defined in your .env file.");
  process.exit(1);
}

const placeholderImages = [
    {
      "id": "hero",
      "description": "Stylish woman in a modern cityscape",
      "imageUrl": "https://images.unsplash.com/photo-1562572159-4efc207f5aff?q=80&w=1920",
      "imageHint": "fashion model"
    },
    {
      "id": "carousel-clothing",
      "description": "A person wearing a stylish outfit",
      "imageUrl": "https://www.iese.edu/es/insight/wp-content/uploads/sites/4/1970/01/Fast-Fashion-estrategia-minorista.jpg",
      "imageHint": "fashion model"
    },
    {
      "id": "carousel-beauty",
      "description": "A collection of beauty products",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1920",
      "imageHint": "beauty products"
    },
    {
      "id": "carousel-perfume",
      "description": "An elegant perfume bottle",
      "imageUrl": "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1920",
      "imageHint": "perfume bottle"
    },
    {
      "id": "carousel-accessories",
      "description": "A collection of fashion accessories like sunglasses and a watch",
      "imageUrl": "https://hips.hearstapps.com/hmg-prod/images/gettyimages-837641132-1531290955.jpg?crop=1.00xw:0.753xh;0,0.0234xh",
      "imageHint": "fashion accessories"
    },
    {
      "id": "carousel-face",
      "description": "Woman applying face cream",
      "imageUrl": "https://images.unsplash.com/photo-1512496015851-a90137ba0a43?q=80&w=1920",
      "imageHint": "face care"
    },
    {
      "id": "carousel-hair",
      "description": "Hair care products on a shelf",
      "imageUrl": "https://images.unsplash.com/photo-1620916298379-2475a2254332?q=80&w=1920",
      "imageHint": "hair products"
    },
    {
      "id": "carousel-body",
      "description": "Woman applying body lotion",
      "imageUrl": "https://images.unsplash.com/photo-1563291885-26155933a2a6?q=80&w=1920",
      "imageHint": "body lotion"
    },
    {
      "id": "product-1-a",
      "description": "Front view of a minimalist white t-shirt",
      "imageUrl": "https://images.unsplash.com/photo-1688111421202-bda886f5e215?q=80&w=1080",
      "imageHint": "white t-shirt"
    },
    {
      "id": "product-1-b",
      "description": "Side view of a minimalist white t-shirt",
      "imageUrl": "https://images.unsplash.com/photo-1576417677416-6ca3adfb5435?q=80&w=1080",
      "imageHint": "white t-shirt"
    },
    {
      "id": "product-2-a",
      "description": "Slim-fit dark wash denim jeans",
      "imageUrl": "https://images.unsplash.com/photo-1658910453954-6ca847bb7470?q=80&w=1080",
      "imageHint": "denim jeans"
    },
    {
      "id": "product-2-b",
      "description": "Close-up of denim jeans fabric",
      "imageUrl": "https://images.unsplash.com/photo-1637069585336-827b298fe84a?q=80&w=1080",
      "imageHint": "denim jeans"
    },
    {
      "id": "product-3-a",
      "description": "Classic leather biker jacket",
      "imageUrl": "https://images.unsplash.com/photo-1489286696299-aa7486820bd5?q=80&w=1080",
      "imageHint": "leather jacket"
    },
    {
      "id": "product-3-b",
      "description": "Detail of biker jacket zipper",
      "imageUrl": "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1080",
      "imageHint": "leather jacket"
    },
    {
      "id": "product-4-a",
      "description": "Chunky knit wool sweater",
      "imageUrl": "https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?q=80&w=1080",
      "imageHint": "wool sweater"
    },
    {
      "id": "product-5-a",
      "description": "Sleek black Chelsea boots",
      "imageUrl": "https://images.unsplash.com/photo-1637059037982-519896b99b0f?q=80&w=1080",
      "imageHint": "black boots"
    },
    {
      "id": "product-6-a",
      "description": "Modern trench coat in beige",
      "imageUrl": "https://images.unsplash.com/photo-1633821879282-0c4e91f96232?q=80&w=1080",
      "imageHint": "trench coat"
    },
    {
      "id": "product-7-a",
      "description": "Silk floral print midi dress",
      "imageUrl": "https://images.unsplash.com/photo-1503408024948-0a3e1b2b519c?q=80&w=1080",
      "imageHint": "floral dress"
    },
    {
      "id": "product-8-a",
      "description": "Linen button-down shirt",
      "imageUrl": "https://images.unsplash.com/photo-1665201462900-809f7773ff5f?q=80&w=1080",
      "imageHint": "linen shirt"
    }
  ]
}

const getImage = (id: string, description: string, hint: string) => {
    const image = placeholderImages.find(img => img.id === id);
    return {
      id,
      url: image?.imageUrl || 'https://picsum.photos/seed/default/800/1000',
      alt: image?.description || description,
      hint: image?.imageHint || hint,
    };
};
  

const products = [
    {
      id: '1',
      slug: 'classic-white-tee',
      name: 'Classic White Tee',
      category: 'Tops',
      price: 19.99,
      originalPrice: 29.99,
      badge: 'Mega Promo',
      images: [
        getImage('product-1-a', 'Front view of a minimalist white t-shirt', 'white t-shirt'),
        getImage('product-1-b', 'Side view of a minimalist white t-shirt', 'white t-shirt'),
      ],
      description: 'A timeless staple for any wardrobe. This classic white t-shirt is made from 100% premium pima cotton, offering unparalleled softness and durability. Perfect for layering or wearing on its own.',
      details: ['100% Pima Cotton', 'Crew neck', 'Regular fit', 'Machine washable'],
      reviews: [
        { id: 'r1', author: 'Alex R.', rating: 5, comment: 'Incredibly soft and fits perfectly. Best white tee I\'ve owned.', date: '2023-05-15' },
        { id: 'r2', author: 'Jordan P.', rating: 4, comment: 'Great quality, but it\'s a bit sheer.', date: '2023-05-20' },
      ],
    },
    {
      id: '2',
      slug: 'slim-dark-denim',
      name: 'Slim Dark Denim',
      category: 'Jeans',
      price: 89.99,
      badge: 'Nuevo',
      images: [
        getImage('product-2-a', 'Slim-fit dark wash denim jeans', 'denim jeans'),
        getImage('product-2-b', 'Close-up of denim jeans fabric', 'denim jeans'),
      ],
      description: 'Our signature slim-fit jeans in a versatile dark wash. Crafted from stretch-denim for all-day comfort, they feature a modern silhouette that works for any occasion.',
      details: ['98% Cotton, 2% Elastane', 'Slim fit', 'Mid-rise', 'Zip fly'],
      reviews: [
        { id: 'r3', author: 'Casey L.', rating: 5, comment: 'The stretch is amazing. So comfortable and stylish.', date: '2023-06-01' },
      ],
    },
    {
      id: '3',
      slug: 'leather-biker-jacket',
      name: 'Leather Biker Jacket',
      category: 'Jackets',
      price: 249.99,
      badge: 'Nuevo',
      images: [
        getImage('product-3-a', 'Classic leather biker jacket', 'leather jacket'),
        getImage('product-3-b', 'Detail of biker jacket zipper', 'leather jacket'),
      ],
      description: 'An iconic piece with a modern edge. Made from supple, 100% lambskin leather, this biker jacket features asymmetrical zippers and a tailored fit for a timeless cool look.',
      details: ['100% Lambskin Leather', 'Asymmetrical zip closure', 'Multiple zip pockets', 'Professional leather clean only'],
      reviews: [
        { id: 'r4', author: 'Sam T.', rating: 5, comment: 'Investment piece that is totally worth it. The leather is like butter.', date: '2023-04-10' },
      ],
    },
    {
      id: '4',
      slug: 'chunky-knit-sweater',
      name: 'Chunky Knit Sweater',
      category: 'Knitwear',
      price: 59.99,
      originalPrice: 79.99,
      badge: 'Mega Promo',
      images: [
        getImage('product-4-a', 'Chunky knit wool sweater', 'wool sweater'),
      ],
      description: 'Stay cozy and chic in our chunky knit sweater. The oversized fit and warm wool blend make it the perfect companion for colder days.',
      details: ['80% Wool, 20% Nylon', 'Oversized fit', 'Ribbed cuffs and hem', 'Hand wash cold'],
      reviews: [],
    },
    {
      id: '5',
      slug: 'chelsea-boots',
      name: 'Chelsea Boots',
      category: 'Footwear',
      price: 99.99,
      originalPrice: 129.99,
      badge: 'Mega Promo',
      images: [
        getImage('product-5-a', 'Sleek black Chelsea boots', 'black boots'),
      ],
      description: 'The epitome of effortless style. Our Chelsea boots are crafted from genuine leather with elasticated side panels for a comfortable, slip-on design.',
      details: ['Leather upper and lining', 'Elastic side panels', 'Durable rubber sole', 'Made in Portugal'],
      reviews: [
        { id: 'r5', author: 'Morgan K.', rating: 5, comment: 'So versatile, I wear them with everything!', date: '2023-03-22' },
      ],
    },
    {
      id: '6',
      slug: 'modern-trench-coat',
      name: 'Modern Trench Coat',
      category: 'Jackets',
      price: 189.99,
      images: [
        getImage('product-6-a', 'Modern trench coat in beige', 'trench coat'),
      ],
      description: 'A contemporary take on a classic. This trench coat features a relaxed silhouette and is made from a water-resistant cotton blend, making it both stylish and practical.',
      details: ['65% Cotton, 35% Polyester', 'Water-resistant', 'Double-breasted front', 'Detachable belt'],
      reviews: [],
    },
    {
      id: '7',
      slug: 'silk-midi-dress',
      name: 'Silk Midi Dress',
      category: 'Dresses',
      price: 159.99,
      images: [
        getImage('product-7-a', 'Silk floral print midi dress', 'floral dress'),
      ],
      description: 'Elegant and feminine, this midi dress is cut from pure silk with a delicate floral print. It features a flattering V-neckline and a flowing skirt.',
      details: ['100% Silk', 'V-neckline', 'Midi length', 'Dry clean only'],
      reviews: [
        { id: 'r6', author: 'Riley J.', rating: 5, comment: 'Feels luxurious and the print is beautiful.', date: '2023-05-30' },
      ],
    },
    {
      id: '8',
      slug: 'linen-shirt',
      name: 'Linen Shirt',
      category: 'Tops',
      price: 69.99,
      images: [
        getImage('product-8-a', 'Linen button-down shirt', 'linen shirt'),
      ],
      description: 'The perfect shirt for warm weather. Made from 100% lightweight linen, it\'s breathable and has a relaxed, comfortable fit.',
      details: ['100% Linen', 'Button-down front', 'Chest pocket', 'Relaxed fit'],
      reviews: [],
    },
  ];
  

async function seed() {
  console.log("Seeding database with initial data...");

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const productsCollection = collection(db, "products");

  // Check if products already exist
  const existingProductsSnapshot = await getDocs(productsCollection);
  if (!existingProductsSnapshot.empty) {
    console.log("Products collection already contains data. Deleting existing data.");
    const batch = writeBatch(db);
    existingProductsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log("Existing products deleted.");
  }

  // Add new products
  try {
    for (const product of products) {
        // We are removing the id field as Firestore will generate one automatically.
        const { id, ...productData } = product; 
        await addDoc(productsCollection, productData);
    }
    console.log(`Successfully seeded ${products.length} products.`);
  } catch (error) {
    console.error("Error seeding database: ", error);
  }

  // The script will exit automatically when done.
  // We need to manually exit because the Firebase connection keeps the process alive.
  process.exit(0);
}

seed();
