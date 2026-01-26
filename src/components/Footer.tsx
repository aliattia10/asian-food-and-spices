import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏪</span>
              <span className="font-display text-xl font-bold">Asian food and spices SÀRL</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              {t('aboutText')}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-background/70 hover:text-accent transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-background/70 hover:text-accent transition-colors">
                  {t('shop')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/70 hover:text-accent transition-colors">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">{t('contactUs')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span className="text-background/70 text-sm">
                  Rue du Commerce 15<br />
                  1204 Genève, Suisse
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <a href="mailto:info@asiamarket-geneve.ch" className="text-background/70 text-sm hover:text-accent transition-colors">
                  info@asiamarket-geneve.ch
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <a href="tel:+41221234567" className="text-background/70 text-sm hover:text-accent transition-colors">
                  +41 22 123 45 67
                </a>
              </li>
            </ul>
          </div>
          
          {/* Opening Hours */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">{t('openingHours')}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-background/70">{t('mondayFriday')}</span>
                <span className="text-background">9:00 - 19:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-background/70">{t('saturday')}</span>
                <span className="text-background">9:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-background/70">{t('sunday')}</span>
                <span className="text-background">{t('closed')}</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-background/20 mt-10 pt-6 text-center text-background/50 text-sm">
          <p>© 2026 Asian food and spices SÀRL. {t('allRightsReserved')}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
