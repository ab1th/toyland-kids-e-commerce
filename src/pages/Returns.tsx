import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { RefreshCw, Package, CheckCircle, XCircle } from "lucide-react";
import { BackButton } from "@/components/BackButton";

const Returns = () => {
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
            <h1 className="text-5xl font-bold mb-4">Returns & Refunds</h1>
            <p className="text-xl text-muted-foreground">
              We want you to be completely satisfied with your purchase
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: RefreshCw, title: "30-Day Returns", desc: "Easy returns within 30 days" },
              { icon: Package, title: "Free Returns", desc: "On defective items" },
              { icon: CheckCircle, title: "Quick Refunds", desc: "Processed within 5-7 days" },
              { icon: XCircle, title: "No Hassle", desc: "Simple return process" }
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
              <h2 className="text-2xl font-bold mb-4">Return Policy</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We accept returns within <strong>30 days</strong> of purchase. To be eligible for a return, 
                  items must be unused, in their original packaging, and in the same condition as received.
                </p>
                <p>
                  For defective or damaged items, we offer free return shipping and a full refund or replacement. 
                  For regular returns, a return shipping fee of $5.99 will be deducted from your refund.
                </p>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">How to Return an Item</h2>
              <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
                <li>Log into your account and go to Order History</li>
                <li>Select the order containing the item you want to return</li>
                <li>Click "Request Return" and select your reason</li>
                <li>Print the prepaid return label (if eligible)</li>
                <li>Package the item securely and attach the label</li>
                <li>Drop off at any carrier location</li>
                <li>You'll receive a confirmation email once we receive your return</li>
              </ol>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Refund Processing</h2>
              <p className="text-muted-foreground mb-4">
                Once we receive and inspect your return, we'll send you an email notification. 
                If approved, your refund will be processed within 5-7 business days and credited 
                to your original payment method.
              </p>
              <p className="text-muted-foreground">
                <strong>Note:</strong> Shipping charges are non-refundable unless the return is due to 
                our error or a defective product.
              </p>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Non-Returnable Items</h2>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>Items marked as "Final Sale"</li>
                <li>Personalized or custom-made items</li>
                <li>Opened collectibles or action figures</li>
                <li>Gift cards</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Returns;
