import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import WhyUs from '@/components/WhyUs';
import Newsletter from '@/components/Newsletter';
import BrandStory from '@/components/BrandStory';
import { Button } from '@/components/ui/button';
import { products, categories } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Sparkles } from 'lucide-react';

const Index = () => {
  const { t, language } = useLanguage();
  
  const featuredProducts = products.slice(0, 8);
  const displayCategories = categories.slice(0, 6);
  
  return (
    <Layout>
      {/* Hero */}
      <Hero />
      
      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">{language === 'fr' ? 'Découvrez' : 'Discover'}</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t('featuredCategories')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('exploreCategories')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/shop">
                {t('viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Brand Story */}
      <BrandStory />
      
      {/* Why Us */}
      <WhyUs />
      
      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <span className="text-lg">⭐</span>
              <span className="text-sm font-medium">{language === 'fr' ? 'Sélection' : 'Selection'}</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t('featuredProducts')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('bestSellers')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" className="gap-2 px-8">
              <Link to="/shop">
                {language === 'fr' ? 'Voir Tous les Produits' : 'View All Products'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <Newsletter />
    </Layout>
  );
};

export default Index;
