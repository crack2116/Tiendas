
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from '../src/firebase/config';
import placeholderImagesData from '../src/lib/placeholder-images.json';

// Initialize Firebase Admin SDK
try {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: firebaseConfig.projectId,
    });
} catch (error: any) {
    if (error.code !== 'app/duplicate-app') {
        console.error('Firebase admin initialization error', error);
        process.exit(1);
    }
}


const { placeholderImages } = placeholderImagesData;

const getImageUrl = (id: string) => {
    const image = placeholderImages.find(img => img.id === id);
    if (image) {
        // Construct the Firebase Storage URL from the image path
        const imageName = image.imageUrl.split('/').pop()?.split('?')[0];
        if (imageName) {
            // This creates a predictable URL based on the file name for Firebase Storage.
            // Note: The actual images need to be uploaded to this path in your Storage bucket.
            return `https://storage.googleapis.com/${firebaseConfig.storageBucket}/products%2F${imageName}`;
        }
    }
    return 'https://storage.googleapis.com/tienda-1247d.appspot.com/products%2Fdefault.jpg';
}


const getImage = (id: string, description: string, hint: string) => {
    const image = placeholderImages.find(img => img.id === id);
    return {
      id,
      url: getImageUrl(id),
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
    {
      id: '9',
      slug: 'eau-de-parfum-aura',
      name: 'Eau de Parfum "Aura"',
      category: 'Perfumería',
      price: 125.00,
      images: [
        getImage('product-9-a', 'Elegant perfume bottle with a golden cap', 'perfume bottle'),
      ],
      description: 'Una fragancia cautivadora y misteriosa con notas de jazmín, ámbar y maderas exóticas. "Aura" es un perfume que deja una estela inolvidable, perfecto para ocasiones especiales.',
      details: ['100ml', 'Eau de Parfum', 'Familia Olfativa: Oriental Floral', 'Larga duración'],
      reviews: [
        { id: 'r7', author: 'Sofia C.', rating: 5, comment: 'Absolutamente divino. Dura todo el día y recibo muchos cumplidos.', date: '2023-07-10' },
      ],
    },
    {
      id: '10',
      slug: 'crema-facial-hidratante-aqua',
      name: 'Crema Facial Hidratante "Aqua"',
      category: 'Rostro',
      price: 75.50,
      badge: 'Más Vendido',
      images: [
        getImage('product-10-a', 'White jar of moisturizing face cream', 'face cream'),
      ],
      description: 'Hidratación intensa por 24 horas. Nuestra crema "Aqua" con ácido hialurónico y extractos botánicos deja la piel suave, tersa y radiante, sin sensación grasa.',
      details: ['50ml', 'Para todo tipo de piel', 'Con Ácido Hialurónico', 'Dermatológicamente probada'],
      reviews: [],
    },
    {
      id: '11',
      slug: 'shampoo-reparador-seda',
      name: 'Shampoo Reparador "Seda"',
      category: 'Cabello',
      price: 45.00,
      images: [
        getImage('product-11-a', 'Amber colored bottle of repairing shampoo', 'shampoo bottle'),
      ],
      description: 'Devuélvele la vida a tu cabello. El shampoo "Seda" con aceite de argán y keratina repara el daño, reduce el frizz y aporta un brillo espectacular desde la primera lavada.',
      details: ['400ml', 'Sin sulfatos ni parabenos', 'Para cabello seco o dañado', 'Con Aceite de Argán'],
      reviews: [
        { id: 'r8', author: 'Lucia M.', rating: 5, comment: 'Mi cabello nunca ha estado tan suave. ¡Lo amo!', date: '2023-06-25' },
      ],
    },
    {
      id: '12',
      slug: 'locion-corporal-nube',
      name: 'Loción Corporal "Nube"',
      category: 'Cuerpo',
      price: 55.00,
      images: [
        getImage('product-12-a', 'Minimalist bottle of body lotion', 'body lotion'),
      ],
      description: 'Una caricia para tu piel. La loción "Nube" se absorbe rápidamente, dejando la piel hidratada, suave y con un ligero aroma a flores blancas. Enriquecida con manteca de karité.',
      details: ['350ml', 'Absorción rápida', 'Aroma floral ligero', 'Con Manteca de Karité'],
      reviews: [],
    },
    {
      id: '13',
      slug: 'labial-mate-pasion',
      name: 'Labial Mate "Pasión"',
      category: 'Maquillaje',
      price: 35.00,
      originalPrice: 45.00,
      badge: 'Oferta',
      images: [
        getImage('product-13-a', 'Vibrant red matte lipstick', 'red lipstick'),
      ],
      description: 'Un rojo clásico que nunca falla. Nuestro labial "Pasión" tiene un acabado mate aterciopelado, es de larga duración y no reseca los labios. El arma secreta para un look impactante.',
      details: ['Acabado mate', 'Larga duración', 'Color: Rojo Pasión', 'No testeado en animales'],
      reviews: [
        { id: 'r9', author: 'Valeria G.', rating: 5, comment: 'El rojo perfecto. Cómodo y dura horas intacto.', date: '2023-08-01' },
      ],
    },
    {
      id: '14',
      slug: 'paleta-sombras-tierra',
      name: 'Paleta de Sombras "Tierra"',
      category: 'Maquillaje',
      price: 95.00,
      badge: 'Nuevo',
      images: [
        getImage('product-14-a', 'Eyeshadow palette with warm, earthy tones', 'eyeshadow palette'),
      ],
      description: 'Crea looks naturales o ahumados con la paleta "Tierra". Incluye 12 sombras de alta pigmentación en tonos neutros y cálidos, con acabados mate y satinados.',
      details: ['12 colores', 'Alta pigmentación', 'Incluye espejo', 'Fórmula fácil de difuminar'],
      reviews: [],
    },
    {
      id: '15',
      slug: 'exfoliante-corporal-renacer',
      name: 'Exfoliante Corporal "Renacer"',
      category: 'Cuerpo',
      price: 65.00,
      images: [
        getImage('product-15-a', 'Exfoliating body scrub in a glass jar', 'body scrub'),
      ],
      description: 'Piel nueva y luminosa. El exfoliante "Renacer" con cristales de azúcar y aceite de coco elimina las células muertas, dejando tu piel increíblemente suave y renovada.',
      details: ['250g', 'Con Cristales de Azúcar y Aceite de Coco', 'Estimula la circulación', 'Piel suave y renovada'],
      reviews: [],
    },
    {
      id: '16',
      slug: 'aceite-capilar-oro',
      name: 'Aceite Capilar "Oro"',
      category: 'Cabello',
      price: 85.00,
      images: [
        getImage('product-16-a', 'Luxurious hair oil in a clear bottle', 'hair oil'),
      ],
      description: 'Un tratamiento de lujo para tu cabello. Nuestro aceite "Oro" es una mezcla de 7 aceites naturales que nutre, repara y protege, controlando el frizz y aportando un brillo sublime sin apelmazar.',
      details: ['75ml', 'Con 7 aceites naturales', 'Control de frizz y brillo', 'Protección térmica'],
      reviews: [
        { id: 'r10', author: 'Daniela F.', rating: 5, comment: 'Unas pocas gotas son suficientes. Huele increíble y deja el pelo genial.', date: '2023-07-20' },
      ],
    }
  ];
  

async function seed() {
  console.log("Seeding database with initial data...");

  const db = getFirestore();
  const productsCollection = db.collection("products");

  // Check if products already exist
  const existingProductsSnapshot = await productsCollection.get();
  if (!existingProductsSnapshot.empty) {
    console.log("Products collection already contains data. Deleting existing data.");
    const batch = db.batch();
    existingProductsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log("Existing products deleted.");
  }

  // Add new products
  try {
    const batch = db.batch();
    for (const product of products) {
        // We are removing the id field as Firestore will generate one automatically.
        const { id, ...productData } = product;
        const docRef = productsCollection.doc(); // Let Firestore generate the ID
        batch.set(docRef, productData);
    }
    await batch.commit();
    console.log(`Successfully seeded ${products.length} products.`);
  } catch (error) {
    console.error("Error seeding database: ", error);
  }

  console.log("Seeding complete.");
  // The script will exit automatically when all async operations are done.
}

seed().catch(error => {
    console.error("Unhandled error in seed script: ", error);
    process.exit(1);
});

    