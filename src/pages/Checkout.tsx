import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useBusinessAuth } from '@/contexts/BusinessAuthContext';
import { apiUrl, cartHeaders, CART_SESSION_STORAGE_KEY } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Truck, Store, Check } from 'lucide-react';

const Checkout = () => {
  const { t, language } = useLanguage();
  const { items, getTotal, clearCart, useBackendCart } = useCart();
  const { customerType, minimumRetailOrderChf, isBusinessAuthenticated, businessProfile } = useBusinessAuth();
  const navigate = useNavigate();
  const subtotal = getTotal();
  const retailMinMissing = customerType === 'retail' && subtotal < minimumRetailOrderChf;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryOption: 'delivery',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (retailMinMissing) {
      toast({
        title: language === 'fr' ? 'Montant minimum requis' : 'Minimum order required',
        description:
          language === 'fr'
            ? `La commande minimum pour les particuliers est de CHF ${minimumRetailOrderChf.toFixed(2)}.`
            : `Minimum order for retail customers is CHF ${minimumRetailOrderChf.toFixed(2)}.`,
      });
      return;
    }
    setIsSubmitting(true);

    try {
      if (useBackendCart) {
        const cartId = localStorage.getItem(CART_SESSION_STORAGE_KEY);
        const res = await fetch(apiUrl('/api/orders'), {
          method: 'POST',
          headers: cartHeaders(cartId),
          body: JSON.stringify({
            ...formData,
            customerType: isBusinessAuthenticated ? 'business' : 'retail',
          }),
        });
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
          minimumRetailOrderChf?: number;
          orderId?: string;
        };
        if (!res.ok) {
          toast({
            variant: 'destructive',
            title: language === 'fr' ? 'Commande refusée' : 'Order failed',
            description:
              body.error === 'Minimum order not met'
                ? language === 'fr'
                  ? `Montant minimum CHF ${body.minimumRetailOrderChf?.toFixed(2) ?? '50.00'}`
                  : `Minimum order CHF ${body.minimumRetailOrderChf?.toFixed(2) ?? '50.00'}`
                : body.error || (language === 'fr' ? 'Réessayez plus tard.' : 'Please try again.'),
          });
          return;
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      setOrderComplete(true);
      clearCart();

      toast({
        title: t('orderSuccess'),
        description: t('orderSuccessMessage'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (items.length === 0 && !orderComplete) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t('cartEmpty')}
          </h1>
          <Button asChild>
            <Link to="/shop">{t('continueShopping')}</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  if (orderComplete) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-3">
              {t('orderSuccess')}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t('orderSuccessMessage')}
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
        <Link 
          to="/cart" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('cart')}
        </Link>
        
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
          {t('checkoutTitle')}
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Info */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-display text-xl font-bold mb-6">
                  {t('customerInfo')}
                </h2>
                {isBusinessAuthenticated && businessProfile && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'fr'
                      ? `Compte pro: ${businessProfile.businessName} (${businessProfile.swissBusinessNumber})`
                      : `Business account: ${businessProfile.businessName} (${businessProfile.swissBusinessNumber})`}
                  </p>
                )}
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t('firstName')} *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t('lastName')} *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('email')} *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t('phone')} *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>
              
              {/* Delivery Option */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-display text-xl font-bold mb-6">
                  {t('deliveryOption')}
                </h2>
                
                <RadioGroup
                  value={formData.deliveryOption}
                  onValueChange={(value) => setFormData({ ...formData, deliveryOption: value })}
                  className="space-y-3"
                >
                  <label className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Truck className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{t('delivery')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('deliveryToAddress')}
                      </p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Store className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{t('pickup')}</p>
                      <p className="text-sm text-muted-foreground">
                        Rue du Commerce 15, 1204 Genève
                      </p>
                    </div>
                  </label>
                </RadioGroup>
                
                {formData.deliveryOption === 'delivery' && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="address">{t('address')} *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="mt-1.5"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">{t('city')} *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">{t('postalCode')} *</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          required
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h2 className="font-display text-xl font-bold mb-4">
                  {t('orderSummary')}
                </h2>
                
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => {
                    const perKilo = item.product.is_per_unit && item.product.unit_of_measure === 'kg';
                    const grams = Math.round(item.quantity * 1000);
                    const qtyLabel = perKilo
                      ? (grams >= 1000 && grams % 1000 === 0 ? `${grams/1000} kg` : `${grams} g`)
                      : `${item.quantity}×`;
                    return (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate pr-2">
                        {qtyLabel} {language === 'fr' ? item.product.shortNameFr : item.product.shortName} ({item.product.unit})
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
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || retailMinMissing}
                >
                  {isSubmitting ? t('processing') : t('placeOrder')}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
