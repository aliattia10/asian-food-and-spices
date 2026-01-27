import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface Translations {
  [key: string]: {
    fr: string;
    en: string;
  };
}

export const translations: Translations = {
  // Navigation
  home: { fr: "Accueil", en: "Home" },
  shop: { fr: "Boutique", en: "Shop" },
  categories: { fr: "Catégories", en: "Categories" },
  contact: { fr: "Contact", en: "Contact" },
  cart: { fr: "Panier", en: "Cart" },
  
  // Hero
  heroTitle: { fr: "L'Authenticité de l'Asie à Votre Table", en: "Authentic Asia on Your Table" },
  heroSubtitle: { fr: "Depuis 2015, nous sélectionnons les meilleurs épices, sauces et ingrédients d'Asie pour apporter les saveurs authentiques de l'Orient dans votre cuisine à Genève.", en: "Since 2015, we carefully select the finest spices, sauces, and ingredients from Asia to bring authentic Oriental flavors to your kitchen in Geneva." },
  shopNow: { fr: "Explorer la Boutique", en: "Explore Our Shop" },
  viewAll: { fr: "Voir tout", en: "View All" },
  
  // Categories
  featuredCategories: { fr: "Explorez Nos Saveurs", en: "Explore Our Flavors" },
  exploreCategories: { fr: "Chaque catégorie raconte une histoire culinaire unique d'Asie", en: "Each category tells a unique culinary story from Asia" },
  
  // Products
  featuredProducts: { fr: "Nos Incontournables", en: "Must-Have Essentials" },
  bestSellers: { fr: "Les favoris de notre communauté, sélectionnés avec soin", en: "Community favorites, carefully curated for you" },
  allProducts: { fr: "Tous les Produits", en: "All Products" },
  addToCart: { fr: "Ajouter au panier", en: "Add to Cart" },
  viewProduct: { fr: "Voir le produit", en: "View Product" },
  price: { fr: "Prix", en: "Price" },
  quantity: { fr: "Quantité", en: "Quantity" },
  relatedProducts: { fr: "Vous aimerez aussi", en: "You'll Also Love" },
  
  // Cart
  yourCart: { fr: "Votre Panier", en: "Your Cart" },
  cartEmpty: { fr: "Votre panier est vide", en: "Your cart is empty" },
  continueShopping: { fr: "Continuer vos achats", en: "Continue Shopping" },
  subtotal: { fr: "Sous-total", en: "Subtotal" },
  checkout: { fr: "Commander", en: "Checkout" },
  remove: { fr: "Supprimer", en: "Remove" },
  
  // Checkout
  checkoutTitle: { fr: "Finaliser la commande", en: "Complete Your Order" },
  customerInfo: { fr: "Informations client", en: "Customer Information" },
  firstName: { fr: "Prénom", en: "First Name" },
  lastName: { fr: "Nom", en: "Last Name" },
  email: { fr: "Email", en: "Email" },
  phone: { fr: "Téléphone", en: "Phone" },
  address: { fr: "Adresse", en: "Address" },
  city: { fr: "Ville", en: "City" },
  postalCode: { fr: "Code postal", en: "Postal Code" },
  deliveryOption: { fr: "Option de livraison", en: "Delivery Option" },
  delivery: { fr: "Livraison à domicile", en: "Home Delivery" },
  pickup: { fr: "Retrait en magasin", en: "Store Pickup" },
  orderSummary: { fr: "Résumé de la commande", en: "Order Summary" },
  placeOrder: { fr: "Passer la commande", en: "Place Order" },
  orderSuccess: { fr: "Commande confirmée!", en: "Order Confirmed!" },
  orderSuccessMessage: { fr: "Merci pour votre commande. Vous recevrez un email de confirmation.", en: "Thank you for your order. You will receive a confirmation email." },
  
  // Why Us
  whyShopWithUs: { fr: "Pourquoi Nous Faire Confiance", en: "Why Trust Us" },
  whyUsSubtitle: { fr: "Plus qu'une épicerie, une passerelle vers l'Asie authentique", en: "More than a grocery store, a gateway to authentic Asia" },
  qualityProducts: { fr: "Sélection Rigoureuse", en: "Rigorous Selection" },
  qualityDesc: { fr: "Chaque produit est soigneusement choisi auprès de producteurs artisanaux d'Asie", en: "Each product is carefully chosen from artisan producers across Asia" },
  fastDelivery: { fr: "Livraison Express", en: "Express Delivery" },
  deliveryDesc: { fr: "Livraison dans toute la région genevoise sous 24-48h", en: "Delivery across the Geneva region within 24-48h" },
  bestPrices: { fr: "Prix Justes", en: "Fair Prices" },
  pricesDesc: { fr: "Import direct pour des prix accessibles sans compromis sur la qualité", en: "Direct import for accessible prices without compromising quality" },
  freshProducts: { fr: "Fraîcheur Garantie", en: "Guaranteed Freshness" },
  freshDesc: { fr: "Légumes, herbes et produits frais chaque semaine", en: "Fresh vegetables, herbs and produce every week" },
  
  // Brand Story
  ourStory: { fr: "Notre Histoire", en: "Our Story" },
  storyTitle: { fr: "Une Passion Née des Voyages", en: "A Passion Born from Travels" },
  storyIntro: { fr: "Asian food and spices est né d'une passion profonde pour les cuisines asiatiques, découverte au fil de voyages à travers la Thaïlande, le Vietnam, la Chine, le Japon et l'Inde. Nous avons rapporté ces saveurs à Genève pour les partager avec vous.", en: "Asian food and spices was born from a deep passion for Asian cuisines, discovered through travels across Thailand, Vietnam, China, Japan and India. We brought these flavors to Geneva to share with you." },
  storyOriginTitle: { fr: "Sources Authentiques", en: "Authentic Sources" },
  storyOriginText: { fr: "Nous travaillons directement avec des producteurs locaux en Asie – des fermes d'épices du Kerala aux ateliers de sauce soja artisanale au Japon.", en: "We work directly with local producers in Asia – from spice farms in Kerala to artisan soy sauce workshops in Japan." },
  storyPassionTitle: { fr: "Avec Amour", en: "Made with Love" },
  storyPassionText: { fr: "Chaque produit que nous sélectionnons raconte une histoire. Nous testons tout personnellement avant de le proposer dans notre boutique.", en: "Every product we select tells a story. We personally taste and test everything before offering it in our store." },
  storyCommunityTitle: { fr: "Pour la Communauté", en: "For the Community" },
  storyCommunityText: { fr: "Nous aimons partager des recettes, des conseils et notre passion avec la communauté asiatique et les curieux de Genève.", en: "We love sharing recipes, tips and our passion with the Asian community and curious food lovers in Geneva." },
  storyQuote: { fr: "La cuisine est un voyage. Chaque épice, chaque sauce porte en elle des siècles de tradition et d'amour.", en: "Cooking is a journey. Every spice, every sauce carries within it centuries of tradition and love." },
  storyQuoteAuthor: { fr: "L'équipe Asian food and spices", en: "The Asian food and spices team" },
  
  // Newsletter
  newsletter: { fr: "Restez Connectés", en: "Stay Connected" },
  newsletterTitle: { fr: "Rejoignez Notre Communauté Gourmande", en: "Join Our Foodie Community" },
  newsletterText: { fr: "Recettes exclusives, nouveaux arrivages, promotions spéciales et conseils culinaires directement dans votre boîte mail.", en: "Exclusive recipes, new arrivals, special promotions and cooking tips delivered to your inbox." },
  emailPlaceholder: { fr: "Votre email", en: "Your email" },
  subscribe: { fr: "S'inscrire", en: "Subscribe" },
  
  // Footer
  aboutUs: { fr: "À Propos", en: "About Us" },
  aboutText: { fr: "Asian food and spices SÀRL est votre épicerie asiatique de confiance à Genève depuis 2015. Nous importons avec passion des produits authentiques pour vous offrir le meilleur de l'Asie.", en: "Asian food and spices SÀRL has been your trusted Asian grocery in Geneva since 2015. We passionately import authentic products to bring you the best of Asia." },
  quickLinks: { fr: "Liens Rapides", en: "Quick Links" },
  contactUs: { fr: "Contactez-nous", en: "Contact Us" },
  openingHours: { fr: "Horaires d'ouverture", en: "Opening Hours" },
  mondayFriday: { fr: "Lundi - Vendredi", en: "Monday - Friday" },
  saturday: { fr: "Samedi", en: "Saturday" },
  sunday: { fr: "Dimanche", en: "Sunday" },
  closed: { fr: "Fermé", en: "Closed" },
  allRightsReserved: { fr: "Tous droits réservés", en: "All rights reserved" },
  
  // Filter
  filterByCategory: { fr: "Filtrer par catégorie", en: "Filter by Category" },
  allCategories: { fr: "Toutes les catégories", en: "All Categories" },
  searchProducts: { fr: "Rechercher des produits...", en: "Search products..." },
  noProductsFound: { fr: "Aucun produit trouvé", en: "No products found" },
  products: { fr: "produits", en: "products" },
  backToShop: { fr: "Retour à la boutique", en: "Back to Shop" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');
  
  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
