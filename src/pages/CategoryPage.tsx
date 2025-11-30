import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { products } from "@/data/products";
import { BackButton } from "@/components/BackButton";

const CategoryPage = () => {
  const { category } = useParams();
  const categoryName = category?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()) || "All";
  
  const filteredProducts = category === "all-categories" 
    ? products 
    : products.filter(p => p.category.toLowerCase().replace(" ", "-") === category);

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
            <h1 className="text-4xl font-bold mb-2">{categoryName}</h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} products available
            </p>
          </motion.div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No products found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ProductCard {...product} />
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

export default CategoryPage;
