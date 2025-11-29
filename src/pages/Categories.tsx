import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const categories = [
  { name: "Action Figures", icon: "🦸", color: "from-blue-500 to-purple-500", count: 234 },
  { name: "Dolls", icon: "👸", color: "from-pink-500 to-rose-500", count: 189 },
  { name: "Board Games", icon: "🎲", color: "from-green-500 to-teal-500", count: 156 },
  { name: "LEGO", icon: "🧱", color: "from-red-500 to-orange-500", count: 298 },
  { name: "Educational", icon: "📚", color: "from-yellow-500 to-amber-500", count: 167 },
  { name: "Outdoor", icon: "⚽", color: "from-cyan-500 to-blue-500", count: 123 },
  { name: "Arts & Crafts", icon: "🎨", color: "from-purple-500 to-pink-500", count: 201 },
  { name: "Puzzles", icon: "🧩", color: "from-indigo-500 to-violet-500", count: 145 },
];

const Categories = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-3">🎯 Browse Categories</h1>
            <p className="text-muted-foreground text-lg">
              Find the perfect toy for every interest!
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={`/category/${category.name.toLowerCase().replace(" ", "-")}`}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary">
                    <div className={`h-32 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <span className="text-6xl group-hover:scale-110 transition-transform">
                        {category.icon}
                      </span>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.count} products
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Categories;
