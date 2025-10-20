import { IconHome, IconArrowLeft, IconError404 } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6 pt-24">
      {/* Animated 404 Icon Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center space-y-6"
      >
        {/* 404 Icon */}
        <div className="p-8 bg-[var(--primary)]/10 rounded-full shadow-inner flex items-center justify-center">
          <IconError404
            size={96}
            stroke={1.5}
            className="text-[var(--primary)]"
          />
        </div>

        {/* Main Heading */}
        {/*<h1 className="text-6xl md:text-7xl font-extrabold text-[var(--accent)]">
          404
        </h1>
*/}
        {/* Subheading */}
        <h2 className="text-3xl tracking-tight md:text-4xl text-[var(--primary)]">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-[var(--secondary)] text-lg max-w-lg mx-auto leading-relaxed">
          Oops! The page you’re looking for doesn’t exist, was moved, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-2 w-full">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto bg-transparent hover:bg-[var(--secondary)]/10 text-[var(--accent)] font-semibold py-2 px-6 rounded-full border border-[var(--secondary)] transition-all flex items-center justify-center gap-2"
          >
            <IconArrowLeft size={20} />
            Go Back
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto bg-[var(--primary)] hover:bg-[var(--accent)] text-white font-semibold py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <IconHome size={20} />
            Home Page
          </Link>
        </div>

        {/* Contact Message */}
        <p className="text-sm text-[var(--secondary)] mt-2">
          Think this is a mistake?{" "}
          <Link
            to="/contact"
            className="text-[var(--primary)] font-medium hover:underline"
          >
            Contact us
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default NotFound;
