/**
 * Single data-access seam for the product catalog. All reads go through
 * getProductRepository() so a real database can swap in behind this
 * accessor later with no caller changes.
 */
export interface Product {
  id: string;
  name: string;
  priceCents: number;
  imageUrl: string;
}

const products: Product[] = [
  {
    id: 'p1',
    name: 'Ceramic Pour-Over Mug',
    priceCents: 1800,
    imageUrl: 'https://picsum.photos/seed/quickcart-mug/400/300'
  },
  {
    id: 'p2',
    name: 'Woven Throw Blanket',
    priceCents: 4200,
    imageUrl: 'https://picsum.photos/seed/quickcart-blanket/400/300'
  },
  {
    id: 'p3',
    name: 'Desk Succulent Trio',
    priceCents: 2600,
    imageUrl: 'https://picsum.photos/seed/quickcart-plant/400/300'
  },
  {
    id: 'p4',
    name: 'Minimalist Table Lamp',
    priceCents: 5400,
    imageUrl: 'https://picsum.photos/seed/quickcart-lamp/400/300'
  },
  {
    id: 'p5',
    name: 'Leather Notebook',
    priceCents: 2200,
    imageUrl: 'https://picsum.photos/seed/quickcart-notebook/400/300'
  },
  {
    id: 'p6',
    name: 'Stoneware Bowl Set',
    priceCents: 3600,
    imageUrl: 'https://picsum.photos/seed/quickcart-bowl/400/300'
  }
];

export interface ProductRepository {
  getAll(): Product[];
  getById(id: string): Product | undefined;
}

export function getProductRepository(): ProductRepository {
  return {
    getAll(): Product[] {
      return products.map((p) => ({ ...p }));
    },
    getById(id: string): Product | undefined {
      return products.find((p) => p.id === id);
    }
  };
}
