import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FinalCTASection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-8 md:p-16 text-center overflow-hidden relative shadow-2xl shadow-primary/30"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white">{t('how_it_works_final_cta_title')}</h2>
            <p className="max-w-3xl mx-auto mt-6 text-lg text-white/90">
              {t('how_it_works_final_cta_subtitle')}
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-slate-100">
                <Link to="/contact">
                  <Zap className="mr-3 h-6 w-6" />
                  {t('how_it_works_final_cta_button')}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;