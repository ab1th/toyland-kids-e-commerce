import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, Users, Award, Truck } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About ToyLand
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your magical destination for the best toys, games, and fun! We bring smiles to children worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Heart, title: "Made with Love", desc: "Every toy selected with care and joy" },
              { icon: Users, title: "Family First", desc: "Building memories for families everywhere" },
              { icon: Award, title: "Quality Assured", desc: "Only the best and safest toys" },
              { icon: Truck, title: "Fast Delivery", desc: "Get your happiness delivered quickly" }
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

          <Card className="p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                ToyLand was founded in 2020 with a simple mission: to bring joy and wonder to children around the world. 
                We believe that play is essential to childhood, and every child deserves access to high-quality, 
                safe, and imaginative toys.
              </p>
              <p>
                Our team of toy experts carefully curates each product in our collection, ensuring that every item 
                meets our strict standards for quality, safety, and fun. From classic board games to the latest tech toys, 
                we have something for every child's interests and developmental stage.
              </p>
              <p>
                We're more than just a toy store – we're a community of parents, educators, and toy enthusiasts 
                dedicated to making childhood magical. Thank you for choosing ToyLand for your family's playtime needs!
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default AboutUs;
