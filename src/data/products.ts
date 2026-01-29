export interface Product {
  id: string;
  name: string;
  nameFr: string;
  unit: string;
  price: number;
  category: string;
  categoryFr: string;
  image: string;
  brand?: string;
}

export interface Category {
  id: string;
  name: string;
  nameFr: string;
  icon: string;
  count: number;
}

export const products: Product[] = [
  // ==================== FRESH SEAFOOD & FISH ====================
  { id: "sf-1", name: "Barramundi (Whole)", nameFr: "Barramundi (Entier)", unit: "per kg", price: 24.90, category: "Fresh Seafood & Fish", categoryFr: "Poissons & Fruits de Mer Frais", image: "/placeholder.svg" },
  { id: "sf-2", name: "Trevally (Whole)", nameFr: "Carangue (Entier)", unit: "per kg", price: 19.90, category: "Fresh Seafood & Fish", categoryFr: "Poissons & Fruits de Mer Frais", image: "/placeholder.svg" },
  { id: "sf-3", name: "Barracuda (Whole)", nameFr: "Barracuda (Entier)", unit: "per kg", price: 22.90, category: "Fresh Seafood & Fish", categoryFr: "Poissons & Fruits de Mer Frais", image: "/placeholder.svg" },
  { id: "sf-4", name: "Emperor Fish (Whole)", nameFr: "Poisson Empereur (Entier)", unit: "per kg", price: 26.90, category: "Fresh Seafood & Fish", categoryFr: "Poissons & Fruits de Mer Frais", image: "/placeholder.svg" },
  { id: "sf-5", name: "Blue Swimmer Crab", nameFr: "Crabe de Mer Bleu", unit: "per kg", price: 32.90, category: "Fresh Seafood & Fish", categoryFr: "Poissons & Fruits de Mer Frais", image: "/placeholder.svg" },
  { id: "sf-6", name: "Sailfish (Thalapat)", nameFr: "Voilier (Thalapat)", unit: "per kg", price: 28.90, category: "Fresh Seafood & Fish", categoryFr: "Poissons & Fruits de Mer Frais", image: "/placeholder.svg" },
  { id: "sf-7", name: "King Fish (Seer Fish)", nameFr: "Thazard Royal", unit: "per kg", price: 34.90, category: "Fresh Seafood & Fish", categoryFr: "Poissons & Fruits de Mer Frais", image: "/placeholder.svg" },
  { id: "sf-8", name: "Black Pomfret", nameFr: "Pomfret Noir", unit: "per kg", price: 29.90, category: "Fresh Seafood & Fish", categoryFr: "Poissons & Fruits de Mer Frais", image: "/placeholder.svg" },
  { id: "sf-9", name: "Silver Belly Fish", nameFr: "Poisson Ventre d'Argent", unit: "per kg", price: 16.90, category: "Fresh Seafood & Fish", categoryFr: "Poissons & Fruits de Mer Frais", image: "/placeholder.svg" },
  { id: "sf-10", name: "Yellowfin Tuna (Whole)", nameFr: "Thon Albacore (Entier)", unit: "per kg", price: 38.90, category: "Fresh Seafood & Fish", categoryFr: "Poissons & Fruits de Mer Frais", image: "/placeholder.svg" },
  { id: "sf-11", name: "Calamari (Squid)", nameFr: "Calamars (Encornets)", unit: "per kg", price: 21.90, category: "Fresh Seafood & Fish", categoryFr: "Poissons & Fruits de Mer Frais", image: "/placeholder.svg" },

  // ==================== BUTCHER (FRESH & FROZEN MEAT) ====================
  { id: "bt-1", name: "Leg of Mutton (Gigot)", nameFr: "Gigot d'Agneau", unit: "per kg", price: 29.90, category: "Butcher", categoryFr: "Boucherie", image: "/placeholder.svg" },
  { id: "bt-2", name: "Mutton Meat (Chunks)", nameFr: "Viande de Mouton (Morceaux)", unit: "per kg", price: 24.90, category: "Butcher", categoryFr: "Boucherie", image: "/placeholder.svg" },
  { id: "bt-3", name: "Lamb (Agneau)", nameFr: "Agneau", unit: "per kg", price: 32.90, category: "Butcher", categoryFr: "Boucherie", image: "/placeholder.svg" },
  { id: "bt-4", name: "Oxtail (Queue de Boeuf)", nameFr: "Queue de Boeuf", unit: "per kg", price: 19.90, category: "Butcher", categoryFr: "Boucherie", image: "/placeholder.svg" },

  // ==================== RICE - TILDA ====================
  { id: "r-t1", name: "Tilda Pure Basmati Rice", nameFr: "Riz Basmati Pur Tilda", unit: "5 kg", price: 24.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Tilda" },
  { id: "r-t2", name: "Tilda Grand Extra Long Basmati", nameFr: "Riz Basmati Extra Long Tilda Grand", unit: "5 kg", price: 28.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Tilda" },
  { id: "r-t3", name: "Tilda Golden Sella Basmati", nameFr: "Riz Basmati Sella Doré Tilda", unit: "5 kg", price: 26.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Tilda" },
  { id: "r-t4", name: "Tilda Fragrant Jasmine Rice", nameFr: "Riz Jasmin Parfumé Tilda", unit: "5 kg", price: 22.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Tilda" },
  { id: "r-t5", name: "Tilda Easy Cook Long Grain", nameFr: "Riz Long Grain Cuisson Facile Tilda", unit: "5 kg", price: 18.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Tilda" },
  { id: "r-t6", name: "Tilda Long Grain Rice", nameFr: "Riz Long Grain Tilda", unit: "5 kg", price: 17.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Tilda" },

  // ==================== RICE - DAAWAT ====================
  { id: "r-d1", name: "Daawat Golden Sella Basmati", nameFr: "Riz Basmati Sella Doré Daawat", unit: "5 kg", price: 25.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Daawat" },
  { id: "r-d2", name: "Daawat Extra Long Basmati", nameFr: "Riz Basmati Extra Long Daawat", unit: "5 kg", price: 27.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Daawat" },
  { id: "r-d3", name: "Daawat Original Basmati", nameFr: "Riz Basmati Original Daawat", unit: "5 kg", price: 24.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Daawat" },
  { id: "r-d4", name: "Daawat Everyday Basmati", nameFr: "Riz Basmati Quotidien Daawat", unit: "5 kg", price: 21.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Daawat" },

  // ==================== RICE - LAL QILLA ====================
  { id: "r-lq1", name: "Lal Qilla Supreme Sella Basmati", nameFr: "Riz Basmati Sella Suprême Lal Qilla", unit: "5 kg", price: 29.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Lal Qilla" },
  { id: "r-lq2", name: "Lal Qilla Majestic Basmati", nameFr: "Riz Basmati Majestic Lal Qilla", unit: "5 kg", price: 32.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Lal Qilla" },
  { id: "r-lq3", name: "Lal Qilla Traditional Basmati", nameFr: "Riz Basmati Traditionnel Lal Qilla", unit: "5 kg", price: 26.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Lal Qilla" },
  { id: "r-lq4", name: "Lal Qilla Sona Masoori", nameFr: "Riz Sona Masoori Lal Qilla", unit: "5 kg", price: 19.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Lal Qilla" },

  // ==================== RICE - LAILA ====================
  { id: "r-la1", name: "Laila Xtra Long Basmati Rice", nameFr: "Riz Basmati Extra Long Laila", unit: "5 kg", price: 26.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Laila" },
  { id: "r-la2", name: "Laila Golden Sella Basmati", nameFr: "Riz Basmati Sella Doré Laila", unit: "5 kg", price: 24.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Laila" },
  { id: "r-la3", name: "Laila Long Grain Rice", nameFr: "Riz Long Grain Laila", unit: "5 kg", price: 16.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Laila" },

  // ==================== RICE - INDIA GATE ====================
  { id: "r-ig1", name: "India Gate Ponni Boiled Rice", nameFr: "Riz Ponni Étuvé India Gate", unit: "5 kg", price: 18.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "India Gate" },
  { id: "r-ig2", name: "India Gate Jeerakasala Rice", nameFr: "Riz Jeerakasala India Gate", unit: "5 kg", price: 22.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "India Gate" },
  { id: "r-ig3", name: "India Gate Everyday Rice", nameFr: "Riz Quotidien India Gate", unit: "5 kg", price: 17.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "India Gate" },
  { id: "r-ig4", name: "India Gate Extra Long Rice", nameFr: "Riz Extra Long India Gate", unit: "5 kg", price: 28.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "India Gate" },

  // ==================== RICE - KINGS ====================
  { id: "r-k1", name: "Kings Samba Rice", nameFr: "Riz Samba Kings", unit: "5 kg", price: 21.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Kings" },
  { id: "r-k2", name: "Kings Red Samba", nameFr: "Riz Samba Rouge Kings", unit: "5 kg", price: 23.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Kings" },
  { id: "r-k3", name: "Kings Parboiled Red Country Rice", nameFr: "Riz Rouge Étuvé Kings", unit: "5 kg", price: 22.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Kings" },
  { id: "r-k4", name: "Kings Indian Extra Long Basmati", nameFr: "Riz Basmati Extra Long Indien Kings", unit: "5 kg", price: 29.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Kings" },

  // ==================== RICE - SUBASH ====================
  { id: "r-s1", name: "Subash Thanjavur Ponni Parboiled", nameFr: "Riz Ponni Thanjavur Étuvé Subash", unit: "5 kg", price: 19.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Subash" },
  { id: "r-s2", name: "Subash Ponni Parboiled", nameFr: "Riz Ponni Étuvé Subash", unit: "5 kg", price: 18.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Subash" },
  { id: "r-s3", name: "Subash Kerala Red Matta", nameFr: "Riz Rouge Matta Kerala Subash", unit: "5 kg", price: 24.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Subash" },

  // ==================== RICE - OTHER BRANDS ====================
  { id: "r-o1", name: "Le Dragon Siam Jasmine Rice", nameFr: "Riz Jasmin Siam Le Dragon", unit: "5 kg", price: 21.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Le Dragon" },
  { id: "r-o2", name: "Le Dragon Broken Rice", nameFr: "Riz Brisé Le Dragon", unit: "5 kg", price: 14.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Le Dragon" },
  { id: "r-o3", name: "Omni Basmati Rice", nameFr: "Riz Basmati Omni", unit: "5 kg", price: 22.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Omni" },
  { id: "r-o4", name: "Barkat Gold Basmati", nameFr: "Riz Basmati Or Barkat", unit: "5 kg", price: 25.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Barkat" },
  { id: "r-o5", name: "Barkat Golden Sella", nameFr: "Riz Sella Doré Barkat", unit: "5 kg", price: 23.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Barkat" },
  { id: "r-o6", name: "Punjabi Biryani Rice", nameFr: "Riz Biryani Punjabi", unit: "5 kg", price: 26.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Punjabi" },
  { id: "r-o7", name: "Shazia Classic Basmati", nameFr: "Riz Basmati Classique Shazia", unit: "5 kg", price: 21.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Shazia" },
  { id: "r-o8", name: "Shazia Extra Long Basmati", nameFr: "Riz Basmati Extra Long Shazia", unit: "5 kg", price: 24.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Shazia" },
  { id: "r-o9", name: "Amma Premium Basmati", nameFr: "Riz Basmati Premium Amma", unit: "5 kg", price: 27.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Amma" },
  { id: "r-o10", name: "PC Care Biryani Rice", nameFr: "Riz Biryani PC Care", unit: "5 kg", price: 23.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "PC Care" },
  { id: "r-o11", name: "Tony's Palakkadan Matta", nameFr: "Riz Matta Palakkadan Tony's", unit: "5 kg", price: 22.90, category: "Rice & Grains", categoryFr: "Riz & Céréales", image: "/placeholder.svg", brand: "Tony's" },

  // ==================== PANTRY & CANNED GOODS ====================
  { id: "pc-1", name: "Geisha Mackerel in Tomato Sauce", nameFr: "Maquereau Geisha en Sauce Tomate", unit: "425 g", price: 4.90, category: "Pantry & Canned Goods", categoryFr: "Épicerie & Conserves", image: "/placeholder.svg" },
  { id: "pc-2", name: "Kings Jack Mackerel", nameFr: "Maquereau Jack Kings", unit: "425 g", price: 5.90, category: "Pantry & Canned Goods", categoryFr: "Épicerie & Conserves", image: "/placeholder.svg" },
  { id: "pc-3", name: "Exeter Corned Beef", nameFr: "Corned Beef Exeter", unit: "340 g", price: 6.90, category: "Pantry & Canned Goods", categoryFr: "Épicerie & Conserves", image: "/placeholder.svg" },
  { id: "pc-4", name: "Bird's Custard Powder", nameFr: "Poudre à Crème Bird's", unit: "300 g", price: 5.90, category: "Pantry & Canned Goods", categoryFr: "Épicerie & Conserves", image: "/placeholder.svg" },
  { id: "pc-5", name: "Nestlé Sweetened Condensed Milk", nameFr: "Lait Concentré Sucré Nestlé", unit: "397 g", price: 3.90, category: "Pantry & Canned Goods", categoryFr: "Épicerie & Conserves", image: "/placeholder.svg" },
  { id: "pc-6", name: "Bama Mayonnaise", nameFr: "Mayonnaise Bama", unit: "500 ml", price: 4.90, category: "Pantry & Canned Goods", categoryFr: "Épicerie & Conserves", image: "/placeholder.svg" },
  { id: "pc-7", name: "Healthy Boy Mushroom Soy Sauce", nameFr: "Sauce Soja aux Champignons Healthy Boy", unit: "700 ml", price: 5.90, category: "Pantry & Canned Goods", categoryFr: "Épicerie & Conserves", image: "/placeholder.svg" },
  { id: "pc-8", name: "Healthy Boy Sweet Soy Sauce", nameFr: "Sauce Soja Sucrée Healthy Boy", unit: "700 ml", price: 5.90, category: "Pantry & Canned Goods", categoryFr: "Épicerie & Conserves", image: "/placeholder.svg" },
  { id: "pc-9", name: "Maggi Arôme Seasoning", nameFr: "Arôme Maggi", unit: "800 ml", price: 8.90, category: "Pantry & Canned Goods", categoryFr: "Épicerie & Conserves", image: "/placeholder.svg" },
  { id: "pc-10", name: "Ali Baba Chick Peas", nameFr: "Pois Chiches Ali Baba", unit: "400 g", price: 2.90, category: "Pantry & Canned Goods", categoryFr: "Épicerie & Conserves", image: "/placeholder.svg" },
  { id: "pc-11", name: "Ali Baba Kala Chana", nameFr: "Pois Chiches Noirs Ali Baba", unit: "400 g", price: 2.90, category: "Pantry & Canned Goods", categoryFr: "Épicerie & Conserves", image: "/placeholder.svg" },
  { id: "pc-12", name: "TRS Boiled Black Eye Beans", nameFr: "Haricots à Œil Noir TRS", unit: "400 g", price: 2.50, category: "Pantry & Canned Goods", categoryFr: "Épicerie & Conserves", image: "/placeholder.svg" },
  { id: "pc-13", name: "TRS Red Kidney Beans", nameFr: "Haricots Rouges TRS", unit: "400 g", price: 2.50, category: "Pantry & Canned Goods", categoryFr: "Épicerie & Conserves", image: "/placeholder.svg" },
  { id: "pc-14", name: "Picosa Champignons (Mushrooms)", nameFr: "Champignons Picosa", unit: "400 g", price: 3.90, category: "Pantry & Canned Goods", categoryFr: "Épicerie & Conserves", image: "/placeholder.svg" },
  { id: "pc-15", name: "Aroy-D Coconut Milk", nameFr: "Lait de Coco Aroy-D", unit: "1 L", price: 4.90, category: "Pantry & Canned Goods", categoryFr: "Épicerie & Conserves", image: "/placeholder.svg" },

  // ==================== FRESH PRODUCE ====================
  { id: "fp-1", name: "Thai Eggplant (Round)", nameFr: "Aubergine Thaï (Ronde)", unit: "per kg", price: 8.90, category: "Fresh Produce", categoryFr: "Fruits & Légumes Frais", image: "/placeholder.svg" },
  { id: "fp-2", name: "Bitter Gourd (Karela)", nameFr: "Courge Amère (Karela)", unit: "per kg", price: 9.90, category: "Fresh Produce", categoryFr: "Fruits & Légumes Frais", image: "/placeholder.svg" },
  { id: "fp-3", name: "Chinese Long Beans", nameFr: "Haricots Longs Chinois", unit: "per kg", price: 7.90, category: "Fresh Produce", categoryFr: "Fruits & Légumes Frais", image: "/placeholder.svg" },
  { id: "fp-4", name: "Okra (Ladies Finger)", nameFr: "Gombo", unit: "per kg", price: 8.90, category: "Fresh Produce", categoryFr: "Fruits & Légumes Frais", image: "/placeholder.svg" },
  { id: "fp-5", name: "Rambutan", nameFr: "Ramboutan", unit: "per kg", price: 14.90, category: "Fresh Produce", categoryFr: "Fruits & Légumes Frais", image: "/placeholder.svg" },
  { id: "fp-6", name: "Mangosteen", nameFr: "Mangoustan", unit: "per kg", price: 19.90, category: "Fresh Produce", categoryFr: "Fruits & Légumes Frais", image: "/placeholder.svg" },
  { id: "fp-7", name: "Water Spinach (Morning Glory)", nameFr: "Épinard d'Eau (Liseron)", unit: "per bunch", price: 4.90, category: "Fresh Produce", categoryFr: "Fruits & Légumes Frais", image: "/placeholder.svg" },
  { id: "fp-8", name: "Fresh Coriander", nameFr: "Coriandre Fraîche", unit: "per bunch", price: 2.90, category: "Fresh Produce", categoryFr: "Fruits & Légumes Frais", image: "/placeholder.svg" },
  { id: "fp-9", name: "Aubergine (Purple Eggplant)", nameFr: "Aubergine Violette", unit: "per kg", price: 5.90, category: "Fresh Produce", categoryFr: "Fruits & Légumes Frais", image: "/placeholder.svg" },
  { id: "fp-10", name: "Red Bell Pepper", nameFr: "Poivron Rouge", unit: "per kg", price: 6.90, category: "Fresh Produce", categoryFr: "Fruits & Légumes Frais", image: "/placeholder.svg" },
  { id: "fp-11", name: "Green Mango", nameFr: "Mangue Verte", unit: "per kg", price: 8.90, category: "Fresh Produce", categoryFr: "Fruits & Légumes Frais", image: "/placeholder.svg" },
  { id: "fp-12", name: "Pak Choi", nameFr: "Pak Choï", unit: "per kg", price: 6.90, category: "Fresh Produce", categoryFr: "Fruits & Légumes Frais", image: "/placeholder.svg" },
  { id: "fp-13", name: "Small Bananas (Sugar Bananas)", nameFr: "Petites Bananes (Bananes Sucrées)", unit: "per kg", price: 5.90, category: "Fresh Produce", categoryFr: "Fruits & Légumes Frais", image: "/placeholder.svg" },

  // ==================== FROZEN FOOD & MISC ====================
  { id: "fm-1", name: "Spring Home TYJ Spring Roll Pastry", nameFr: "Pâte à Rouleaux de Printemps Spring Home", unit: "550 g", price: 6.90, category: "Frozen & Misc", categoryFr: "Surgelés & Divers", image: "/placeholder.svg" },
  { id: "fm-2", name: "Ajinomoto Gyoza", nameFr: "Gyoza Ajinomoto", unit: "600 g", price: 9.90, category: "Frozen & Misc", categoryFr: "Surgelés & Divers", image: "/placeholder.svg" },
  { id: "fm-3", name: "Vatika Hair Oil", nameFr: "Huile Capillaire Vatika", unit: "300 ml", price: 7.90, category: "Frozen & Misc", categoryFr: "Surgelés & Divers", image: "/placeholder.svg" },
  { id: "fm-4", name: "Johnson's Baby Lotion", nameFr: "Lotion Bébé Johnson's", unit: "500 ml", price: 8.90, category: "Frozen & Misc", categoryFr: "Surgelés & Divers", image: "/placeholder.svg" },
  { id: "fm-5", name: "Skala Expert Hair Treatment", nameFr: "Traitement Capillaire Skala Expert", unit: "1 kg", price: 12.90, category: "Frozen & Misc", categoryFr: "Surgelés & Divers", image: "/placeholder.svg" },
  { id: "fm-6", name: "Kings Rice Cooker", nameFr: "Cuiseur à Riz Kings", unit: "1 unit", price: 49.90, category: "Frozen & Misc", categoryFr: "Surgelés & Divers", image: "/placeholder.svg" },
  { id: "fm-7", name: "Tiger Balm", nameFr: "Baume du Tigre", unit: "30 g", price: 8.90, category: "Frozen & Misc", categoryFr: "Surgelés & Divers", image: "/placeholder.svg" },
  { id: "fm-8", name: "Hem Incense Sticks", nameFr: "Bâtons d'Encens Hem", unit: "20 sticks", price: 3.90, category: "Frozen & Misc", categoryFr: "Surgelés & Divers", image: "/placeholder.svg" },
];

export const categories: Category[] = [
  { id: "seafood", name: "Fresh Seafood & Fish", nameFr: "Poissons & Fruits de Mer Frais", icon: "🐟", count: 11 },
  { id: "butcher", name: "Butcher", nameFr: "Boucherie", icon: "🥩", count: 4 },
  { id: "rice", name: "Rice & Grains", nameFr: "Riz & Céréales", icon: "🍚", count: 38 },
  { id: "pantry", name: "Pantry & Canned Goods", nameFr: "Épicerie & Conserves", icon: "🥫", count: 15 },
  { id: "produce", name: "Fresh Produce", nameFr: "Fruits & Légumes Frais", icon: "🥬", count: 13 },
  { id: "frozen", name: "Frozen & Misc", nameFr: "Surgelés & Divers", icon: "❄️", count: 8 },
];
