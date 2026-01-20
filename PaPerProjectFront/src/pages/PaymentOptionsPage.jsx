
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, ShieldCheck, Banknote, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PaymentOptionsPage = () => {
  const { t } = useTranslation();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('title_payment_options')} | Pay Per Project</title>
        <meta name="description" content={t('meta_desc_payment_options')} />
      </Helmet>
      <div className="bg-background text-foreground">
        <section className="py-20 md:py-28 bg-secondary/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground"
            >
              {t('payment_title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground"
            >
              {t('payment_subtitle')}
            </motion.p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl"
          >
            <motion.div variants={itemVariants}>
              <Card className="mb-12 border shadow-lg rounded-2xl bg-card">
                <CardHeader className="p-6 bg-secondary/40">
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <span className="text-3xl mr-3">🔹</span> {t('payment_offer_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-lg text-muted-foreground space-y-2">
                  <p>{t('payment_offer_1')}</p>
                  <p>{t('payment_offer_2')}</p>
                  <p>{t('payment_offer_3')}</p>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
              <motion.div variants={itemVariants}>
                <Card className="h-full border-2 border-purple-300 shadow-lg rounded-2xl overflow-hidden bg-card flex flex-col">
                  <CardHeader className="p-6 bg-purple-50 dark:bg-purple-900/20">
                    <CardTitle className="text-2xl font-bold flex items-center text-purple-800 dark:text-purple-200">
                      <span className="text-3xl mr-3">🟣</span> {t('payment_klarna_title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-purple-500 mt-1 shrink-0" /><span>{t('payment_klarna_1')}</span></li>
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-purple-500 mt-1 shrink-0" /><span>{t('payment_klarna_2')}</span></li>
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-purple-500 mt-1 shrink-0" /><span>{t('payment_klarna_3')}</span></li>
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-purple-500 mt-1 shrink-0" /><span>{t('payment_klarna_4')}</span></li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card className="h-full border-2 border-teal-300 shadow-lg rounded-2xl overflow-hidden bg-card flex flex-col">
                  <CardHeader className="p-6 bg-teal-50 dark:bg-teal-900/20">
                    <CardTitle className="text-2xl font-bold flex items-center text-teal-800 dark:text-teal-200">
                      <span className="text-3xl mr-3">🟡</span> {t('payment_clearpay_title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-teal-500 mt-1 shrink-0" /><span>{t('payment_clearpay_1')}</span></li>
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-teal-500 mt-1 shrink-0" /><span>{t('payment_clearpay_2')}</span></li>
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-teal-500 mt-1 shrink-0" /><span>{t('payment_clearpay_3')}</span></li>
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-teal-500 mt-1 shrink-0" /><span>{t('payment_clearpay_4')}</span></li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="mt-16 md:mt-24">
              <h2 className="text-3xl font-bold text-center mb-10 flex items-center justify-center gap-3">
                <span className="text-3xl">✅</span> {t('payment_benefits_title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-secondary/40 p-6 rounded-xl flex items-center gap-4"><Banknote className="h-8 w-8 text-primary shrink-0" /><p className="font-medium text-foreground">{t('payment_benefit_1')}</p></div>
                <div className="bg-secondary/40 p-6 rounded-xl flex items-center gap-4"><HelpCircle className="h-8 w-8 text-primary shrink-0" /><p className="font-medium text-foreground">{t('payment_benefit_2')}</p></div>
                <div className="bg-secondary/40 p-6 rounded-xl flex items-center gap-4"><Zap className="h-8 w-8 text-primary shrink/0" /><p className="font-medium text-foreground">{t('payment_benefit_3')}</p></div>
                <div className="bg-secondary/40 p-6 rounded-xl flex items-center gap-4"><ShieldCheck className="h-8 w-8 text-primary shrink-0" /><p className="font-medium text-foreground">{t('payment_benefit_4')}</p></div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-16 text-center">
              <p className="text-muted-foreground mb-4">{t('payment_cta_text')}</p>
              <Button asChild size="lg" className="font-bold text-lg px-8 py-6 rounded-full shadow-lg transition-transform duration-300 hover:scale-105">
                <Link to="/contact">
                  <Zap className="mr-2 h-5 w-5" />
                  {t('payment_cta_button')}
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default PaymentOptionsPage;
