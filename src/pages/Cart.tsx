import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { t, language } = useLanguage();
  const { items, updateQuantity, removeFromCart, getTotal } = useCart();
  
  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-3">
              {t('cartEmpty')}
            </h1>
            <p className="text-muted-foreground mb-6">
              {t('cartEmptyDesc')}
            </p>
            <Button asChild>
              <Link to="/shop">{t('continueShopping')}</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
          {t('yourCart')}
        </h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div 
                key={item.product.id}
                className="flex gap-4 bg-card border border-border rounded-xl p-4"
              >
                {/* Image */}
                <Link to={`/product/${item.product.id}`} className="shrink-0">
                  <img
                    src={item.product.image}
                    alt={language === 'fr' ? item.product.nameFr : item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>
                
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-medium hover:text-primary transition-colors line-clamp-2">
                      {language === 'fr' ? item.product.nameFr : item.product.name}
                      <span className="text-muted-foreground font-normal"> · {item.product.unit}</span>
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.quantity} × CHF {item.product.price.toFixed(2)} = CHF {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="font-bold text-primary">
                    CHF {item.product.price.toFixed(2)}
                  </p>
                </div>
                
                {/* Quantity & Remove */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-muted transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold mb-4">
                {t('orderSummary')}
              </h2>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate pr-2">
                      {item.quantity}× {language === 'fr' ? item.product.nameFr : item.product.name} ({item.product.unit})
                    </span>
                    <span className="shrink-0">
                      CHF {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('subtotal')}</span>
                  <span>CHF {getTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <Button asChild className="w-full gap-2">
                <Link to="/checkout">
                  {t('checkout')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              
              <Link 
                to="/shop"
                className="block text-center text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
              >
                {t('continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
