/**
 * Mock product data for demos.
 */

export interface Product {
  sku: string;
  name: string;
  price: number;
  stock: number;
  category: 'electronics' | 'clothing' | 'food' | 'books';
}

export const products: Product[] = [
  {
    sku: 'ELEC-001',
    name: 'Wireless Headphones',
    price: 89.99,
    stock: 45,
    category: 'electronics'
  },
  {
    sku: 'ELEC-002',
    name: 'USB-C Cable',
    price: 12.99,
    stock: 120,
    category: 'electronics'
  },
  {
    sku: 'CLOTH-001',
    name: 'Cotton T-Shirt',
    price: 19.99,
    stock: 75,
    category: 'clothing'
  },
  {
    sku: 'CLOTH-002',
    name: 'Denim Jeans',
    price: 49.99,
    stock: 30,
    category: 'clothing'
  },
  {
    sku: 'FOOD-001',
    name: 'Organic Coffee',
    price: 14.99,
    stock: 60,
    category: 'food'
  },
  {
    sku: 'FOOD-002',
    name: 'Dark Chocolate',
    price: 8.99,
    stock: 85,
    category: 'food'
  },
  {
    sku: 'BOOK-001',
    name: 'The Great Novel',
    price: 24.99,
    stock: 20,
    category: 'books'
  },
  {
    sku: 'BOOK-002',
    name: 'Technical Guide',
    price: 39.99,
    stock: 15,
    category: 'books'
  }
];

export const emptyProducts: Product[] = [];
