import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, x: 20 },
  visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.4 } },
};

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative pt-32 pb-24 text-left overflow-hidden bg-background"
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 h-[500px] bg-[radial-gradient(circle_400px_at_50%_200px,hsl(var(--primary)/0.15),transparent)]"></div>
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <motion.div variants={itemVariants} className="inline-block bg-primary/10 text-primary font-semibold py-2 px-4 rounded-full text-sm mb-6 shadow-sm">
              {t('how_it_works_hero_tagline', 'Your End-to-End Project Partner')}
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight font-heading">
              <Trans i18nKey="how_it_works_hero_title">
                From Idea to Invoice,<br /> <span className="text-gradient">We Handle It All.</span>
              </Trans>
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-6 text-lg md:text-xl text-muted-foreground">
              {t('how_it_works_hero_subtitle', 'Stop juggling freelancers and agencies. We provide a single, streamlined solution to take your project from a rough concept to a fully-managed, high-quality deliverable—guaranteed.')}
            </motion.p>
            <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                  <Link to="/start-project">
                      {t('how_it_works_hero_button', 'Start Your Project Now')}
                      <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
              </Button>
               <Button asChild size="lg" variant="outline">
                  <Link to="/contact">
                      {t('how_it_works_hero_button_secondary', 'Speak to an Expert')}
                  </Link>
              </Button>
            </motion.div>
            <motion.div variants={itemVariants} className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500"/>
              <span>{t('how_it_works_hero_guarantee', '24h Quote & Team Assignment')}</span>
            </motion.div>
          </div>
          <motion.div variants={imageVariants} className="relative hidden lg:block">
            <div className="p-2 bg-card rounded-2xl shadow-2xl border-2 border-primary/20">
                <img 
                    className="rounded-xl w-full h-auto object-cover aspect-video" 
                    alt="A team collaborating on a project plan on a large digital screen"
                 src="https://images.unsplash.com/photo-1576267422695-a6a97a0e4661" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;