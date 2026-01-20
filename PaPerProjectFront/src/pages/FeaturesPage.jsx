import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  TrendingUp, 
  BarChart3, 
  ShieldCheck, 
  Users, 
  PieChart, 
  Server, 
  Copy, 
  Lightbulb,
  CheckCircle2,
  CreditCard,
  DollarSign,
  UploadCloud,
  Building,
  PiggyBank,
  Rocket,
  RefreshCcw,
  Sparkles,
  Share2,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FeatureComparisonTable from '@/components/features/FeatureComparisonTable';
import { useTranslation, Trans } from 'react-i18next';

const featureKeys = [
  {
    icon: BrainCircuit,
    title: 'feature_outcome_title',
    description: 'feature_outcome_desc',
    whyUnique: 'feature_outcome_unique'
  },
  {
    icon: TrendingUp,
    title: 'feature_growth_title',
    description: 'feature_growth_desc',
    whyUnique: 'feature_growth_unique'
  },
  {
    icon: BarChart3,
    title: 'feature_health_title',
    description: 'feature_health_desc',
    whyUnique: 'feature_health_unique'
  },
  {
    icon: ShieldCheck,
    title: 'feature_ip_title',
    description: 'feature_ip_desc',
    whyUnique: 'feature_ip_unique'
  },
  {
    icon: DollarSign,
    title: 'feature_b2b_title',
    description: 'feature_b2b_desc',
    whyUnique: 'feature_b2b_unique'
  },
  {
    icon: Users,
    title: 'feature_whitelabel_title',
    description: 'feature_whitelabel_desc',
    whyUnique: 'feature_whitelabel_unique'
  },
  {
    icon: Building,
    title: 'feature_startup_enterprise_title',
    description: 'feature_startup_enterprise_desc',
    whyUnique: 'feature_startup_enterprise_unique'
  },
  {
    icon: PieChart,
    title: 'feature_reporting_title',
    description: 'feature_reporting_desc',
    whyUnique: 'feature_reporting_unique'
  },
  {
    icon: Rocket,
    title: 'feature_lpnpl_title',
    description: 'feature_lpnpl_desc',
    whyUnique: 'feature_lpnpl_unique'
  },
  {
    icon: Server,
    title: 'feature_vault_title',
    description: 'feature_vault_desc',
    whyUnique: 'feature_vault_unique'
  },
  {
    icon: PiggyBank,
    title: 'feature_credits_title',
    description: 'feature_credits_desc',
    whyUnique: 'feature_credits_unique'
  },
  {
    icon: Copy,
    title: 'feature_clone_title',
    description: 'feature_clone_desc',
    whyUnique: 'feature_clone_unique'
  },
  {
    icon: RefreshCcw,
    title: 'feature_upgrade_title',
    description: 'feature_upgrade_desc',
    whyUnique: 'feature_upgrade_unique'
  },
  {
    icon: Sparkles,
    title: 'feature_miles_title',
    description: 'feature_miles_desc',
    whyUnique: 'feature_miles_unique'
  },
  {
    icon: Share2,
    title: 'feature_bip_title',
    description: 'feature_bip_desc',
    whyUnique: 'feature_bip_unique'
  },
  {
    icon: Gift,
    title: 'feature_referral_title',
    description: 'feature_referral_desc',
    whyUnique: 'feature_referral_unique'
  },
  {
    icon: ShieldCheck,
    title: 'feature_insurance_title',
    description: 'feature_insurance_desc',
    whyUnique: 'feature_insurance_unique'
  },
  {
    icon: UploadCloud,
    title: 'feature_eaas_title',
    description: 'feature_eaas_desc',
    whyUnique: 'feature_eaas_unique'
  }
];

