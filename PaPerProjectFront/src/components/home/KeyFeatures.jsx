import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, ShieldCheck, Percent, UserCheck, Clock, FileLock, Briefcase, Users2, Building, Search, HeartHandshake as Handshake, Gavel, User, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/card';

const ourFeaturesKeys = [
  { icon: ShieldCheck, title: 'kf_our_managed_title', description: 'kf_our_managed_desc', color: 'text-blue-500' },
  { icon: Percent, title: 'kf_our_commission_title', description: 'kf_our_commission_desc', color: 'text-green-500' },
  { icon: UserCheck, title: 'kf_our_talent_title', description: 'kf_our_talent_desc', color: 'text-primary' },
  { icon: Clock, title: 'kf_our_assigned_title', description: 'kf_our_assigned_desc', color: 'text-orange-500' },
  { icon: FileLock, title: 'kf_our_nda_title', description: 'kf_our_nda_desc', color: 'text-red-500' },
  { icon: Briefcase, title: 'kf_our_pm_title', description: 'kf_our_pm_desc', color: 'text-cyan-500' },
  { icon: Users2, title: 'kf_our_access_title', description: 'kf_our_access_desc', color: 'text-pink-500' },
  { icon: Building, title: 'kf_our_enterprise_title', description: 'kf_our_enterprise_desc', color: 'text-indigo-500' }
];

const theirFeaturesKeys = [
  { icon: Layers, title: 'kf_their_p2p_title', description: 'kf_their_p2p_desc', color: 'text-slate-400' },
  { icon: Percent, title: 'kf_their_commission_title', description: 'kf_their_commission_desc', color: 'text-slate-400' },
  { icon: Search, title: 'kf_their_talent_title', description: 'kf_their_talent_desc', color: 'text-slate-400' },
  { icon: Clock, title: 'kf_their_bidding_title', description: 'kf_their_bidding_desc', color: 'text-slate-400' },
  { icon: Handshake, title: 'kf_their_negotiations_title', description: 'kf_their_negotiations_desc', color: 'text-slate-400' },
  { icon: Briefcase, title: 'kf_their_pm_title', description: 'kf_their_pm_desc', color: 'text-slate-400' },
  { icon: User, title: 'kf_their_accounts_title', description: 'kf_their_accounts_desc', color: 'text-slate-400' },
  { icon: Building, title: 'kf_their_teams_title', description: 'kf_their_teams_desc', color: 'text-slate-400' }
];

const FeatureCard = ({ feature, isOurs }) => {
  const { t } = useTranslation();
  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="h-full"
    >
      <Card className={cn("p-6 transition-all duration-300 h-full flex items-start gap-4", isOurs ? "bg-card shadow-lg hover:shadow-xl hover:scale-105" : "bg-secondary/50")}>
        <div className={cn("p-2 rounded-lg flex-shrink-0", isOurs ? "bg-primary/10" : "bg-slate-200 dark:bg-slate-700")}>
            <feature.icon className={cn('h-8 w-8', feature.color)} />
        </div>
        <div>
            <h3 className="text-xl font-bold text-foreground">{t(feature.title)}</h3>
            <p className="text-muted-foreground mt-1">{t(feature.description)}</p>
        </div>
      </Card>
    </motion.div>
  );
}

const KeyFeatures = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground font-heading">For Startups & Enterprises</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('key_features_subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border">
            <h3 className="text-3xl font-bold text-center text-gradient">{t('key_features_ppp')}</h3>
            <div className="space-y-6">
              {ourFeaturesKeys.map((feature, index) => (
                <FeatureCard key={index} feature={feature} isOurs={true} />
              ))}
            </div>
          </div>
          <div className="space-y-8 p-8 rounded-2xl bg-card/50">
            <h3 className="text-3xl font-bold text-center text-muted-foreground">{t('key_features_others')}</h3>
            <div className="space-y-6">
              {theirFeaturesKeys.map((feature, index) => (
                <FeatureCard key={index} feature={feature} isOurs={false} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;