import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Gift, Truck, TrendingUp } from "lucide-react";
import { products } from "@/data/products";
import { useSearchParams, Link } from "react-router-dom";
import { useMemo } from "react";

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const bestSellers = products.filter((p) => p.isBestSeller);
  const offerProducts = products.filter((p) => p.originalPrice);

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
                  <Button
                    size="lg"
                    className="rounded-full bg-primary hover:bg-primary-dark shadow-lg"
                    onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-2"
                    onClick={() => document.getElementById("offers")?.scrollIntoView({ behavior: "smooth" })}
                  >
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

        {/* Search Results */}
        {searchQuery && (
          <section className="py-8 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">
                Search Results for "{searchQuery}"
              </h2>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-12">
                  No products found. Try a different search term!
                </p>
              )}
            </div>
          </section>
        )}

        {/* Best Sellers */}
        {!searchQuery && (
          <section className="py-12" id="bestsellers">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-4">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  <span className="font-semibold text-secondary">Best Sellers</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  ⭐ Top Picks This Month
                </h2>
                <p className="text-muted-foreground">Most loved toys flying off our shelves!</p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {bestSellers.map((product, idx) => (
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
            </div>
          </section>
        )}

        {/* Special Offers */}
        {!searchQuery && (
          <section className="py-12 bg-gradient-to-br from-accent/10 to-primary/10" id="offers">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full mb-4">
                  <Gift className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-accent">Limited Time</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  🔥 Amazing Offers
                </h2>
                <p className="text-muted-foreground">Don't miss out on these incredible deals!</p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {offerProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Products */}
        {!searchQuery && (
          <section className="py-12" id="products">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  🌟 All Toys
                </h2>
                <p className="text-muted-foreground">Explore our complete collection!</p>
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
            </div>
          </section>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Home;
