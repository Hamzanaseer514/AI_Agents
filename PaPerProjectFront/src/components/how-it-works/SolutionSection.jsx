import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ShieldCheck, Upload, FileSignature, PlayCircle, PackageCheck, CreditCard, TrendingUp } from 'lucide-react';
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

const SolutionSection = () => {
  const { t } = useTranslation();
  const solutionSteps = [
    { icon: Upload, title: "1. Submit Your Brief", description: "Even a rough idea is enough. Upload details or a link, and our journey begins.", color: "text-sky-500", bg: "from-sky-50/70 to-card", borderColor: "border-sky-200" },
    { icon: FileSignature, title: "2. Scope & Price in 24 Hrs", description: "Our experts analyze your brief, define the scope, and deliver a fixed-price proposal.", color: "text-indigo-500", bg: "from-indigo-50/70 to-card", borderColor: "border-indigo-200" },
    { icon: Zap, title: "3. Instant Team Assignment", description: "Our system instantly matches you with a pre-vetted, elite team. No interviews, no delays.", color: "text-primary", bg: "from-purple-50/70 to-card", borderColor: "border-purple-200" },
    { icon: PlayCircle, title: "4. Execution Begins", description: "Your dedicated Project Manager orchestrates everything, providing clear timelines and updates.", color: "text-pink-500", bg: "from-pink-50/70 to-card", borderColor: "border-pink-200" },
    { icon: PackageCheck, title: "5. Delivery, QA & Revisions", description: "We deliver on time, gather your feedback, and run rigorous internal QA for top-tier quality.", color: "text-emerald-500", bg: "from-emerald-50/70 to-card", borderColor: "border-emerald-200" },
    { icon: ShieldCheck, title: "6. Project Insurance", description: "If the result doesn't meet expectations, we fix it for free. Your success is guaranteed.", color: "text-rose-500", bg: "from-rose-50/70 to-card", borderColor: "border-rose-200" },
    { icon: CreditCard, title: "7. Flexible Payments", description: "Pay when you're ready via Klarna, Clearpay, or invoice. Start with a small 15% deposit.", color: "text-amber-500", bg: "from-amber-50/70 to-card", borderColor: "border-amber-200" },
    { icon: TrendingUp, title: "8. Stay in Growth Mode", description: "Need post-launch support or scaling? We seamlessly transition into your on-demand team.", color: "text-teal-500", bg: "from-teal-50/70 to-card", borderColor: "border-teal-200" },
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-20"
        >
         <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            {t('how_it_works_solution_title')}
        </h2>
        <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground">
          {t('how_it_works_solution_subtitle')}
        </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
        >
          {solutionSteps.map((step, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className={`relative flex flex-col items-center text-center p-8 rounded-xl h-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-b ${step.bg} border-t-4 ${step.borderColor}`}>
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-card shadow-lg ring-8 ring-card/50">
                      <step.icon className={`h-10 w-10 ${step.color}`} />
                  </div>
                  <CardHeader className="p-0 mb-3">
                      <CardTitle className="text-xl font-bold text-foreground leading-snug">{step.title}</CardTitle>
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

export default SolutionSection;