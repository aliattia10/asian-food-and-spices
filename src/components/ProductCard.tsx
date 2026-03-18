import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: t('productAdded'),
      description: `${language === 'fr' ? product.nameFr : product.name} ${t('addedToCartSuffix')}`,
    });
  };
  
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square bg-muted overflow-hidden">
          <img
            src={imgError ? "/placeholder.svg" : product.image}
            alt={language === 'fr' ? product.nameFr : product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
          
          {/* Quick Actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              className="bg-card/90 hover:bg-card text-foreground shadow-lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="bg-card/90 hover:bg-card shadow-lg"
              asChild
            >
              <Link to={`/product/${product.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">
            {language === 'fr' ? product.categoryFr : product.category}
          </p>
          <h3 className="font-medium text-sm md:text-base line-clamp-2 min-h-[2.5rem] mb-2">
            {language === 'fr' ? product.nameFr : product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary text-lg">
              CHF {product.price.toFixed(2)}
            </span>
            <span className="text-xs font-medium text-muted-foreground" title={product.unit}>
              {product.unit}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
