import { connectDB } from "../lib/db";
import { Product } from "../models/Product";

const preMixProducts = [
  {
    name: "Masala Tea",
    price: 20,
    description: "A flavorful blend of tea with traditional Indian spices for a warm, aromatic experience.",
    image: "https://cupji.com/cdn/shop/files/Namitafavourite_600x.jpg?v=1737123784",
    stock: 100,
    category: "premix-products"
  },
  {
    name: "Coffee",
    price: 25,
    description: "Rich and smooth premix coffee, perfect for your morning boost.",
    image: "https://cupji.com/cdn/shop/files/CupJi_Premix_RW-02_600x600.jpg?v=1757736159",
    stock: 75,
    category: "premix-products"
  },
  {
    name: "Cardamom Tea",
    price: 18,
    description: "A refreshing tea infused with aromatic cardamom for a unique taste.",
    image: "https://cupji.com/cdn/shop/files/26812_V-03_1_600x600.jpg?v=1757686218",
    stock: 100,
    category: "premix-products"
  }
];

const greenTeaProducts = [
  {
    name: "Pomegranate",
    price: 22,
    description: "Refreshing green tea with natural pomegranate flavor to energize your day.",
    image: "https://cupji.com/cdn/shop/files/A7406587_600x600.jpg?v=1717648757",
    stock: 50,
    category: "green-tea-products"
  },
  {
    name: "Mint",
    price: 20,
    description: "Cooling green tea with mint essence, perfect for a refreshing break.",
    image: "https://cupji.com/cdn/shop/files/A7406588_600x.jpg?v=1717648154",
    stock: 100,
    category: "green-tea-products"
  },
  {
    name: "Ginger Lemon",
    price: 24,
    description: "Invigorating green tea with ginger and lemon for a zesty twist.",
    image: "https://cupji.com/cdn/shop/files/LEmonginger4_600x.jpg?v=1737116431",
    stock: 75,
    category: "green-tea-products"
  }
];

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log("Existing products cleared.");

    // Insert new products
    const allProducts = [...preMixProducts, ...greenTeaProducts];
    await Product.insertMany(allProducts);
    console.log("Products seeded successfully!");

    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

// seedProducts();
