export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  price: number;
  size: string;
  condition: string;
  image: string;
  owner: string;
  university: string;
  availableFrom: string;
  availableTo: string;
  description: string;
  brand?: string;
}

export const mockItems: ClothingItem[] = [
  {
    id: "1",
    name: "Black Mini Dress",
    category: "dresses",
    price: 15,
    size: "S",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1764179690227-af049306cd20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuZHklMjB3b21hbiUyMGRyZXNzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzE3MTE5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    owner: "Sarah M.",
    university: "UCLA",
    availableFrom: "2026-02-22",
    availableTo: "2026-05-15",
    description: "Perfect for date nights or parties! Wore once for a formal event.",
    brand: "Zara"
  },
  {
    id: "2",
    name: "White Crop Top",
    category: "tops",
    price: 8,
    size: "M",
    condition: "Excellent",
    image: "https://images.unsplash.com/photo-1724490056260-44bf1de2617e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9wJTIwdG9wJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzE2NTQyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    owner: "Emma K.",
    university: "USC",
    availableFrom: "2026-02-23",
    availableTo: "2026-06-01",
    description: "Versatile and comfortable crop top. Goes with everything!",
    brand: "H&M"
  },
  {
    id: "3",
    name: "High-Waisted Jeans",
    category: "bottoms",
    price: 12,
    size: "27",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1666899462970-40dfe2ef3a70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZWFucyUyMGRlbmltJTIwcGFudHN8ZW58MXx8fHwxNzcxNjg1MzY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    owner: "Mia L.",
    university: "UCLA",
    availableFrom: "2026-02-24",
    availableTo: "2026-05-20",
    description: "Classic high-waisted denim. Comfortable and flattering fit.",
    brand: "Levi's"
  },
  {
    id: "4",
    name: "Leather Jacket",
    category: "jackets",
    price: 25,
    size: "M",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwamFja2V0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NzE2MTg0OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    owner: "Olivia R.",
    university: "USC",
    availableFrom: "2026-02-25",
    availableTo: "2026-04-30",
    description: "Edgy leather jacket perfect for any outfit. Make a statement!",
    brand: "All Saints"
  },
  {
    id: "5",
    name: "Plaid Mini Skirt",
    category: "skirts",
    price: 10,
    size: "S",
    condition: "Excellent",
    image: "https://images.unsplash.com/photo-1739945472394-3284ac02996b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pJTIwc2tpcnQlMjBmYXNoaW9ufGVufDF8fHx8MTc3MTcxMTkzMHww&ixlib=rb-4.1.0&q=80&w=1080",
    owner: "Ava B.",
    university: "UCLA",
    availableFrom: "2026-02-26",
    availableTo: "2026-05-10",
    description: "Y2K inspired mini skirt. Super cute and trendy!",
    brand: "Urban Outfitters"
  },
  {
    id: "6",
    name: "Stylish Blouse",
    category: "tops",
    price: 9,
    size: "L",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1765365353704-ed0b6e1b11c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsaXNoJTIwdG9wJTIwYmxvdXNlfGVufDF8fHx8MTc3MTcxMTkzMHww&ixlib=rb-4.1.0&q=80&w=1080",
    owner: "Sophia P.",
    university: "USC",
    availableFrom: "2026-02-27",
    availableTo: "2026-06-05",
    description: "Elegant blouse perfect for presentations or dinner dates.",
    brand: "Mango"
  },
  {
    id: "7",
    name: "Black Bodysuit",
    category: "bodysuits",
    price: 11,
    size: "M",
    condition: "Excellent",
    image: "https://images.unsplash.com/photo-1596112294369-b5967affeea4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2R5c3VpdCUyMGZhc2hpb258ZW58MXx8fHwxNzcxNzExOTMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    owner: "Isabella C.",
    university: "UCLA",
    availableFrom: "2026-02-28",
    availableTo: "2026-05-25",
    description: "Classic black bodysuit - a wardrobe staple!",
    brand: "Forever 21"
  },
  {
    id: "8",
    name: "Floral Romper",
    category: "sets",
    price: 14,
    size: "S",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1685703206868-a242da45deca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21wZXIlMjBqdW1wc3VpdHxlbnwxfHx8fDE3NzE3MTE5MzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    owner: "Charlotte W.",
    university: "USC",
    availableFrom: "2026-03-01",
    availableTo: "2026-06-10",
    description: "Cute summer romper. Perfect for beach days or festivals!",
    brand: "Free People"
  },
  {
    id: "9",
    name: "Cozy Knit Sweater",
    category: "sweaters",
    price: 13,
    size: "M",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1536992266094-82847e1fd431?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2VhdGVyJTIwa25pdCUyMGZhc2hpb258ZW58MXx8fHwxNzcxNzExOTMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    owner: "Amelia H.",
    university: "UCLA",
    availableFrom: "2026-03-02",
    availableTo: "2026-05-15",
    description: "Super soft and warm sweater. Perfect for chilly campus days.",
    brand: "Aritzia"
  },
  {
    id: "10",
    name: "Graphic T-Shirt",
    category: "tops",
    price: 7,
    size: "M",
    condition: "Excellent",
    image: "https://images.unsplash.com/photo-1655141559812-42f8c1e8942d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwdHNoaXJ0fGVufDF8fHx8MTc3MTcxMTkzMnww&ixlib=rb-4.1.0&q=80&w=1080",
    owner: "Harper G.",
    university: "USC",
    availableFrom: "2026-03-03",
    availableTo: "2026-06-01",
    description: "Trendy graphic tee. Easy to style and super comfortable.",
    brand: "Urban Outfitters"
  },
  {
    id: "11",
    name: "Cargo Pants",
    category: "bottoms",
    price: 12,
    size: "28",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1649850874075-49e014357b9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHBhbnRzJTIwc3RyZWV0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NzE3MTE5MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    owner: "Ella T.",
    university: "UCLA",
    availableFrom: "2026-03-04",
    availableTo: "2026-05-20",
    description: "Street style cargo pants. Functional and fashionable!",
    brand: "Dickies"
  },
  {
    id: "12",
    name: "Campus Casual Outfit",
    category: "new-arrivals",
    price: 18,
    size: "M",
    condition: "Excellent",
    image: "https://images.unsplash.com/photo-1686545232398-2cef6411fbe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudHMlMjBjYXN1YWwlMjBmYXNoaW9ufGVufDF8fHx8MTc3MTcxMTkzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    owner: "Grace N.",
    university: "USC",
    availableFrom: "2026-03-05",
    availableTo: "2026-06-10",
    description: "Complete casual look perfect for everyday campus life.",
    brand: "Brandy Melville"
  },
];
