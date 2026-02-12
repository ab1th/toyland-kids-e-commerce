import { Heart, ShoppingCart, Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useState } from "react";

export const Header = () => {
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          ✨ Free Shipping on Orders Over $50 | 🎁 New Arrivals Every Week!
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="text-3xl">🧸</div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ToyLand
                </h1>
                <p className="text-xs text-muted-foreground">Where Fun Begins!</p>
              </div>
            </motion.div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Input
                placeholder="Search for toys, games, and more..."
                className="rounded-full pr-12 border-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-8 w-8"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link to="/wishlist">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Heart className="h-5 w-5" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Button>
              </motion.div>
            </Link>

            <Link to="/cart">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </motion.div>
            </Link>

            <Link to="/account">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 py-3 overflow-x-auto">
            <Link to="/categories">
              <Button variant="ghost" size="sm" className="whitespace-nowrap">
                <Menu className="h-4 w-4 mr-2" />
                All Categories
              </Button>
            </Link>
            {["Action Figures", "Building Blocks", "Educational", "Plush Toys", "Board Games"].map((cat) => (
              <Link key={cat} to={`/category/${cat.toLowerCase().replace(/ /g, "-")}`}>
                <Button variant="ghost" size="sm" className="whitespace-nowrap hover:text-primary">
                  {cat}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
