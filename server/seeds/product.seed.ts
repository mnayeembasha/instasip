import { connectDB } from "../lib/db";
import { Product } from "../models/Product";

const preMixProducts = [
  {
    name: "Masala Tea",
    price: 20,
    description:
      "A flavorful blend of premium Assam tea infused with traditional Indian spices like cardamom, cinnamon, and cloves. This aromatic masala tea offers a perfect balance of warmth and spice, making it an ideal companion for chilly mornings or evening breaks. Just add hot water and enjoy a café-style cup instantly.",
    image: "https://cupji.com/cdn/shop/files/Namitafavourite_600x.jpg?v=1737123784",
    stock: 100,
    category: "premix-products",
  },
  {
    name: "Coffee",
    price: 25,
    description:
      "A rich and creamy premix coffee crafted from high-quality beans for an indulgent café experience anytime, anywhere. Smooth in texture and bold in flavor, this instant coffee delivers the perfect morning boost or a relaxing mid-day sip. Just add hot water for a consistent, frothy cup of joy.",
    image: "https://cupji.com/cdn/shop/files/CupJi_Premix_RW-02_600x600.jpg?v=1757736159",
    stock: 75,
    category: "premix-products",
  },
  {
    name: "Cardamom Tea",
    price: 18,
    description:
      "Experience the soothing taste of cardamom blended with premium tea leaves. This refreshing premix tea brings a delicate sweetness and subtle spice that calms the senses while energizing the mind. Easy to prepare, it’s perfect for busy mornings or relaxing evenings with friends and family.",
    image: "https://cupji.com/cdn/shop/files/26812_V-03_1_600x600.jpg?v=1757686218",
    stock: 100,
    category: "premix-products",
  },
];

const greenTeaProducts = [
  {
    name: "Pomegranate",
    price: 22,
    description:
      "A revitalizing green tea infused with the natural sweetness and tartness of pomegranate. Packed with antioxidants, this refreshing blend not only boosts immunity but also helps in hydration and weight management. A perfect fruity twist to your daily tea ritual.",
    image: "https://cupji.com/cdn/shop/files/A7406587_600x600.jpg?v=1717648757",
    stock: 50,
    category: "green-tea-products",
  },
  {
    name: "Mint",
    price: 20,
    description:
      "Cool, refreshing, and rejuvenating—this mint green tea combines the freshness of mint leaves with the delicate taste of green tea. Known for aiding digestion and soothing the senses, it makes for a perfect after-meal beverage or a relaxing evening drink.",
    image: "https://cupji.com/cdn/shop/files/A7406588_600x.jpg?v=1717648154",
    stock: 100,
    category: "green-tea-products",
  },
  {
    name: "Ginger Lemon",
    price: 24,
    description:
      "An invigorating blend of green tea infused with zesty lemon and spicy ginger. This refreshing drink is packed with antioxidants, supports digestion, boosts metabolism, and provides a natural energy lift. A vibrant cup to kickstart your day or refresh during long work hours.",
    image: "https://cupji.com/cdn/shop/files/LEmonginger4_600x.jpg?v=1737116431",
    stock: 75,
    category: "green-tea-products",
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    console.log("✅ Existing products cleared.");

    const allProducts = [...preMixProducts, ...greenTeaProducts];

    for (const productData of allProducts) {
      await Product.create(productData);
      console.log(`✅ Product "${productData.name}" created with slug.`);
    }

    console.log("🎉 All products seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedProducts();
