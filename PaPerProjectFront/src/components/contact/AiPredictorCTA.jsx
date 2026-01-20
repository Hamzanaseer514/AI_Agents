import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wand2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AiPredictorCTA = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative p-8 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/90 to-primary shadow-2xl shadow-primary/20 border border-primary"
    >
      <div className="absolute -right-10 -bottom-10">
        <Wand2 className="w-32 h-32 text-white/10 rotate-12" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Wand2 className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white font-heading">
            {t('contact_cta_ai_title', 'Try Our AI Project Predictor')}
          </h3>
        </div>
        <p className="text-white/90 mb-6">
          {t('contact_cta_ai_desc', 'For a more detailed analysis, use our AI-powered tool to get an instant estimate on your project\'s scope, timeline, and cost.')}
        </p>
        <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto group">
          <Link to="/consultation?tab=ai-predictor">
            {t('contact_cta_ai_button', 'Get AI Estimate')}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default AiPredictorCTA;