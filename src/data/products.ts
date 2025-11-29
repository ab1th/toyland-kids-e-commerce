export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  description: string;
  isBestSeller?: boolean;
}

export const products: Product[] = [
  { id: 1, name: "Super Hero Action Figure Deluxe Set", price: 29.99, originalPrice: 39.99, rating: 4.8, reviews: 234, image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=400&fit=crop", category: "Action Figures", description: "Amazing superhero action figure with multiple accessories and poseable joints.", isBestSeller: true },
  { id: 2, name: "Princess Castle Playset with Lights", price: 49.99, originalPrice: 69.99, rating: 4.9, reviews: 189, image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&h=400&fit=crop", category: "Playsets", description: "Magical castle playset featuring LED lights and multiple rooms for endless fun.", isBestSeller: true },
  { id: 3, name: "Remote Control Racing Car Pro", price: 39.99, rating: 4.7, reviews: 456, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", category: "RC Toys", description: "High-speed RC car with precision control and durable design." },
  { id: 4, name: "LEGO Space Station Building Kit", price: 59.99, originalPrice: 79.99, rating: 5.0, reviews: 678, image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop", category: "Building Blocks", description: "Build your own space station with this comprehensive LEGO kit.", isBestSeller: true },
  { id: 5, name: "Educational Science Lab Set", price: 34.99, rating: 4.6, reviews: 123, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop", category: "Educational", description: "Complete science lab with experiments for young scientists." },
  { id: 6, name: "Plush Teddy Bear Giant Size", price: 44.99, originalPrice: 54.99, rating: 4.9, reviews: 892, image: "https://images.unsplash.com/photo-1551817958-20c0ac1f7229?w=400&h=400&fit=crop", category: "Plush Toys", description: "Soft and cuddly giant teddy bear, perfect for hugs.", isBestSeller: true },
  { id: 7, name: "Board Game Family Fun Edition", price: 24.99, rating: 4.5, reviews: 334, image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=400&fit=crop", category: "Board Games", description: "Family board game for hours of entertainment." },
  { id: 8, name: "Art & Craft Mega Supplies Set", price: 32.99, rating: 4.8, reviews: 267, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop", category: "Arts & Crafts", description: "Complete art supplies set for creative kids." },
  { id: 9, name: "Dinosaur World Adventure Set", price: 38.99, originalPrice: 49.99, rating: 4.7, reviews: 445, image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop", category: "Action Figures", description: "Explore prehistoric times with realistic dinosaur figures." },
  { id: 10, name: "Musical Keyboard Piano for Kids", price: 55.99, rating: 4.8, reviews: 321, image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop", category: "Musical Toys", description: "Electronic keyboard with light-up keys and multiple sounds." },
];
