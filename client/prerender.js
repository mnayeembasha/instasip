import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { fileURLToPath } from "url";

// Import your pages
import Home from "./src/pages/Home.tsx";
import Products from "./src/pages/Products.tsx";
import ProductDetails from "./src/pages/ProductDetails.tsx";
import Login from "./src/pages/Login.tsx";
import SignUp from "./src/pages/SignUp.tsx";
import Contact from "./src/pages/Contact.tsx";
import Cart from "./src/pages/Cart.tsx";
import Profile from "./src/pages/Profile.tsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, "dist");

// Ensure dist exists
if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });

// Utility to write HTML
function writeHtml(filename, html) {
  const fullPath = path.join(DIST_DIR, filename);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, html, "utf-8");
}

// 1️⃣ Home page
const homeHtml = ReactDOMServer.renderToStaticMarkup(React.createElement(Home));
writeHtml("index.html", `<!DOCTYPE html>${homeHtml}`);

// 2️⃣ Products main page
const productsHtml = ReactDOMServer.renderToStaticMarkup(React.createElement(Products));
writeHtml("products/index.html", `<!DOCTYPE html>${productsHtml}`);

// 3️⃣ ProductDetails pages for each product
const productSlugs = [
  "pomegranate-flavoured-green-tea",
  "ginger-lemon-flavoured-green-tea",
  "mint-flavoured-green-tea",
  "lemon-tea",
  "masala-tea",
  "coffee",
];

for (const slug of productSlugs) {
  const html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(ProductDetails, { slug })
  );
  writeHtml(`products/${slug}.html`, `<!DOCTYPE html>${html}`);
}

// 4️⃣ Login page
const loginHtml = ReactDOMServer.renderToStaticMarkup(React.createElement(Login));
writeHtml("login.html", `<!DOCTYPE html>${loginHtml}`);

// 5️⃣ SignUp page
const signUpHtml = ReactDOMServer.renderToStaticMarkup(React.createElement(SignUp));
writeHtml("signup.html", `<!DOCTYPE html>${signUpHtml}`);

// 6️⃣ Contact page
const contactHtml = ReactDOMServer.renderToStaticMarkup(React.createElement(Contact));
writeHtml("contact.html", `<!DOCTYPE html>${contactHtml}`);

// 7️⃣ Cart page
const cartHtml = ReactDOMServer.renderToStaticMarkup(React.createElement(Cart));
writeHtml("cart.html", `<!DOCTYPE html>${cartHtml}`);

// 8️⃣ Profile page
const profileHtml = ReactDOMServer.renderToStaticMarkup(React.createElement(Profile));
writeHtml("profile.html", `<!DOCTYPE html>${profileHtml}`);

console.log("✅ Prerendering complete!");