const FeatureCard = ({ icon: Icon, titleKey, descriptionKey, whyUniqueKey, index }) => {
  const { t } = useTranslation();
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.05
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="h-full"
    >
      <Card className="h-full bg-card border shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 flex flex-col rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-start gap-4 p-5 bg-secondary/40 border-b">
          <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-base font-bold leading-tight mt-1">{t(titleKey)}</CardTitle>
        </CardHeader>
        <CardContent className="p-5 flex-grow flex flex-col">
          <p className="text-muted-foreground mb-4 flex-grow text-sm">{t(descriptionKey)}</p>
          <div className="mt-auto pt-4 border-t">
            <p className="text-xs font-semibold text-primary"><span className="font-bold">{t('feature_why_unique')}:</span> {t(whyUniqueKey)}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CombinedCtaSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-24 bg-secondary/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="relative bg-card rounded-3xl p-8 md:p-12 shadow-2xl border overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-center">
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <Lightbulb className="h-10 w-10 text-primary mx-auto md:mx-0 mb-3" />
                <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">{t('features_cta_quiz_title')}</h3>
                <p className="mt-3 text-lg text-muted-foreground">
                  {t('features_cta_quiz_desc')}
                </p>
                <Button asChild size="lg" className="mt-6 font-bold text-base px-8 py-6 rounded-full shadow-lg transition-transform duration-300 hover:scale-105">
                  <Link to="/quiz">{t('features_cta_quiz_button')}</Link>
                </Button>
              </div>

              <div className="text-center md:text-left">
                <CreditCard className="h-10 w-10 text-primary mx-auto md:mx-0 mb-3" />
                <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">{t('features_cta_payment_title')}</h3>
                <p className="mt-3 text-lg text-muted-foreground">
                  {t('features_cta_payment_desc')}
                </p>
                <Button asChild size="lg" variant="outline" className="mt-6 font-bold text-base px-8 py-6 rounded-full shadow-lg transition-transform duration-300 hover:scale-105">
                  <Link to="/payment-options">{t('features_cta_payment_button')}</Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <img  alt="Abstract design representing ideas and payments" className="rounded-2xl object-cover w-full h-full max-h-64" src="https://images.unsplash.com/photo-1677442135131-4d7c123aef1c" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


const FeaturesPage = () => {
  const { t } = useTranslation();
  const sortedFeatures = [...featureKeys].sort((a, b) => t(a.title).localeCompare(t(b.title)));
  
  const taglines = [
    t('features_tagline1'),
    t('features_tagline2'),
    t('features_tagline3'),
    t('features_tagline4'),
    t('features_tagline5')
  ];

  return (
    <>
      <Helmet>
        <title>{t('title_features')}</title>
        <meta name="description" content={t('meta_desc_features')} />
      </Helmet>
      <div className="bg-background text-foreground">
        <section className="py-20 md:py-28 relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-grid-slate-100/60 [mask-image:linear-gradient(to_bottom,white_10%,transparent_100%)]"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-indigo-600"
            >
              {t('features_title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-5 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground"
            >
              {t('features_subtitle')}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto"
            >
              {taglines.map((tagline, index) => (
                <div key={index} className="flex items-center justify-center sm:justify-start gap-2 text-sm font-medium text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{tagline}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <FeatureComparisonTable />

        <section className="py-16 md:py-24 bg-secondary/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t('features_section_title')}</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    {t('features_section_subtitle')}
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sortedFeatures.map((feature, index) => (
                <FeatureCard 
                  key={index} 
                  icon={feature.icon}
                  titleKey={feature.title}
                  descriptionKey={feature.description}
                  whyUniqueKey={feature.whyUnique}
                  index={index} 
                />
              ))}
            </div>
          </div>
        </section>
        
        <CombinedCtaSection />

        <section className="py-12 text-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  <Trans i18nKey="features_final_cta">
                    Done-for-you execution, with <span className="text-primary">zero commissions</span> and <span className="text-primary">100% trust.</span>
                  </Trans>
                </h3>
            </div>
        </section>
      </div>
    </>
  );
};

export default FeaturesPage;