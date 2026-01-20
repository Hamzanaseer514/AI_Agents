
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Wand2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AiPredictorForm from '@/components/consultation/AiPredictorForm';

const AiPredictorPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('ai_predictor_page.title', 'AI Project Predictor')} | Pay Per Project</title>
        <meta name="description" content={t('ai_predictor_page.meta_desc', 'Get an instant AI-powered estimate for your project\'s scope, timeline, and cost. Answer a few questions and let our technology provide a detailed analysis.')} />
      </Helmet>
      <div className="bg-background text-foreground">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative isolate overflow-hidden pt-32 pb-16 md:pt-40"
        >
          <div className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-20 blur-3xl" aria-hidden="true">
            <div className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary to-purple-500" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-block rounded-full bg-primary/10 p-3 text-primary mb-4">
                <Wand2 className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-glow">
                <span className="text-gradient">{t('ai_predictor_page.hero_title', 'AI Project Predictor')}</span>
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
                {t('ai_predictor_page.hero_subtitle', 'Answer a few questions about your project, and our AI will provide an instant, data-driven estimate of its scope, timeline, and cost. Plan with confidence.')}
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Form Section */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-card p-6 sm:p-10 rounded-2xl shadow-2xl border"
            >
              <AiPredictorForm />
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-secondary/40">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t('ai_predictor_page.cta_title', 'Ready to Start Building?')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              {t('ai_predictor_page.cta_subtitle', 'Once you have your estimate, take the next step. Post your project and get matched with a world-class, vetted team in under 48 hours.')}
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="text-lg">
                <Link to="/start-project">
                  {t('ai_predictor_page.cta_button', 'Post Your Project Now')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AiPredictorPage;
