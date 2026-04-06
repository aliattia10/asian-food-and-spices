import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useBusinessAuth } from '@/contexts/BusinessAuthContext';
import { productImageUrl } from '@/lib/productImageUrl';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package } from 'lucide-react';

function isPerKiloItem(product: { is_per_unit: boolean; unit_of_measure: string }): boolean {
  return product.is_per_unit && product.unit_of_measure === 'kg';
}

function formatCartQuantity(qty: number, perKilo: boolean, language: string): string {
  if (!perKilo) return String(qty);
  const grams = Math.round(qty * 1000);
  if (grams >= 1000 && grams % 1000 === 0) return `${grams / 1000} kg`;
  return `${grams} g`;
}

const GRAM_STEP = 0.1;

const Cart = () => {
  const { t, language } = useLanguage();
  const { items, updateQuantity, removeFromCart, getTotal } = useCart();
  const { customerType, minimumRetailOrderChf, isBusinessAuthenticated } = useBusinessAuth();
  const subtotal = getTotal();
  const retailMinMissing = customerType === 'retail' && subtotal < minimumRetailOrderChf;
  const isBusiness = isBusinessAuthenticated && customerType === 'business';

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-3">{t('cartEmpty')}</h1>
            <p className="text-muted-foreground mb-6">{t('cartEmptyDesc')}</p>
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
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">{t('yourCart')}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const perKilo = isPerKiloItem(item.product);
              const displayName =
                language === 'fr' ? item.product.shortNameFr : item.product.shortName;
              const qtyDisplay = formatCartQuantity(item.quantity, perKilo, language);
              const lineTotal = item.product.price * item.quantity;
              const hasBoxInfo = item.product.boxQuantity && item.product.boxUnitSize;

              return (
                <div
                  key={item.product.id}
                  className="flex gap-4 bg-card border border-border rounded-xl p-4"
                >
                  <Link to={`/product/${item.product.id}`} className="shrink-0">
                    <img
                      src={productImageUrl(item.product.image)}
                      alt={displayName}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="font-medium hover:text-primary transition-colors line-clamp-2">
                        {displayName}
                        <span className="text-muted-foreground font-normal">
                          {' '}
                          · {item.product.unit}
                        </span>
                      </h3>
                    </Link>
                    {item.product.brand && (
                      <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                    )}
                    {isBusiness && hasBoxInfo && (
                      <p className="text-xs text-primary mt-0.5 flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {language === 'fr'
                          ? `Carton: ${item.product.boxQuantity}×${item.product.boxUnitSize}`
                          : `Case: ${item.product.boxQuantity}×${item.product.boxUnitSize}`}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mb-2">
                      {qtyDisplay} × CHF {item.product.price.toFixed(2)} = CHF{' '}
                      {lineTotal.toFixed(2)}
                    </p>
                    <p className="font-bold text-primary">CHF {item.product.price.toFixed(2)}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    {perKilo ? (
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              Math.max(GRAM_STEP, parseFloat((item.quantity - GRAM_STEP).toFixed(2))),
                            )
                          }
                          className="p-1.5 hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <Input
                          type="number"
                          min={0.1}
                          step={0.05}
                          value={Math.round(item.quantity * 1000)}
                          onChange={(e) => {
                            const g = parseInt(e.target.value, 10);
                            if (!Number.isNaN(g) && g >= 50) {
                              updateQuantity(item.product.id, g / 1000);
                            }
                          }}
                          className="w-16 text-center text-sm border-0 focus-visible:ring-0 p-0 h-auto [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          title="grams"
                        />
                        <span className="text-xs text-muted-foreground pr-1">g</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              parseFloat((item.quantity + GRAM_STEP).toFixed(2)),
                            )
                          }
                          className="p-1.5 hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1.5 hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1.5 hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold mb-4">{t('orderSummary')}</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => {
                  const perKilo = isPerKiloItem(item.product);
                  const qtyLabel = formatCartQuantity(item.quantity, perKilo, language);
                  return (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate pr-2">
                        {qtyLabel}{' '}
                        {language === 'fr' ? item.product.shortNameFr : item.product.shortName} (
                        {item.product.unit})
                      </span>
                      <span className="shrink-0">
                        CHF {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('subtotal')}</span>
                  <span>CHF {subtotal.toFixed(2)}</span>
                </div>
              </div>

              {retailMinMissing && (
                <p className="text-xs text-amber-600 mb-4">
                  {language === 'fr'
                    ? `Commande minimum particuliers: CHF ${minimumRetailOrderChf.toFixed(2)}`
                    : `Retail minimum order: CHF ${minimumRetailOrderChf.toFixed(2)}`}
                </p>
              )}

              {retailMinMissing ? (
                <Button className="w-full gap-2" disabled>
                  {t('checkout')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button asChild className="w-full gap-2">
                  <Link to="/checkout">
                    {t('checkout')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}

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
