import React from 'react';
import { motion } from 'framer-motion';
import AiPredictorForm from '@/components/consultation/AiPredictorForm';
import { Wand2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AiPredictorSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-4">
             <Wand2 className="h-8 w-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground font-heading">
            Try Our AI Project Predictor
          </h2>
          <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground">
            Not sure about your scope, timeline, or budget? Answer a few questions, and our AI will instantly generate a detailed project projection for you.
          </p>
        </motion.div>
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-4xl mx-auto bg-card p-4 sm:p-8 rounded-2xl shadow-2xl border"
        >
            <AiPredictorForm />
        </motion.div>
      </div>
    </section>
  );
};

export default AiPredictorSection;