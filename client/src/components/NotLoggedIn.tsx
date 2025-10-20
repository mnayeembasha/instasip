import { Button } from "@/components/ui/button";
import { IconUserExclamation } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotLoggedIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 pt-20 text-center">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center space-y-6 max-w-lg"
      >
        {/* Icon Section */}
        <div className="p-6 bg-[var(--primary)]/10 rounded-full shadow-inner">
          <IconUserExclamation
            size={80}
            stroke={1.5}
            className="text-[var(--primary)]"
          />
        </div>

        {/* Title */}
        <h1 className="tracking-tight text-3xl text-[var(--accent)]">
          You’re Not Logged In
        </h1>

        {/* Description */}
        <p className="text-[var(--secondary)] leading-relaxed text-base max-w-md">
          Please log in to access your profile, manage your orders, and enjoy a
          personalized shopping experience tailored just for you.
        </p>

        {/* CTA Button */}
        <Link to="/login?redirect=/profile" className="block w-full max-w-sm">
          <Button className="w-full bg-[var(--primary)] text-white hover:bg-[var(--accent)] text-lg py-6 rounded-full shadow-md hover:shadow-lg transition-all">
            Login to Continue
          </Button>
        </Link>

        {/* Optional Subtext */}
        <p className=" text-[var(--secondary)] mt-1">
          New here?{" "}
          <Link
            to="/signup"
            className="text-[var(--primary)]  hover:underline"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
