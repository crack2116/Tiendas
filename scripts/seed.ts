import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config';
import placeholderImagesData from '../src/lib/placeholder-images.json';

if (!firebaseConfig.projectId) {
  console.error("Firebase project ID is not defined in your firebase/config.ts file.");
  process.exit(1);
}

const { placeholderImages } = placeholderImagesData;

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
