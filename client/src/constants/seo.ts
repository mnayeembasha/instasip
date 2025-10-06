import { DOMAIN } from "@/config";

export const SEO_CONFIG: Record<
  string,
  { title: string; description: string; path: string }
> = {
  "/": {
    title: "InstaSip | Ready-to-Use Organic Tea & Coffee",
    description:
      "Enjoy eco-friendly ready-to-use tea and coffee cups by InstaSip. Just add hot water — no mess, no strainers, pure taste!",
    path: `${DOMAIN}/`,
  },
  "/login": {
    title: "Login | InstaSip",
    description:
      "Login to your InstaSip account to explore our latest tea and coffee collections, manage your orders, and more.",
    path: `${DOMAIN}/login`,
  },
  "/signup": {
    title: "Sign Up | InstaSip",
    description:
      "Create your InstaSip account to enjoy eco-friendly instant tea and coffee products. Sign up now for exclusive offers!",
    path: `${DOMAIN}/signup`,
  },
  "/products": {
    title: "InstaSip Products",
    description:
      "Discover InstaSip’s wide range of ready-to-use tea and coffee cups. Herbal, green tea, premix coffee, and more — fresh taste made simple.",
    path: `${DOMAIN}/products`,
  },
};

export const productSEO = {
  // 🌿 Pre-Mix Products
  "masala-tea": {
    title: "Masala Tea - InstaSip",
    description:
      "Experience the rich flavor of InstaSip Masala Tea — ready-to-use, aromatic, and made from natural ingredients.",
    canonical: `${DOMAIN}/products/masala-tea`,
    image:
      "https://res.cloudinary.com/drzq4285d/image/upload/v1759487448/instasip/lkjopeknfhhx3vfce6ap.jpg",
  },
  coffee: {
    title: "Coffee - InstaSip",
    description:
      "Enjoy the bold taste of InstaSip Coffee — pure, instant, and eco-friendly. Just add hot water and sip!",
    canonical: `${DOMAIN}/products/coffee`,
    image:
      "https://res.cloudinary.com/drzq4285d/image/upload/v1759487431/instasip/n67g3hlumuutxtrq96hw.jpg",
  },
  "lemon-tea": {
    title: "Lemon Tea - InstaSip",
    description:
      "Refresh yourself with InstaSip Lemon Tea — a zesty, ready-to-use drink that energizes your day.",
    canonical: `${DOMAIN}/products/lemon-tea`,
    image:
      "https://res.cloudinary.com/drzq4285d/image/upload/v1759487405/instasip/i7vacfkhpncjmibufu5l.jpg",
  },

  // 🍃 Green Tea Products
  "pomegranate-flavoured-green-tea": {
    title: "Pomegranate Flavoured Green Tea - InstaSip",
    description:
      "Indulge in the fruity delight of InstaSip Pomegranate Green Tea — antioxidant-rich and refreshing.",
    canonical: `${DOMAIN}/products/pomegranate-flavoured-green-tea`,
    image:
      "https://res.cloudinary.com/drzq4285d/image/upload/v1759487382/instasip/ddwxuzan8zph3efgqccj.jpg",
  },
  "mint-flavoured-green-tea": {
    title: "Mint Flavoured Green Tea - InstaSip",
    description:
      "Rejuvenate with InstaSip Mint Green Tea — a cool, refreshing blend of mint and natural green tea.",
    canonical: `${DOMAIN}/products/mint-flavoured-green-tea`,
    image:
      "https://res.cloudinary.com/drzq4285d/image/upload/v1759487351/instasip/n5cqakcr6z0tsqrew4nk.jpg",
  },
  "ginger-lemon-flavoured-green-tea": {
    title: "Ginger Lemon Flavoured Green Tea - InstaSip",
    description:
      "Boost your immunity with InstaSip Ginger Lemon Green Tea — a soothing and zesty fusion of health and taste.",
    canonical: `${DOMAIN}/products/ginger-lemon-flavoured-green-tea`,
    image:
      `https://res.cloudinary.com/drzq4285d/image/upload/v1759487329/instasip/v0seuojdg54ss0x7i0mm.jpg`
  },
};
