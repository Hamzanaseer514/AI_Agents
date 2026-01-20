import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, ShieldCheck, TrendingUp, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const BadgeCard = ({ icon: Icon, titleKey, descriptionKey, color, bg, index }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full text-center p-6 bg-card shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 rounded-xl card-border-glow">
        <div className={cn('mx-auto flex h-16 w-16 items-center justify-center rounded-full', bg)}>
          <Icon className={cn('h-8 w-8', color)} />
        </div>
        <CardHeader className="p-0 pt-5">
          <CardTitle className="text-xl font-bold text-foreground">{t(titleKey)}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <p className="text-md text-muted-foreground">{t(descriptionKey)}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TrustBadges = () => {
  const { t } = useTranslation();
  const badges = [
    {
      groupKey: 'trust_badges_group1_title',
      items: [
        {
          icon: CalendarCheck,
          titleKey: 'trust_badge_1_title',
          descriptionKey: 'trust_badge_1_desc',
          color: 'text-green-500',
          bg: 'bg-green-500/10',
        },
        {
          icon: ShieldCheck,
          titleKey: 'trust_badge_2_title',
          descriptionKey: 'trust_badge_2_desc',
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
        },
      ],
    },
    {
      groupKey: 'trust_badges_group2_title',
      items: [
        {
          icon: TrendingUp,
          titleKey: 'trust_badge_3_title',
          descriptionKey: 'trust_badge_3_desc',
          color: 'text-primary',
          bg: 'bg-primary/10',
        },
        {
          icon: Target,
          titleKey: 'trust_badge_4_title',
          descriptionKey: 'trust_badge_4_desc',
          color: 'text-orange-500',
          bg: 'bg-orange-500/10',
        },
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {badges.map((badgeGroup, groupIndex) => (
            <div key={groupIndex} className="space-y-8">
              <h2 className="text-3xl font-bold text-center text-foreground font-heading">{t(badgeGroup.groupKey)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {badgeGroup.items.map((item, itemIndex) => (
                  <BadgeCard key={itemIndex} {...item} index={itemIndex} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;