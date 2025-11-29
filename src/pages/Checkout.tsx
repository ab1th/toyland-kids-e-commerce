import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const Checkout = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert("Payment successful! 🎉");
      setIsProcessing(false);
    }, 2000);
  };

  const orderSummary = {
    items: [
      { name: "Super Hero Action Figure", price: 29.99, qty: 2 },
      { name: "Princess Castle Playset", price: 49.99, qty: 1 },
      { name: "LEGO Space Station", price: 59.99, qty: 1 },
    ],
    subtotal: 169.96,
    shipping: 0,
    total: 169.96,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
            <div className="flex items-center justify-center gap-2 text-success">
              <Lock className="h-4 w-4" />
              <span className="text-sm">256-bit SSL Encrypted</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  Delivery Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input placeholder="John Doe" className="rounded-xl" />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input placeholder="+1 234 567 8900" className="rounded-xl" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Street Address</Label>
                    <Input placeholder="123 Main Street" className="rounded-xl" />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input placeholder="New York" className="rounded-xl" />
                  </div>
                  <div>
                    <Label>State / Province</Label>
                    <Input placeholder="NY" className="rounded-xl" />
                  </div>
                  <div>
                    <Label>ZIP / Postal Code</Label>
                    <Input placeholder="10001" className="rounded-xl" />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input placeholder="United States" className="rounded-xl" />
                  </div>
                </div>
              </Card>

              {/* Payment Details */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Payment Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label>Cardholder Name</Label>
                    <Input placeholder="John Doe" className="rounded-xl" />
                  </div>
                  <div>
                    <Label>Card Number</Label>
                    <div className="relative">
                      <Input
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="rounded-xl pr-12"
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Expiry Date</Label>
                      <Input placeholder="MM/YY" maxLength={5} className="rounded-xl" />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input
                        placeholder="123"
                        maxLength={3}
                        type="password"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {orderSummary.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x{item.qty}
                      </span>
                      <span className="font-semibold">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">
                        ${orderSummary.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold text-success">FREE</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${orderSummary.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full rounded-full bg-primary hover:bg-primary-dark"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          ⏳
                        </motion.div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        Complete Payment
                      </>
                    )}
                  </Button>
                </motion.div>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Secure payment processed by ToyLand</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Checkout;
