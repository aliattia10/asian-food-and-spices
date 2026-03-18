import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find((p) => p.id === id);
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t('productNotFound')}
          </h1>
          <Button asChild>
            <Link to="/shop">{t('backToShop')}</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: t('productAdded'),
      description: `${quantity}x ${language === 'fr' ? product.nameFr : product.name} ${t('addedToCartWithQty')}`,
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToShop')}
        </Link>
        
        {/* Product */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="aspect-square bg-muted rounded-xl overflow-hidden">
            <img
              src={product.image}
              alt={language === 'fr' ? product.nameFr : product.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder.svg"; }}
            />
          </div>
          
          {/* Details */}
          <div className="flex flex-col">
            <p className="text-sm text-primary font-medium mb-2">
              {language === 'fr' ? product.categoryFr : product.category}
            </p>
            
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {language === 'fr' ? product.nameFr : product.name}
            </h1>
            
            <p className="text-3xl font-bold text-primary mb-2">
              CHF {product.price.toFixed(2)}
            </p>
            
            <p className="text-muted-foreground mb-6">
              <span className="font-medium text-foreground">{t('unitFormat')}:</span>{' '}
              {product.unit}
              {product.size_variant && (
                <span className="text-muted-foreground"> · {product.size_variant}</span>
              )}
            </p>
            
            <p className="text-muted-foreground mb-8">
              {t('productGuarantee')}
            </p>
            
            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium">{t('quantity')}:</span>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Add to Cart */}
            <Button 
              size="lg" 
              onClick={handleAddToCart}
              className="w-full md:w-auto gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {t('addToCart')}
            </Button>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-6">
              {t('relatedProducts')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
