import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Gift, Truck } from "lucide-react";

// Mock product data
const products = [
  { id: 1, name: "Super Hero Action Figure Deluxe Set", price: 29.99, originalPrice: 39.99, rating: 4.8, reviews: 234, image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=400&fit=crop" },
  { id: 2, name: "Princess Castle Playset with Lights", price: 49.99, originalPrice: 69.99, rating: 4.9, reviews: 189, image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&h=400&fit=crop" },
  { id: 3, name: "Remote Control Racing Car Pro", price: 39.99, rating: 4.7, reviews: 456, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop" },
  { id: 4, name: "LEGO Space Station Building Kit", price: 59.99, originalPrice: 79.99, rating: 5.0, reviews: 678, image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop" },
  { id: 5, name: "Educational Science Lab Set", price: 34.99, rating: 4.6, reviews: 123, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop" },
  { id: 6, name: "Plush Teddy Bear Giant Size", price: 44.99, originalPrice: 54.99, rating: 4.9, reviews: 892, image: "https://images.unsplash.com/photo-1551817958-20c0ac1f7229?w=400&h=400&fit=crop" },
  { id: 7, name: "Board Game Family Fun Edition", price: 24.99, rating: 4.5, reviews: 334, image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=400&fit=crop" },
  { id: 8, name: "Art & Craft Mega Supplies Set", price: 32.99, rating: 4.8, reviews: 267, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop" },
];

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 space-y-6 text-center md:text-left"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium">New Arrivals Every Week!</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Welcome to
                  <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    ToyLand Magic!
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Discover amazing toys, games, and endless fun for kids of all ages. Where imagination comes to life!
                </p>
                <div className="flex gap-4 justify-center md:justify-start">
                  <Button size="lg" className="rounded-full bg-primary hover:bg-primary-dark shadow-lg">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full border-2">
                    View Deals
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
                  <img
                    src="https://images.unsplash.com/photo-1560072810-1cffb09faf0f?w=600&h=600&fit=crop"
                    alt="Happy kids with toys"
                    className="relative rounded-3xl shadow-2xl w-full animate-float"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
                { icon: Gift, title: "Gift Wrapping", desc: "Make it extra special" },
                { icon: Sparkles, title: "Quality Guarantee", desc: "100% satisfaction" },
              ].map(({ icon: Icon, title, desc }, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="flex items-center gap-4 p-6 rounded-2xl bg-muted/50 border-2 border-border hover:border-primary transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                🌟 Featured Toys
              </h2>
              <p className="text-muted-foreground">Handpicked favorites kids absolutely love!</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button size="lg" variant="outline" className="rounded-full border-2">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Home;
