import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

import { Product } from "@/data/products";

interface ProductCardProps extends Omit<Product, 'category' | 'description' | 'isBestSeller'> {}

export const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  rating,
  reviews,
  image,
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = isInWishlist(id);

  const handleAddToCart = () => {
    addToCart({ id, name, price, image });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ id, name, price, originalPrice, rating, reviews, image });
    }
  };

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden group cursor-pointer border-2 hover:border-primary hover:shadow-xl transition-all">
        <Link to={`/product/${id}`}>
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                {discount}% OFF
              </div>
            )}
          </div>
        </Link>

        <div className="p-4 space-y-3">
          <Link to={`/product/${id}`}>
            <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? "fill-secondary text-secondary"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({reviews})</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">${price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex-1"
            >
              <Button
                onClick={handleAddToCart}
                className="w-full rounded-full bg-primary hover:bg-primary-dark"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isAdded ? "Added!" : "Add to Cart"}
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                onClick={handleToggleWishlist}
                variant="outline"
                size="icon"
                className={`rounded-full border-2 ${
                  isWishlisted
                    ? "bg-accent border-accent text-white"
                    : "hover:border-accent"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
                />
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
