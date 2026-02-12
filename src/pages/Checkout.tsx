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
import { BackButton } from "@/components/BackButton";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Checkout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", zip: "", country: "",
    cardName: "", cardNumber: "", expiry: "", cvv: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = totalPrice > 50 ? 0 : 5.99;
  const finalTotal = totalPrice + shipping;

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.street.trim()) e.street = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    if (!form.country.trim()) e.country = "Required";
    if (!form.cardName.trim()) e.cardName = "Required";
    if (!form.cardNumber.replace(/\s/g, "").match(/^\d{13,19}$/)) e.cardNumber = "Enter a valid card number";
    if (!form.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) e.expiry = "Use MM/YY format";
    if (!form.cvv.match(/^\d{3,4}$/)) e.cvv = "Enter 3 or 4 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePayment = () => {
    if (items.length === 0) {
      toast({ title: "Cart is empty", description: "Add items before checking out.", variant: "destructive" });
      return;
    }
    if (!validate()) {
      toast({ title: "Please fix the errors", description: "Fill in all required fields.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      navigate("/order-success");
    }, 2000);
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-sm text-destructive mt-1">{errors[field]}</p> : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <BackButton />
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
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                  Delivery Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input placeholder="John Doe" className="rounded-xl" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
                    <FieldError field="fullName" />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input placeholder="+1 234 567 8900" className="rounded-xl" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                    <FieldError field="phone" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Street Address</Label>
                    <Input placeholder="123 Main Street" className="rounded-xl" value={form.street} onChange={(e) => update("street", e.target.value)} />
                    <FieldError field="street" />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input placeholder="New York" className="rounded-xl" value={form.city} onChange={(e) => update("city", e.target.value)} />
                    <FieldError field="city" />
                  </div>
                  <div>
                    <Label>State / Province</Label>
                    <Input placeholder="NY" className="rounded-xl" value={form.state} onChange={(e) => update("state", e.target.value)} />
                    <FieldError field="state" />
                  </div>
                  <div>
                    <Label>ZIP / Postal Code</Label>
                    <Input placeholder="10001" className="rounded-xl" value={form.zip} onChange={(e) => update("zip", e.target.value)} />
                    <FieldError field="zip" />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input placeholder="United States" className="rounded-xl" value={form.country} onChange={(e) => update("country", e.target.value)} />
                    <FieldError field="country" />
                  </div>
                </div>
              </Card>

              {/* Payment Details */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                  Payment Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label>Cardholder Name</Label>
                    <Input placeholder="John Doe" className="rounded-xl" value={form.cardName} onChange={(e) => update("cardName", e.target.value)} />
                    <FieldError field="cardName" />
                  </div>
                  <div>
                    <Label>Card Number</Label>
                    <div className="relative">
                      <Input placeholder="1234 5678 9012 3456" maxLength={19} className="rounded-xl pr-12" value={form.cardNumber} onChange={(e) => update("cardNumber", e.target.value)} />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                    <FieldError field="cardNumber" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Expiry Date</Label>
                      <Input placeholder="MM/YY" maxLength={5} className="rounded-xl" value={form.expiry} onChange={(e) => update("expiry", e.target.value)} />
                      <FieldError field="expiry" />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input placeholder="123" maxLength={4} type="password" className="rounded-xl" value={form.cvv} onChange={(e) => update("cvv", e.target.value)} />
                      <FieldError field="cvv" />
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
                  {items.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">Your cart is empty</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))
                  )}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? <span className="text-success">FREE</span> : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="border-t pt-4 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${finalTotal.toFixed(2)}</span>
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
