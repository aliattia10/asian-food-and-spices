import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBusinessAuth } from '@/contexts/BusinessAuthContext';
import { toast } from '@/hooks/use-toast';
import { Building2, ShieldCheck, UserPlus, LogIn, Clock, XCircle } from 'lucide-react';

const SWISS_UID_REGEX = /^CH[EI][\s.-]?\d{3}[\s.-]?\d{3}[\s.-]?\d{3}$/i;

type View = 'choose' | 'register' | 'login';

const BusinessPortal = () => {
  const { language } = useLanguage();
  const {
    isBusinessAuthenticated,
    businessProfile,
    loginBusiness,
    registerBusiness,
    logoutBusiness,
  } = useBusinessAuth();

  const [view, setView] = useState<View>('choose');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [rejectedMessage, setRejectedMessage] = useState<string | null>(null);

  const [regForm, setRegForm] = useState({
    businessName: '',
    businessIdentification: '',
    swissBusinessNumber: '',
    country: 'Switzerland',
    email: '',
    password: '',
  });

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const labels = useMemo(
    () =>
      language === 'fr'
        ? {
            title: 'Portail Professionnel',
            subtitle:
              'Accès réservé aux clients professionnels suisses vérifiés. Créez un compte — nous vérifierons votre entreprise avant de vous accorder l\'accès.',
            businessName: "Nom de l'entreprise",
            businessIdentification: "Identification de l'entreprise",
            swissBusinessNumber: 'Numéro entreprise suisse (CHE/CHI)',
            country: 'Pays',
            email: 'Email pro',
            password: 'Mot de passe',
            register: 'Créer un compte professionnel',
            login: 'Se connecter',
            logout: 'Passer en client particulier',
            authAs: 'Connecté comme client professionnel',
            note: 'Le numéro doit commencer par CHE ou CHI (ex: CHE-123.456.789).',
            chooseTitle: 'Comment souhaitez-vous continuer ?',
            newAccount: 'Créer un compte',
            newAccountDesc: 'Première visite ? Inscrivez votre entreprise.',
            existingAccount: 'Se connecter',
            existingAccountDesc: 'Vous avez déjà un compte vérifié.',
            pendingTitle: 'Vérification en cours',
            pendingDesc: 'Votre compte est en cours de vérification. Nous reviendrons vers vous sous peu.',
            rejectedTitle: 'Compte refusé',
            rejectedDesc: 'Votre demande a été refusée. Contactez-nous pour plus d\'informations.',
            registerSuccess: 'Compte créé !',
            registerSuccessDesc: 'Votre demande est en cours de vérification. Vous recevrez un email une fois approuvé.',
            loginError: 'Identifiants invalides',
            alreadyExists: 'Un compte avec cet email existe déjà. Essayez de vous connecter.',
          }
        : {
            title: 'Business Portal',
            subtitle:
              'Access restricted to verified Swiss business customers. Create an account — we\'ll verify your business before granting access.',
            businessName: 'Business name',
            businessIdentification: 'Business identification',
            swissBusinessNumber: 'Swiss business number (CHE/CHI)',
            country: 'Country',
            email: 'Business email',
            password: 'Password',
            register: 'Create business account',
            login: 'Sign in',
            logout: 'Switch to retail customer',
            authAs: 'Signed in as business customer',
            note: 'Number must start with CHE or CHI (example: CHE-123.456.789).',
            chooseTitle: 'How would you like to continue?',
            newAccount: 'Create an account',
            newAccountDesc: 'First time? Register your business.',
            existingAccount: 'Sign in',
            existingAccountDesc: 'Already have a verified account.',
            pendingTitle: 'Verification in progress',
            pendingDesc: 'Your account is being reviewed. We\'ll get back to you shortly.',
            rejectedTitle: 'Account rejected',
            rejectedDesc: 'Your application was rejected. Please contact us for more information.',
            registerSuccess: 'Account created!',
            registerSuccessDesc: 'Your application is under review. You\'ll receive an email once approved.',
            loginError: 'Invalid credentials',
            alreadyExists: 'An account with this email already exists. Try signing in.',
          },
    [language],
  );

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRegForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLoginForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setPendingMessage(null);
    setRejectedMessage(null);

    if (regForm.country.trim().toLowerCase() !== 'switzerland') {
      toast({
        title: language === 'fr' ? 'Pays invalide' : 'Invalid country',
        description:
          language === 'fr'
            ? 'Seules les entreprises basées en Suisse sont acceptées.'
            : 'Only businesses based in Switzerland are accepted.',
      });
      return;
    }

    if (!SWISS_UID_REGEX.test(regForm.swissBusinessNumber.trim())) {
      toast({
        title: language === 'fr' ? 'Numéro entreprise invalide' : 'Invalid business number',
        description: labels.note,
      });
      return;
    }

    if (regForm.password.length < 4) {
      toast({
        title: language === 'fr' ? 'Mot de passe trop court' : 'Password too short',
        description: language === 'fr' ? 'Minimum 4 caractères.' : 'Minimum 4 characters.',
      });
      return;
    }

    setIsSubmitting(true);
    const result = await registerBusiness({
      ...regForm,
      swissBusinessNumber: regForm.swissBusinessNumber.trim().toUpperCase(),
      country: 'Switzerland',
    });
    setIsSubmitting(false);

    if (result.error === 'already_exists') {
      toast({ title: labels.alreadyExists });
      setView('login');
      return;
    }
    if (result.error) {
      toast({ title: language === 'fr' ? 'Erreur' : 'Error', description: result.error });
      return;
    }

    setPendingMessage(labels.registerSuccessDesc);
    toast({ title: labels.registerSuccess, description: labels.registerSuccessDesc });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPendingMessage(null);
    setRejectedMessage(null);
    setIsSubmitting(true);
    const result = await loginBusiness(loginForm.email, loginForm.password);
    setIsSubmitting(false);

    if (result.error === 'pending_verification') {
      setPendingMessage(labels.pendingDesc);
      return;
    }
    if (result.error === 'rejected') {
      setRejectedMessage(labels.rejectedDesc);
      return;
    }
    if (result.error) {
      toast({
        title: labels.loginError,
        description: result.error === 'not_found'
          ? (language === 'fr' ? 'Aucun compte trouvé.' : 'No account found.')
          : (language === 'fr' ? 'Email ou mot de passe incorrect.' : 'Wrong email or password.'),
      });
      return;
    }

    toast({
      title: language === 'fr' ? 'Connexion professionnelle active' : 'Business login active',
      description: language === 'fr'
        ? 'Votre compte professionnel est maintenant actif.'
        : 'Your business account is now active.',
    });
  };

  if (isBusinessAuthenticated && businessProfile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-start gap-3 mb-6">
              <Building2 className="h-7 w-7 text-primary mt-1" />
              <div>
                <h1 className="font-display text-3xl font-bold">{labels.title}</h1>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-2 text-primary font-medium">
                <ShieldCheck className="h-5 w-5" />
                {labels.authAs}
              </div>
              <div className="space-y-1 text-sm">
                <p><strong>{labels.businessName}:</strong> {businessProfile.businessName}</p>
                <p><strong>{labels.businessIdentification}:</strong> {businessProfile.businessIdentification}</p>
                <p><strong>{labels.swissBusinessNumber}:</strong> {businessProfile.swissBusinessNumber}</p>
                <p><strong>{labels.email}:</strong> {businessProfile.email}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={logoutBusiness} variant="outline">{labels.logout}</Button>
                <Button asChild>
                  <Link to="/shop">{language === 'fr' ? 'Aller à la boutique' : 'Go to shop'}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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

          {pendingMessage && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium mb-2">
                <Clock className="h-5 w-5" />
                {labels.pendingTitle}
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-300">{pendingMessage}</p>
            </div>
          )}

          {rejectedMessage && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-medium mb-2">
                <XCircle className="h-5 w-5" />
                {labels.rejectedTitle}
              </div>
              <p className="text-sm text-red-600 dark:text-red-300">{rejectedMessage}</p>
            </div>
          )}

          {view === 'choose' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setView('register')}
                className="bg-card border border-border rounded-xl p-6 text-left hover:border-primary/50 transition-colors"
              >
                <UserPlus className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold text-lg mb-1">{labels.newAccount}</h3>
                <p className="text-sm text-muted-foreground">{labels.newAccountDesc}</p>
              </button>
              <button
                onClick={() => setView('login')}
                className="bg-card border border-border rounded-xl p-6 text-left hover:border-primary/50 transition-colors"
              >
                <LogIn className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold text-lg mb-1">{labels.existingAccount}</h3>
                <p className="text-sm text-muted-foreground">{labels.existingAccountDesc}</p>
              </button>
            </div>
          )}

          {view === 'register' && (
            <form onSubmit={handleRegister} className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-lg">{labels.newAccount}</h2>
                <Button variant="ghost" size="sm" onClick={() => setView('choose')}>
                  {language === 'fr' ? '← Retour' : '← Back'}
                </Button>
              </div>
              <div>
                <Label htmlFor="businessName">{labels.businessName} *</Label>
                <Input id="businessName" name="businessName" value={regForm.businessName} onChange={handleRegChange} required />
              </div>
              <div>
                <Label htmlFor="businessIdentification">{labels.businessIdentification} *</Label>
                <Input
                  id="businessIdentification"
                  name="businessIdentification"
                  value={regForm.businessIdentification}
                  onChange={handleRegChange}
                  placeholder={language === 'fr' ? 'Ex: TVA / registre' : 'e.g. VAT / trade register'}
                  required
                />
              </div>
              <div>
                <Label htmlFor="swissBusinessNumber">{labels.swissBusinessNumber} *</Label>
                <Input
                  id="swissBusinessNumber"
                  name="swissBusinessNumber"
                  value={regForm.swissBusinessNumber}
                  onChange={handleRegChange}
                  placeholder="CHE-123.456.789"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">{labels.note}</p>
              </div>
              <div>
                <Label htmlFor="country">{labels.country} *</Label>
                <Input id="country" name="country" value={regForm.country} onChange={handleRegChange} required />
              </div>
              <div>
                <Label htmlFor="email">{labels.email} *</Label>
                <Input id="email" type="email" name="email" value={regForm.email} onChange={handleRegChange} required />
              </div>
              <div>
                <Label htmlFor="password">{labels.password} *</Label>
                <Input id="password" type="password" name="password" value={regForm.password} onChange={handleRegChange} required minLength={4} />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (language === 'fr' ? 'Envoi...' : 'Submitting...') : labels.register}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {language === 'fr' ? 'Déjà un compte ?' : 'Already have an account?'}{' '}
                <button type="button" onClick={() => setView('login')} className="text-primary hover:underline">
                  {labels.login}
                </button>
              </p>
            </form>
          )}

          {view === 'login' && (
            <form onSubmit={handleLogin} className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-lg">{labels.existingAccount}</h2>
                <Button variant="ghost" size="sm" onClick={() => setView('choose')}>
                  {language === 'fr' ? '← Retour' : '← Back'}
                </Button>
              </div>
              <div>
                <Label htmlFor="loginEmail">{labels.email} *</Label>
                <Input id="loginEmail" type="email" name="email" value={loginForm.email} onChange={handleLoginChange} required />
              </div>
              <div>
                <Label htmlFor="loginPassword">{labels.password} *</Label>
                <Input id="loginPassword" type="password" name="password" value={loginForm.password} onChange={handleLoginChange} required />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (language === 'fr' ? 'Connexion...' : 'Signing in...') : labels.login}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {language === 'fr' ? 'Pas encore de compte ?' : 'No account yet?'}{' '}
                <button type="button" onClick={() => setView('register')} className="text-primary hover:underline">
                  {labels.newAccount}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BusinessPortal;
