import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { products } from '@/data/products';
import { productImageUrl } from '@/lib/productImageUrl';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useBusinessAuth } from '@/contexts/BusinessAuthContext';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, Minus, Plus, ArrowLeft, Package } from 'lucide-react';

function isPerKiloProduct(product: { is_per_unit: boolean; unit_of_measure: string }): boolean {
  return product.is_per_unit && product.unit_of_measure === 'kg';
}

const GRAM_STEP = 100;
const MIN_GRAMS = 100;

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { customerType, isBusinessAuthenticated } = useBusinessAuth();
  const [quantity, setQuantity] = useState(1);
  const [grams, setGrams] = useState(500);

  const handleGramsChange = useCallback((value: string) => {
    const parsed = parseInt(value, 10);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      setGrams(Math.max(MIN_GRAMS, Math.round(parsed / 50) * 50));
    }
  }, []);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('productNotFound')}</h1>
          <Button asChild>
            <Link to="/shop">{t('backToShop')}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const perKilo = isPerKiloProduct(product);
  const isBusiness = isBusinessAuthenticated && customerType === 'business';
  const hasBoxInfo = product.boxQuantity && product.boxUnitSize;

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const effectiveQuantity = perKilo ? grams / 1000 : quantity;

  const handleAddToCart = () => {
    addToCart(product, effectiveQuantity);
    const displayName = language === 'fr' ? product.shortNameFr : product.shortName;
    const qtyLabel = perKilo ? `${grams}g` : `${quantity}x`;
    toast({
      title: t('productAdded'),
      description: `${qtyLabel} ${displayName} ${t('addedToCartWithQty')}`,
    });
  };

  const displayPrice = perKilo
    ? product.price * (grams / 1000)
    : product.price * quantity;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToShop')}
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square bg-muted rounded-xl overflow-hidden">
            <img
              src={productImageUrl(product.image)}
              alt={language === 'fr' ? product.shortNameFr : product.shortName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-primary font-medium mb-2">
              {language === 'fr' ? product.categoryFr : product.category}
            </p>

            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              {language === 'fr' ? product.shortNameFr : product.shortName}
            </h1>

            {product.brand && (
              <p className="text-muted-foreground text-lg mb-4">{product.brand}</p>
            )}

            <p className="text-3xl font-bold text-primary mb-2">
              CHF {product.price.toFixed(2)}
              {perKilo && (
                <span className="text-base font-normal text-muted-foreground"> / kg</span>
              )}
            </p>

            <p className="text-muted-foreground mb-2">
              <span className="font-medium text-foreground">{t('unitFormat')}:</span>{' '}
              {product.unit}
              {product.size_variant && (
                <span className="text-muted-foreground"> · {product.size_variant}</span>
              )}
            </p>

            {isBusiness && hasBoxInfo && (
              <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-2 rounded-lg mb-4">
                <Package className="h-4 w-4 shrink-0" />
                <span>
                  {language === 'fr'
                    ? `Prix pro : CHF ${product.price.toFixed(2)} pour le carton complet (${product.boxQuantity}×${product.boxUnitSize})`
                    : `Trade price: CHF ${product.price.toFixed(2)} per full case (${product.boxQuantity}×${product.boxUnitSize})`}
                </span>
              </div>
            )}

            <p className="text-muted-foreground mb-6">{t('productGuarantee')}</p>

            {perKilo ? (
              <div className="mb-6 space-y-3">
                <span className="font-medium">
                  {language === 'fr' ? 'Poids :' : 'Weight:'}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setGrams((g) => Math.max(MIN_GRAMS, g - GRAM_STEP))}
                      className="p-2 hover:bg-muted transition-colors"
                      disabled={grams <= MIN_GRAMS}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <Input
                      type="number"
                      min={MIN_GRAMS}
                      step={50}
                      value={grams}
                      onChange={(e) => handleGramsChange(e.target.value)}
                      className="w-20 text-center border-0 focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => setGrams((g) => g + GRAM_STEP)}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-muted-foreground">g</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[100, 250, 500, 1000, 2000].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGrams(g)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        grams === g
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      {g >= 1000 ? `${g / 1000} kg` : `${g} g`}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Total estimé :' : 'Estimated total:'}{' '}
                  <span className="font-medium text-foreground">
                    CHF {displayPrice.toFixed(2)}
                  </span>
                </p>
              </div>
            ) : (
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
            )}

            <Button size="lg" onClick={handleAddToCart} className="w-full md:w-auto gap-2">
              <ShoppingCart className="h-5 w-5" />
              {t('addToCart')}
            </Button>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-6">{t('relatedProducts')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
