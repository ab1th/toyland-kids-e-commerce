import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { X, ShoppingCart, Heart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";


const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-8 w-8 text-accent fill-accent" />
              <h1 className="text-3xl font-bold">My Wishlist</h1>
            </div>
            <p className="text-muted-foreground">
              {items.length} items saved for later
            </p>
          </motion.div>

          {items.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start adding your favorite toys to your wishlist!
              </p>
              <Button className="rounded-full">Start Shopping</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex gap-4 p-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-muted-foreground hover:text-destructive flex-shrink-0"
                          >
                            <X className="h-5 w-5" />
                          </motion.button>
                        </div>

                        <p className="text-xl font-bold text-primary mb-3">${item.price}</p>

                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button 
                            size="sm" 
                            className="w-full rounded-full bg-primary hover:bg-primary-dark"
                            onClick={() => {
                              addToCart({ id: item.id, name: item.name, price: item.price, image: item.image });
                              removeFromWishlist(item.id);
                            }}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Move to Cart
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Wishlist;
