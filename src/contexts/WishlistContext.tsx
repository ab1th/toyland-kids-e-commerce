import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const addToWishlist = (product: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        toast({ title: "Already in wishlist" });
        return prev;
      }
      toast({ title: "Added to wishlist", description: `${product.name} saved!` });
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast({ title: "Removed from wishlist" });
  };

  const isInWishlist = (id: number) => items.some((item) => item.id === id);

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
