import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  const orderNumber = `TOY${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="h-16 w-16 text-success" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mb-3"
              >
                Order Placed Successfully! 🎉
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-8"
              >
                Thank you for shopping with ToyLand! Your order has been received and is being processed.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-muted/50 rounded-xl p-6 mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-bold text-lg">{orderNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated Delivery</span>
                  <span className="font-semibold">3-5 Business Days</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4 mb-8"
              >
                <div className="flex items-center gap-4 p-4 bg-card rounded-lg border-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold">Order Confirmed</h3>
                    <p className="text-sm text-muted-foreground">We've received your order</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Truck className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-muted-foreground">Shipping Soon</h3>
                    <p className="text-sm text-muted-foreground">You'll receive a tracking number</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex gap-4 justify-center"
              >
                <Link to="/">
                  <Button size="lg" className="rounded-full bg-primary hover:bg-primary-dark">
                    <Home className="mr-2 h-5 w-5" />
                    Continue Shopping
                  </Button>
                </Link>
                <Link to="/account">
                  <Button size="lg" variant="outline" className="rounded-full border-2">
                    View Orders
                  </Button>
                </Link>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default OrderSuccess;
