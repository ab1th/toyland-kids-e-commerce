import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { products } from "@/data/products";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackButton } from "@/components/BackButton";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ name: "", rating: 5, comment: "" });
  const [submittedReviews, setSubmittedReviews] = useState<Array<{name: string; rating: number; comment: string}>>([]);

  const productData = products.find(p => p.id === Number(id)) || products[0];
  
  const product = {
    ...productData,
    images: [
      productData.image,
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop",
    ],
    features: [
      "Premium quality construction",
      "Safe, non-toxic materials",
      "Educational and fun",
      "Perfect gift for kids",
      "Ages 3+",
    ],
  };

  const isWishlisted = isInWishlist(product.id);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    }
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleSubmitReview = () => {
    if (!reviewData.name.trim() || !reviewData.comment.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setSubmittedReviews([...submittedReviews, reviewData]);
    toast({ title: "Review submitted!", description: "Thank you for your feedback!" });
    setReviewData({ name: "", rating: 5, comment: "" });
    setShowReviewForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <BackButton />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square rounded-3xl overflow-hidden bg-muted border-2 border-border"
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div className="grid grid-cols-3 gap-3">
                {product.images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-3 bg-accent text-white">{discount}% OFF - Limited Time!</Badge>
                <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-secondary text-secondary"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-bold text-primary">${product.price}</span>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity & Actions */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border-2 rounded-full overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-muted transition-colors"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                    <Button 
                      size="lg" 
                      className="w-full rounded-full bg-primary hover:bg-primary-dark"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className={`rounded-full border-2 ${
                        isWishlisted ? "bg-accent border-accent text-white" : ""
                      }`}
                      onClick={handleToggleWishlist}
                    >
                      <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                    </Button>
                  </motion.div>
                </div>
              </Card>

              {/* Features */}
              <Card className="p-6">
                <h3 className="font-bold mb-4">Product Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-success mt-1">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, text: "Free Shipping" },
                  { icon: Shield, text: "Secure Payment" },
                  { icon: RotateCcw, text: "Easy Returns" },
                ].map(({ icon: Icon, text }, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50">
                    <Icon className="h-6 w-6 text-primary" />
                    <span className="text-xs text-center font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Customer Reviews</h2>
                <Button 
                  className="rounded-full"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {showReviewForm ? "Cancel" : "Write a Review"}
                </Button>
              </div>

              {showReviewForm && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-6 rounded-xl bg-muted/50 space-y-4"
                >
                  <h3 className="font-bold">Share Your Experience</h3>
                  <div>
                    <Label>Your Name</Label>
                    <Input
                      value={reviewData.name}
                      onChange={(e) => setReviewData({...reviewData, name: e.target.value})}
                      placeholder="Enter your name"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewData({...reviewData, rating: star})}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= reviewData.rating
                                ? "fill-secondary text-secondary"
                                : "fill-muted text-muted"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Your Review</Label>
                    <Textarea
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                      placeholder="Tell us what you think..."
                      className="rounded-xl min-h-32"
                    />
                  </div>
                  <Button 
                    onClick={handleSubmitReview}
                    className="w-full rounded-full"
                  >
                    Submit Review
                  </Button>
                </motion.div>
              )}

              <div className="space-y-6">
                {submittedReviews.map((review, idx) => (
                  <div key={`submitted-${idx}`} className="border-b pb-6 last:border-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{review.name}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < review.rating 
                                  ? "fill-secondary text-secondary" 
                                  : "fill-muted text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
                
                {[1, 2, 3].map((idx) => (
                  <div key={idx} className="border-b pb-6 last:border-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {String.fromCharCode(64 + idx)}
                      </div>
                      <div>
                        <p className="font-semibold">Parent {idx}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      My kids absolutely love this toy! Great quality and hours of fun. Highly recommend!
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default ProductDetail;
