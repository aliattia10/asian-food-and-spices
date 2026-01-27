import { Truck, Star, BadgePercent, LeafyGreen, Award, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const WhyUs = () => {
  const { t, language } = useLanguage();
  
  const features = [
    {
      icon: Award,
      title: t('qualityProducts'),
      description: t('qualityDesc'),
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Truck,
      title: t('fastDelivery'),
      description: t('deliveryDesc'),
      color: 'bg-accent/10 text-accent-foreground',
    },
    {
      icon: BadgePercent,
      title: t('bestPrices'),
      description: t('pricesDesc'),
      color: 'bg-secondary/10 text-secondary-foreground',
    },
    {
      icon: LeafyGreen,
      title: t('freshProducts'),
      description: t('freshDesc'),
      color: 'bg-green-500/10 text-green-700',
    },
  ];
  
  return (
    <section className="py-20 bg-card relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full -translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Heart className="h-4 w-4" />
            <span className="text-sm font-medium">{language === 'fr' ? 'Notre Engagement' : 'Our Commitment'}</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('whyShopWithUs')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('whyUsSubtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group flex flex-col items-center text-center p-8 rounded-2xl bg-background border border-border hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇹🇭</span>
            <span className="text-sm">Thaïlande</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇻🇳</span>
            <span className="text-sm">Vietnam</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇨🇳</span>
            <span className="text-sm">Chine</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇯🇵</span>
            <span className="text-sm">Japon</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇮🇳</span>
            <span className="text-sm">Inde</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇰🇷</span>
            <span className="text-sm">Corée</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇮🇩</span>
            <span className="text-sm">Indonésie</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇵🇭</span>
            <span className="text-sm">Philippines</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
