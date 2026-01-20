import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BrainCircuit, Wrench, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StartProjectPage = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } 
    },
  };

  return (
    <>
      <Helmet>
        <title>{t('title_start_project', 'Start Your Project')}</title>
        <meta name="description" content={t('meta_desc_start_project', 'Choose how to start your project. Use our AI Predictor for an instant estimate or submit your brief manually for a detailed consultation.')} />
      </Helmet>
      <div className="relative bg-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="py-24 sm:py-32 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-heading text-foreground">
                {t('start_project_title', 'Let’s Build Something Amazing')}
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                {t('start_project_subtitle', 'You have a vision. We have the expert teams to bring it to life. Choose your starting point below to get the ball rolling.')}
              </p>
            </motion.div>

            <motion.div 
              className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Card className="h-full flex flex-col justify-between text-left hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 rounded-2xl shadow-lg border">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                        <BrainCircuit className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold font-heading">{t('start_project_ai_title', 'Use AI Predictor')}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-base text-muted-foreground">
                      {t('start_project_ai_desc', 'Get an instant, data-driven estimate for your project’s scope, timeline, and cost. Perfect for quick validation and budget planning.')}
                    </CardDescription>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button asChild className="w-full">
                      <Link to="/consultation?tab=ai-predictor">
                        {t('start_project_ai_cta', 'Get Instant Estimate')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="h-full flex flex-col justify-between text-left hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 rounded-2xl shadow-lg border">
                  <CardHeader>
                     <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                        <Wrench className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold font-heading">{t('start_project_manual_title', 'Submit Manually')}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-base text-muted-foreground">
                      {t('start_project_manual_desc', 'Provide your project brief and requirements for a detailed analysis and a custom proposal from our experts. Best for complex projects.')}
                    </CardDescription>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button asChild variant="secondary" className="w-full">
                      <Link to="/consultation?tab=manual">
                        {t('start_project_manual_cta', 'Book a Consultation')}
                         <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartProjectPage;