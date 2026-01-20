import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Hand, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const ProblemSection = () => {
  const { t } = useTranslation();
  const problemSteps = [
      { icon: Search, title: "Endless Searching", description: "Wasting weeks sifting through countless profiles, bids, and portfolios." },
      { icon: Hand, title: "Hiring Gamble", description: "Risking your budget on unvetted talent with no guarantee of quality." },
      { icon: Clock, title: "Management Maze", description: "Juggling communication, deadlines, and scope creep across different time zones." },
  ];
  return (
    <section className="py-20 md:py-28 bg-secondary/40">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">{t('how_it_works_problem_title')}</h2>
          <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground">
            {t('how_it_works_problem_subtitle')}
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {problemSteps.map((step, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <Card className="text-center p-8 bg-card border shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col items-center rounded-xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary shadow-inner">
                  <step.icon className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardHeader className="p-0 pt-6 pb-2">
                  <CardTitle className="text-xl font-bold text-foreground">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground text-base">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;