import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { X, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BackButton } from "@/components/BackButton";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Super Hero Action Figure Deluxe Set", price: 29.99, quantity: 2, image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200&h=200&fit=crop" },
    { id: 2, name: "Princess Castle Playset with Lights", price: 49.99, quantity: 1, image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=200&h=200&fit=crop" },
    { id: 3, name: "LEGO Space Station Building Kit", price: 59.99, quantity: 1, image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop" },
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <BackButton />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
            </div>
            <p className="text-muted-foreground">{cartItems.length} items in your cart</p>
          </motion.div>

          {cartItems.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some toys to get started!</p>
              <Link to="/">
                <Button className="rounded-full">Continue Shopping</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2 mb-2">
                            <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-destructive flex-shrink-0"
                            >
                              <X className="h-5 w-5" />
                            </motion.button>
                          </div>

                          <p className="text-xl font-bold text-primary mb-3">
                            ${item.price.toFixed(2)}
                          </p>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center border-2 rounded-full overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-3 py-1 hover:bg-muted transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-1 font-bold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-3 py-1 hover:bg-muted transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Total: ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <Card className="p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? (
                          <span className="text-success">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                      </p>
                    )}
                    <div className="border-t pt-4 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link to="/checkout">
                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button size="lg" className="w-full rounded-full bg-primary hover:bg-primary-dark">
                          Proceed to Checkout
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </motion.div>
                    </Link>
                    <Link to="/">
                      <Button size="lg" variant="outline" className="w-full rounded-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-muted/50">
                    <p className="text-sm font-medium mb-2">Have a coupon?</p>
                    <div className="flex gap-2">
                      <Input placeholder="Enter code" className="rounded-full" />
                      <Button variant="outline" className="rounded-full">Apply</Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Cart;
