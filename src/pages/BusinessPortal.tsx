import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBusinessAuth } from '@/contexts/BusinessAuthContext';
import { toast } from '@/hooks/use-toast';
import { Building2, ShieldCheck } from 'lucide-react';

const SWISS_UID_REGEX = /^CH[EI][\s.-]?\d{3}[\s.-]?\d{3}[\s.-]?\d{3}$/i;

const BusinessPortal = () => {
  const { language } = useLanguage();
  const { isBusinessAuthenticated, businessProfile, loginBusiness, logoutBusiness } = useBusinessAuth();

  const [formData, setFormData] = useState({
    businessName: '',
    businessIdentification: '',
    swissBusinessNumber: '',
    country: 'Switzerland',
    email: '',
  });

  const labels = useMemo(
    () =>
      language === 'fr'
        ? {
            title: 'Portail Professionnel',
            subtitle:
              'Accès réservé aux clients professionnels basés en Suisse. Veuillez renseigner vos informations officielles.',
            businessName: "Nom de l'entreprise",
            businessIdentification: 'Identification de l’entreprise',
            swissBusinessNumber: 'Numéro entreprise suisse (CHE/CHI)',
            country: 'Pays',
            email: 'Email pro',
            login: 'Se connecter (Professionnel)',
            logout: 'Passer en client particulier',
            authAs: 'Connecté comme client professionnel',
            note: "Le numéro doit commencer par CHE ou CHI (ex: CHE-123.456.789).",
          }
        : {
            title: 'Business Portal',
            subtitle:
              'Access is restricted to Swiss business customers. Please provide your official company details.',
            businessName: 'Business name',
            businessIdentification: 'Business identification',
            swissBusinessNumber: 'Swiss business number (CHE/CHI)',
            country: 'Country',
            email: 'Business email',
            login: 'Sign in (Business)',
            logout: 'Switch to retail customer',
            authAs: 'Signed in as business customer',
            note: 'Number must start with CHE or CHI (example: CHE-123.456.789).',
          },
    [language],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.country.trim().toLowerCase() !== 'switzerland') {
      toast({
        title: language === 'fr' ? 'Pays invalide' : 'Invalid country',
        description:
          language === 'fr'
            ? 'Seules les entreprises basées en Suisse sont acceptées.'
            : 'Only businesses based in Switzerland are accepted.',
      });
      return;
    }

    if (!SWISS_UID_REGEX.test(formData.swissBusinessNumber.trim())) {
      toast({
        title: language === 'fr' ? 'Numéro entreprise invalide' : 'Invalid business number',
        description: labels.note,
      });
      return;
    }

    loginBusiness({
      businessName: formData.businessName.trim(),
      businessIdentification: formData.businessIdentification.trim(),
      swissBusinessNumber: formData.swissBusinessNumber.trim().toUpperCase(),
      country: 'Switzerland',
      email: formData.email.trim(),
    });

    toast({
      title: language === 'fr' ? 'Connexion professionnelle active' : 'Business login active',
      description:
        language === 'fr'
          ? 'Votre compte professionnel est maintenant actif.'
          : 'Your business account is now active.',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start gap-3 mb-6">
            <Building2 className="h-7 w-7 text-primary mt-1" />
            <div>
              <h1 className="font-display text-3xl font-bold">{labels.title}</h1>
              <p className="text-muted-foreground mt-2">{labels.subtitle}</p>
            </div>
          </div>

          {isBusinessAuthenticated && businessProfile ? (
            <div className="bg-card border border-border rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-2 text-primary font-medium">
                <ShieldCheck className="h-5 w-5" />
                {labels.authAs}
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>{labels.businessName}:</strong> {businessProfile.businessName}
                </p>
                <p>
                  <strong>{labels.businessIdentification}:</strong> {businessProfile.businessIdentification}
                </p>
                <p>
                  <strong>{labels.swissBusinessNumber}:</strong> {businessProfile.swissBusinessNumber}
                </p>
                <p>
                  <strong>{labels.email}:</strong> {businessProfile.email}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={logoutBusiness} variant="outline">
                  {labels.logout}
                </Button>
                <Button asChild>
                  <Link to="/shop">{language === 'fr' ? 'Aller à la boutique' : 'Go to shop'}</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <Label htmlFor="businessName">{labels.businessName} *</Label>
                <Input id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="businessIdentification">{labels.businessIdentification} *</Label>
                <Input
                  id="businessIdentification"
                  name="businessIdentification"
                  value={formData.businessIdentification}
                  onChange={handleChange}
                  placeholder={language === 'fr' ? 'Ex: TVA / registre' : 'e.g. VAT / trade register'}
                  required
                />
              </div>
              <div>
                <Label htmlFor="swissBusinessNumber">{labels.swissBusinessNumber} *</Label>
                <Input
                  id="swissBusinessNumber"
                  name="swissBusinessNumber"
                  value={formData.swissBusinessNumber}
                  onChange={handleChange}
                  placeholder="CHE-123.456.789"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">{labels.note}</p>
              </div>
              <div>
                <Label htmlFor="country">{labels.country} *</Label>
                <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="email">{labels.email} *</Label>
                <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <Button type="submit" className="w-full">
                {labels.login}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BusinessPortal;
