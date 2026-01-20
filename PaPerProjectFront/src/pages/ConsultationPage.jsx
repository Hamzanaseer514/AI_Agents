
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BrainCircuit, Edit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactForm from '@/components/contact/ContactForm';
import AiPredictorForm from '@/components/consultation/AiPredictorForm';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const ConsultationPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState('ai-predictor');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'manual' || tab === 'ai-predictor') {
      setActiveTab(tab);
    }
  }, [location.search]);

  return (
    <>
      <Helmet>
        <title>{t('title_consultation')} | Pay Per Project</title>
        <meta name="description" content={t('meta_desc_consultation')} />
      </Helmet>
      <div className="relative bg-secondary/40 overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-20"></div>
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              {t('consultation_title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t('consultation_subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai-predictor">
                <BrainCircuit className="mr-2 h-4 w-4" />
                {t('consultation_tab_ai')}
              </TabsTrigger>
              <TabsTrigger value="manual">
                <Edit className="mr-2 h-4 w-4" />
                {t('consultation_tab_manual')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ai-predictor">
              <AiPredictorForm />
            </TabsContent>
            <TabsContent value="manual">
              <ContactForm />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default ConsultationPage;
