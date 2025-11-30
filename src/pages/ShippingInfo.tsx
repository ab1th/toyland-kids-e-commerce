import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Truck, Package, Globe, Clock } from "lucide-react";
import { BackButton } from "@/components/BackButton";

const ShippingInfo = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-12">
          <BackButton />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">Shipping Information</h1>
            <p className="text-xl text-muted-foreground">
              Fast, reliable delivery to bring joy to your doorstep
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
              { icon: Package, title: "Safe Packaging", desc: "Securely wrapped for protection" },
              { icon: Globe, title: "Worldwide", desc: "We ship to many countries" },
              { icon: Clock, title: "Fast Delivery", desc: "3-5 business days standard" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-xl transition-shadow">
                  <item.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Shipping Methods</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-bold mb-2">Standard Shipping (3-5 business days)</h3>
                  <p className="text-muted-foreground">$5.99 flat rate, FREE on orders over $50</p>
                </div>
                <div className="border-l-4 border-secondary pl-4">
                  <h3 className="font-bold mb-2">Express Shipping (2-3 business days)</h3>
                  <p className="text-muted-foreground">$12.99 flat rate</p>
                </div>
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="font-bold mb-2">Overnight Shipping (1 business day)</h3>
                  <p className="text-muted-foreground">$24.99 flat rate</p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">International Shipping</h2>
              <p className="text-muted-foreground mb-4">
                We ship to Canada, UK, Australia, and select European countries. 
                International shipping rates are calculated at checkout based on destination and weight.
              </p>
              <p className="text-muted-foreground">
                <strong>Note:</strong> International orders may be subject to customs fees and import duties, 
                which are the responsibility of the customer.
              </p>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Order Processing</h2>
              <p className="text-muted-foreground">
                Orders are typically processed within 1-2 business days. You'll receive a confirmation email 
                when your order ships with tracking information. Processing times may be longer during holiday seasons.
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default ShippingInfo;
