import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <footer className="bg-card border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">About ToyLand</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your magical destination for the best toys, games, and fun! We bring smiles to children worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              {["About Us", "Contact", "FAQs", "Shipping Info", "Returns"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/ /g, "-")}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Categories</h3>
            <ul className="space-y-2">
              {["Action Figures", "Dolls", "Board Games", "LEGO", "Educational"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/category/${item.toLowerCase().replace(/ /g, "-")}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Follow Us</h3>
            <div className="flex gap-3">
              {[
                { icon: Facebook, color: "#1877F2" },
                { icon: Instagram, color: "#E4405F" },
                { icon: Twitter, color: "#1DA1F2" },
                { icon: Youtube, color: "#FF0000" },
              ].map(({ icon: Icon, color }, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:shadow-lg transition-shadow"
                  style={{ color }}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ToyLand. All rights reserved. Made with ❤️ for kids everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};
