import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileSignature, Zap, PlayCircle, PackageCheck, ShieldCheck, CreditCard, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const HowItWorksProcess = () => {
  const { t } = useTranslation();
  const solutionSteps = [
    { icon: Upload, title: "1. Submit Your Brief", description: "Even a rough idea is enough. Upload details or a link, and our journey begins." },
    { icon: FileSignature, title: "2. Scope & Price in 24 Hrs", description: "Our experts analyze your brief, define the scope, and deliver a fixed-price proposal." },
    { icon: Zap, title: "3. Instant Team Assignment", description: "Our system instantly matches you with a pre-vetted, elite team. No interviews, no delays." },
    { icon: PlayCircle, title: "4. Execution Begins", description: "Your dedicated Project Manager orchestrates everything, providing clear timelines and updates." },
    { icon: PackageCheck, title: "5. Delivery, QA & Revisions", description: "We deliver on time, gather your feedback, and run rigorous internal QA for top-tier quality." },
    { icon: ShieldCheck, title: "6. Project Insurance", description: "If the result doesn't meet expectations, we fix it for free. Your success is guaranteed." },
    { icon: CreditCard, title: "7. Flexible Payments", description: "Pay when you're ready via Klarna, Clearpay, or invoice. Start with a small 15% deposit." },
    { icon: TrendingUp, title: "8. Stay in Growth Mode", description: "Need post-launch support or scaling? We seamlessly transition into your on-demand team." },
  ];

  const SpotlightCard = ({ step, index }) => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
      <motion.div
        key={index}
        variants={itemVariants}
        className="h-full"
        onMouseMove={handleMouseMove}
        style={{ '--x': `${mousePosition.x}px`, '--y': `${mousePosition.y}px` }}
      >
        <Card className="spotlight-effect relative flex flex-col items-center text-center p-8 rounded-2xl h-full shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 bg-card border">
          <div className="absolute top-4 right-4">
             <Badge variant="secondary">Step {index + 1}</Badge>
          </div>
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner">
            <step.icon className="h-10 w-10" />
          </div>
          <CardHeader className="p-0 mb-3">
            <CardTitle className="text-xl font-bold text-foreground leading-snug">{step.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-grow">
            <p className="text-muted-foreground text-base">{step.description}</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <section className="py-20 md:py-28 bg-secondary/40">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground font-heading">
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
            <SpotlightCard step={step} index={index} key={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksProcess;