import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Bot, UserCheck, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

const HowItWorksSection = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: UploadCloud,
      title: "Upload Your Idea",
      description: "Submit your project brief, wireframes, or just a simple idea. Our system ingests and analyzes it."
    },
    {
      icon: Bot,
      title: "Agentic AI Scopes & Builds",
      description: "Our AI agents create a full project plan, write code, and begin building the initial version 24/7."
    },
    {
      icon: UserCheck,
      title: "Human Experts Validate",
      description: "Our senior developers review, refine, and validate the AI's work, ensuring enterprise-grade quality."
    },
    {
      icon: CheckCircle,
      title: "Receive Your Project",
      description: "Get a fully-vetted, high-quality project delivered on time and on budget. Guaranteed."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground font-heading">How Our Agentic Platform Works</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            We combine the relentless speed of AI with the irreplaceable wisdom of human experts.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-12 bottom-12 w-0.5 bg-border -translate-x-1/2 hidden md:block" aria-hidden="true"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex items-start gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`relative flex-shrink-0 w-24 h-24 flex items-center justify-center rounded-full bg-primary/10 text-primary shadow-lg ${index % 2 === 0 ? 'md:ml-auto md:-mr-12' : 'md:mr-auto md:-ml-12'} z-10`}>
                   <step.icon className="w-10 h-10" />
                </div>
                <Card className={`w-full bg-card ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;