import { Link } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";

export const Header = () => {
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(5);

  return (
    <header className="sticky top-0 z-50 bg-card shadow-md">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">🧸</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
                ToyLand
              </span>
            </motion.div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for toys, games, and more..."
                className="pl-4 pr-12 py-6 rounded-full border-2 border-border focus:border-primary transition-colors"
              />
              <Button
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-primary hover:bg-primary-dark"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <Link to="/wishlist">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Heart className="h-6 w-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </motion.div>
            </Link>

            <Link to="/cart">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </motion.div>
            </Link>

            <Link to="/account">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-6 w-6" />
                </Button>
              </motion.div>
            </Link>

            <Button variant="ghost" size="icon" className="md:hidden rounded-full">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-4 md:hidden">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search toys..."
              className="pl-4 pr-12 py-5 rounded-full border-2"
            />
            <Button
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <nav className="hidden md:flex items-center gap-6 pb-4 overflow-x-auto">
          {["Action Figures", "Dolls", "Board Games", "LEGO", "Educational", "Outdoor"].map((category) => (
            <Link key={category} to={`/category/${category.toLowerCase().replace(" ", "-")}`}>
              <motion.span
                whileHover={{ scale: 1.05, color: "hsl(var(--primary))" }}
                className="text-sm font-medium whitespace-nowrap cursor-pointer transition-colors"
              >
                {category}
              </motion.span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
