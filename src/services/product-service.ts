// This is a mock product service that would be used to fetch products from an api, which Tambo would use to get real product data. For now, we're just using a local static list of products.

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  discountPercentage?: number;
  accentColor: 'indigo' | 'emerald' | 'rose' | 'amber';
  inStock?: boolean;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    category: 'Electronics',
    discountPercentage: 10,
    accentColor: 'indigo',
    inStock: true
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Fitness tracking smartwatch with heart rate monitoring',
    price: 299.99,
    category: 'Electronics',
    discountPercentage: 5,
    accentColor: 'emerald',
    inStock: true
  },
  {
    id: '3',
    name: 'Running Shoes',
    description: 'Comfortable running shoes with superior cushioning',
    price: 89.99,
    category: 'Sports',
    discountPercentage: 20,
    accentColor: 'rose',
    inStock: false
  },
  {
    id: '4',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe',
    price: 79.99,
    category: 'Home',
    discountPercentage: 15,
    accentColor: 'amber',
    inStock: true
  },
  {
    id: '5',
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with carrying strap',
    price: 29.99,
    category: 'Sports',
    discountPercentage: 30,
    accentColor: 'indigo',
    inStock: true
  }
];

export const getProducts = async (): Promise<Product[]> => {
  return mockProducts;
};

export type { Product };

