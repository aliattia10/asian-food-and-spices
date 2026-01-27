import { useLanguage } from '@/contexts/LanguageContext';

const BrandStory = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-gradient-to-b from-background to-card relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full translate-x-1/3 translate-y-1/3" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <span className="text-lg">🌿</span>
            <span className="text-sm font-medium">{t('ourStory')}</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {t('storyTitle')}
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            {t('storyIntro')}
          </p>
        </div>
        
        {/* Story Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-3xl">
              🌏
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">{t('storyOriginTitle')}</h3>
            <p className="text-muted-foreground leading-relaxed">{t('storyOriginText')}</p>
          </div>
          
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 text-3xl">
              ❤️
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">{t('storyPassionTitle')}</h3>
            <p className="text-muted-foreground leading-relaxed">{t('storyPassionText')}</p>
          </div>
          
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 text-3xl">
              🤝
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">{t('storyCommunityTitle')}</h3>
            <p className="text-muted-foreground leading-relaxed">{t('storyCommunityText')}</p>
          </div>
        </div>
        
        {/* Quote */}
        <div className="mt-16 max-w-3xl mx-auto">
          <blockquote className="relative">
            <div className="absolute -top-4 -left-4 text-6xl text-primary/20 font-display">"</div>
            <p className="text-xl md:text-2xl text-center font-display italic text-foreground/80 leading-relaxed px-8">
              {t('storyQuote')}
            </p>
            <footer className="text-center mt-6 text-muted-foreground">
              — {t('storyQuoteAuthor')}
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
