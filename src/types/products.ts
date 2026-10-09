export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  images: string[];
  discountPercentage?: string;
  rating: number;
  stock?: number;
  brand?: string;
  reviews: Review[];
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}
