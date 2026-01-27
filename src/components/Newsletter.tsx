import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Gift, ChefHat, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Newsletter = () => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: language === 'fr' ? 'Bienvenue!' : 'Welcome!',
        description: language === 'fr' 
          ? 'Vous êtes maintenant inscrit à notre newsletter.'
          : 'You are now subscribed to our newsletter.',
      });
      setEmail('');
    }
  };
  
  const benefits = [
    { icon: Gift, text: language === 'fr' ? 'Offres exclusives' : 'Exclusive offers' },
    { icon: ChefHat, text: language === 'fr' ? 'Recettes authentiques' : 'Authentic recipes' },
    { icon: Sparkles, text: language === 'fr' ? 'Nouveaux arrivages' : 'New arrivals' },
  ];
  
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/4 text-6xl opacity-10">🌶️</div>
      <div className="absolute top-1/3 right-1/4 text-5xl opacity-10">⭐</div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Mail className="h-4 w-4" />
            <span className="text-sm font-medium">{t('newsletter')}</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('newsletterTitle')}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            {t('newsletterText')}
          </p>
          
          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <benefit.icon className="h-4 w-4" />
                <span className="text-sm">{benefit.text}</span>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 h-12"
              required
            />
            <Button 
              type="submit"
              variant="secondary" 
              size="lg"
              className="h-12 px-8 font-semibold shadow-lg"
            >
              {t('subscribe')}
            </Button>
          </form>
          
          <p className="text-primary-foreground/60 text-sm mt-4">
            {language === 'fr' 
              ? '🔒 Nous respectons votre vie privée. Désabonnement à tout moment.'
              : '🔒 We respect your privacy. Unsubscribe anytime.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
