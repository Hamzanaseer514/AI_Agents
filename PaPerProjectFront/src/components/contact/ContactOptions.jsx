import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactForm from '@/components/contact/ContactForm';
import AiPredictorForm from '@/components/consultation/AiPredictorForm';
import { Mail, Wand2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ContactOptions = () => {
    const { t } = useTranslation();

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative bg-background overflow-hidden"
        >
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-20 dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"></div>
            <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 font-heading">
                        {t('contact_options_title', 'Get in Touch')}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground">
                        {t('contact_options_subtitle', 'Choose the best way to connect with us. We\'re here to help.')}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <Tabs defaultValue="contact-form" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-auto p-2">
                            <TabsTrigger value="contact-form" className="py-3 text-base flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                {t('contact_options_tab_form', 'Simple Contact Form')}
                            </TabsTrigger>
                            <TabsTrigger value="ai-predictor" className="py-3 text-base flex items-center gap-2">
                                <Wand2 className="h-5 w-5" />
                                {t('contact_options_tab_ai', 'AI Project Predictor')}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="contact-form" className="mt-8">
                            <motion.div
                                key="contact-form"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ContactForm />
                            </motion.div>
                        </TabsContent>
                        <TabsContent value="ai-predictor" className="mt-8">
                             <motion.div
                                key="ai-predictor"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                             >
                                <div className="p-8 bg-card border rounded-lg shadow-sm">
                                    <h3 className="text-2xl font-bold mb-4 text-center">{t('contact_options_ai_title', 'Get an Instant AI-Powered Estimate')}</h3>
                                    <p className="text-muted-foreground mb-8 text-center">{t('contact_options_ai_desc', 'Fill out the details below, and our AI will provide a preliminary scope, timeline, and cost estimate for your project.')}</p>
                                    <AiPredictorForm />
                                </div>
                             </motion.div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </motion.section>
    );
};

export default ContactOptions;