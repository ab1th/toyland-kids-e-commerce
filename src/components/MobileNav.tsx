import { Link, useLocation } from "react-router-dom";
import { Home, Grid, Heart, ShoppingCart, User } from "lucide-react";
import { motion } from "framer-motion";

export const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Grid, label: "Categories", path: "/categories" },
    { icon: Heart, label: "Wishlist", path: "/wishlist" },
    { icon: ShoppingCart, label: "Cart", path: "/cart" },
    { icon: User, label: "Account", path: "/account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={path} to={path} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center py-2"
              >
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    isActive ? "bg-primary text-white" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`text-xs mt-1 font-medium ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
