import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t, language } = useLanguage();
  
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Asian food and spices" className="h-14 w-auto brightness-0 invert" />
              <div>
                <span className="font-display text-lg font-bold block">Asian food and spices</span>
                <span className="text-xs text-background/60 uppercase tracking-wider">SÀRL • Genève</span>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              {t('aboutText')}
            </p>
            {/* Social proof */}
            <div className="flex items-center gap-2 text-accent">
              <Heart className="h-4 w-4 fill-current" />
              <span className="text-sm text-background/70">
                {language === 'fr' ? 'Fait avec passion à Genève' : 'Made with passion in Geneva'}
              </span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-background/70 hover:text-accent transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-background/70 hover:text-accent transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  {t('shop')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/70 hover:text-accent transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">{t('contactUs')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-accent" />
                </div>
                <span className="text-background/70 text-sm">
                  Rue du Commerce 15<br />
                  1204 Genève, Suisse
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-accent" />
                </div>
                <a href="mailto:info@asiamarket-geneve.ch" className="text-background/70 text-sm hover:text-accent transition-colors">
                  info@asianfoodandspices.ch
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-accent" />
                </div>
                <a href="tel:+41221234567" className="text-background/70 text-sm hover:text-accent transition-colors">
                  +41 22 123 45 67
                </a>
              </li>
            </ul>
          </div>
          
          {/* Opening Hours */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">{t('openingHours')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between py-2 border-b border-background/10">
                <span className="text-background/70">{t('mondayFriday')}</span>
                <span className="text-background font-medium">9:00 - 19:00</span>
              </li>
              <li className="flex justify-between py-2 border-b border-background/10">
                <span className="text-background/70">{t('saturday')}</span>
                <span className="text-background font-medium">9:00 - 18:00</span>
              </li>
              <li className="flex justify-between py-2">
                <span className="text-background/70">{t('sunday')}</span>
                <span className="text-primary">{t('closed')}</span>
              </li>
            </ul>
            
            {/* Country flags */}
            <div className="mt-6 flex gap-2 text-2xl">
              🇹🇭 🇻🇳 🇨🇳 🇯🇵 🇮🇳 🇰🇷
            </div>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-background/50 text-sm">
          <p>© 2026 Asian food and spices SÀRL. {t('allRightsReserved')}.</p>
          <p className="flex items-center gap-2">
            <span>🇨🇭</span>
            {language === 'fr' ? 'Épicerie asiatique à Genève' : 'Asian grocery in Geneva'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
