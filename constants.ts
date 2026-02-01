
import { User, ClothingItem, SocialPost } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Maya Chen',
  handle: '@mayavibes',
  email: 'm.chen@nyu.edu',
  university: 'NYU',
  bio: 'Just a city girl sharing my closet 🖤 | Size S/M | 5\'4"',
  avatar: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200',
  rating: 4.9,
  borrowsRemaining: 3
};

export const MOCK_ITEMS: ClothingItem[] = [
  {
    id: 'i1',
    ownerId: 'u1',
    title: 'Midnight Fever Corset',
    description: 'The iconic Edikted corset. Super flattering boning, perfect for formal or a night out.',
    brand: 'Edikted',
    size: 'S',
    pricePerDay: 8,
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
    vibe: ['Night Out', 'Coquette', 'Corset'],
    productLink: 'https://edikted.com/products/s10725_black',
    isAvailable: true,
    lenderRating: 5.0
  },
  {
    id: 'i2',
    ownerId: 'u2',
    title: 'After Party Mesh Mini',
    description: 'White Fox sparkle mesh top. Looks insane under club lights. Comes with matching bralette.',
    brand: 'White Fox',
    size: 'M',
    pricePerDay: 12,
    imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=800',
    vibe: ['Rave', 'Sparkle', 'Mesh'],
    productLink: 'https://whitefoxboutique.com/products/after-party-mesh-top-black',
    isAvailable: true,
    lenderRating: 4.8
  },
  {
    id: 'i3',
    ownerId: 'u3',
    title: 'Archer Satin Pants',
    description: 'Princess Polly classic champagne satin trousers. Perfect for brunch or an internship look.',
    brand: 'Princess Polly',
    size: 'XS',
    pricePerDay: 10,
    imageUrl: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?auto=format&fit=crop&q=80&w=800',
    vibe: ['Chic', 'Satin', 'Clean Girl'],
    productLink: 'https://www.princesspolly.com/products/archer-pants-champagne',
    isAvailable: true,
    lenderRating: 4.9
  },
  {
    id: 'i4',
    ownerId: 'u4',
    title: 'Glitter Mesh Overlay',
    description: 'Sheen-y mesh top with butterfly details. Y2K vibes only.',
    brand: 'Shein',
    size: 'S',
    pricePerDay: 5,
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    vibe: ['Y2K', 'Grunge', 'Festival'],
    productLink: 'https://us.shein.com/Glitter-Mesh-Top-p-103242.html',
    isAvailable: true,
    lenderRating: 4.7
  },
  {
    id: 'i5',
    ownerId: 'u5',
    title: 'Knit Bolero Set',
    description: 'The viral Edikted knit shrug and tank combo. Very cozy but still cute.',
    brand: 'Edikted',
    size: 'M',
    pricePerDay: 7,
    imageUrl: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&q=80&w=800',
    vibe: ['Cozy', 'Knitwear', 'Campus'],
    productLink: 'https://edikted.com/products/knit-bolero-set',
    isAvailable: true,
    lenderRating: 5.0
  },
  {
    id: 'i6',
    ownerId: 'u6',
    title: 'Low Rise Cargo Pants',
    description: 'White Fox classic cargos in khaki. Adjustable waist, so many pockets!',
    brand: 'White Fox',
    size: 'L',
    pricePerDay: 9,
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
    vibe: ['Streetwear', 'Cargo', 'Gorpcore'],
    productLink: 'https://whitefoxboutique.com/products/cargo-pants-khaki',
    isAvailable: true,
    lenderRating: 4.6
  }
];

export const MOCK_POSTS: SocialPost[] = [
  {
    id: 'p1',
    userId: 'u1',
    imageUrl: 'https://images.unsplash.com/photo-1529139513477-323c66b62adc?auto=format&fit=crop&q=80&w=800',
    caption: 'Obsessed with this NYU game day fit! Rent it in my closet 🏈✨',
    taggedItems: ['i1'],
    likes: 124,
    comments: 8
  }
];
