import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 bg-[var(--background)]">
      {/* Animated Shopping Bag Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-6"
      >
        <div className="p-6 rounded-full bg-white border-4 border-[var(--primary)] shadow-md">
          <ShoppingBag size={64} className="text-[var(--primary)]" />
        </div>
      </motion.div>

      {/* Text Section */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--accent)] mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-[var(--secondary)] mb-6 max-w-md">
          Looks like you haven’t added anything to your cart yet.  
          Discover amazing products and start shopping today!
        </p>

        {/* Start Shopping Button */}
        <Link
          to="/products"
          className="inline-block bg-[var(--primary)] text-white hover:bg-[var(--accent)] transition-all px-6 py-3 rounded-full font-medium text-lg shadow-md hover:shadow-lg"
        >
          Start Shopping
        </Link>
      </motion.div>
    </div>
  );
}
