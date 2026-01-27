import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  const { t, language } = useLanguage();
  
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-accent/20" />
      
      {/* Decorative Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20S0 28.954 0 40s8.954 20 20 20 20-8.954 20-20zm20 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Floating Spice Elements */}
      <div className="absolute top-20 left-10 text-6xl opacity-20 animate-pulse">🌶️</div>
      <div className="absolute top-40 right-20 text-5xl opacity-15 animate-pulse delay-300">⭐</div>
      <div className="absolute bottom-32 left-20 text-4xl opacity-20 animate-pulse delay-500">🍃</div>
      <div className="absolute bottom-20 right-40 text-5xl opacity-15 animate-pulse delay-700">🧄</div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm text-foreground px-5 py-2.5 rounded-full mb-8 shadow-lg border border-border">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">
              {language === 'fr' ? 'Depuis 2015 à Genève' : 'Since 2015 in Geneva'}
            </span>
            <span className="text-lg">🇨🇭</span>
          </div>
          
          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-8 leading-[1.1]">
            {t('heroTitle')}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            {t('heroSubtitle')}
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button asChild size="lg" className="text-base md:text-lg px-8 py-6 gap-2 group shadow-lg">
              <Link to="/shop">
                {t('shopNow')}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base md:text-lg px-8 py-6 bg-card/50 backdrop-blur-sm">
              <Link to="/contact">
                {language === 'fr' ? 'Nous Visiter' : 'Visit Us'}
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-8 md:gap-12 pt-8 border-t border-border/50">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary font-display">200+</p>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                {language === 'fr' ? 'Produits Authentiques' : 'Authentic Products'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary font-display">8</p>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                {language === 'fr' ? 'Pays d\'Origine' : 'Countries of Origin'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary font-display">9</p>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                {language === 'fr' ? 'Ans d\'Expertise' : 'Years of Expertise'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Large Decorative Element */}
      <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-4 text-[8rem] opacity-10 pointer-events-none pr-12">
        <span className="rotate-12">🥢</span>
        <span className="-rotate-6 ml-8">🍜</span>
      </div>
    </section>
  );
};

export default Hero;
