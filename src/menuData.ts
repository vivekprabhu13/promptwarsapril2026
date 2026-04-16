export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'food' | 'drink' | 'snack';
  image: string;
  description: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Ghee Roast Masala Dosa',
    price: 140.00,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
    description: 'Crispy Bengaluru style dosa with spicy potato filling and clarified butter.'
  },
  {
    id: 'm2',
    name: 'Classic Vada Pav',
    price: 90.00,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea8c5119c85?auto=format&fit=crop&w=400&q=80',
    description: 'Spicy potato fritter in a soft bun with garlic chutney and green chili.'
  },
  {
    id: 'm3',
    name: 'Paneer Tikka Roll',
    price: 195.00,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&q=80',
    description: 'Succulent grilled paneer wrapped in a soft paratha with mint sauce.'
  },
  {
    id: 'm4',
    name: 'Filter Coffee (Hot)',
    price: 45.00,
    category: 'drink',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=400&q=80',
    description: 'Traditional South Indian decoction coffee with frothy milk.'
  },
  {
    id: 'm5',
    name: 'Cutting Masala Chai',
    price: 35.00,
    category: 'drink',
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4586c517?auto=format&fit=crop&w=400&q=80',
    description: 'Ginger and cardamom infused hot tea, perfect for the match mood.'
  },
  {
    id: 'm6',
    name: 'Chilled Mango Lassi',
    price: 110.00,
    category: 'drink',
    image: 'https://images.unsplash.com/photo-1571006682868-a2d3ff5d50ee?auto=format&fit=crop&w=400&q=80',
    description: 'Thick and creamy yogurt-based mango drink, served cold.'
  }
];
