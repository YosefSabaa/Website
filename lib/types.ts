export interface ProductImage {
  url: string;
  alt: string;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  specifications: { label: string; value: string }[];
  images: string[];
  category: string;
  categorySlug: string;
  brand: string;
  barcode: string;
  sku: string;
  stock: number;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  tags: string[];
  relatedIds: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isRecommended?: boolean;
  isOnOffer?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  productCount: number;
  subcategories?: { name: string; slug: string }[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorAvatar: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  location: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Order {
  id: string;
  number: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: { name: string; image: string; price: number; quantity: number }[];
  address: string;
  trackingSteps: { label: string; date: string; done: boolean }[];
}
