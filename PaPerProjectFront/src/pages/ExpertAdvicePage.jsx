
import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageSquare, FileCheck, Users, Zap, Lightbulb, DollarSign, ArrowRight, BrainCircuit, TrendingUp, Megaphone, Target, Scale, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

const TopicsSection = () => {
  const topics = [
    { icon: BrainCircuit, title: "Product & MVP Strategy", description: "Turn your idea into a viable product. We'll help you validate your concept, define a focused MVP scope to minimize waste, and create a strategic product roadmap that will excite early adopters and prove your value to investors." },
    { icon: TrendingUp, title: "Growth & Scaling Strategy", description: "Ready to grow but not sure how? Our experts will help you identify the most effective, scalable growth channels for your business, optimize your user acquisition funnel, and build the operational foundation needed to handle rapid expansion without breaking." },
    { icon: Megaphone, title: "Go-to-Market & Launch Plan", description: "A great product deserves a great launch. We'll work with you to develop a powerful go-to-market strategy, craft compelling messaging that resonates with your target audience, and execute a multi-channel launch plan designed for maximum impact." },
    { icon: Target, title: "Fundraising & Pitch Deck Review", description: "Pitching for capital is a science. Let our experts, who have been on both sides of the table, help you refine your narrative, structure your financials, and polish your pitch deck. Gain the confidence to walk into any investor meeting and win." },
  ];
  return (
    <div className="py-16 sm:py-20 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Consulting Topics We Cover</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            Get actionable advice from proven experts in every critical area of building a business.
          </p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {topics.map((topic, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="text-center p-6 bg-card border shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col items-center rounded-2xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                  <topic.icon className="h-8 w-8 text-primary" />
                </div>
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xl font-bold text-foreground">{topic.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground text-base leading-relaxed">{topic.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const HowItWorksExpertSection = () => {
  const steps = [
    { icon: FileCheck, title: "1. Define Your Vision", description: "Submit your project requirements, technical needs, and business goals. This initial information helps us prepare for a productive session." },
    { icon: Users, title: "2. Get Matched", description: "Our system intelligently pairs you with a world-class expert whose background and experience are perfectly aligned with your industry and specific business needs for maximum impact." },
    { icon: MessageSquare, title: "3. One-on-One Call", description: "Engage in a focused, 60-minute deep-dive session with your expert. This is your dedicated time to ask tough questions, explore solutions, and gain strategic clarity on your path forward." },
    { icon: FileCheck, title: "4. Receive Your Plan", description: "Following your call, you'll receive a concise, actionable summary of the discussion and a clear roadmap with next steps. This ensures you can immediately start implementing the valuable advice." },
  ];
  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Your Path to Clarity in 4 Steps</h2>
           <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            From booking to action plan, our process is designed for speed and impact.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants} className="flex">
              <Card className="text-center p-6 bg-card border shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center rounded-2xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xl font-bold text-foreground">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground text-base leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};


const BenefitsSection = () => {
  const benefits = [
    {
      icon: Lightbulb,
      title: "Avoid Costly Mistakes",
      description: "Tap into the hard-won wisdom of seasoned experts to sidestep common pitfalls and navigate complex challenges. Making informed decisions from the start will save you invaluable time, money, and resources down the road."
    },
    {
      icon: Zap,
      title: "Accelerate Your Growth",
      description: "Stop wasting time on guesswork and start executing with a proven strategy. Our experts provide a clear, actionable roadmap that is tailored to your business, helping you achieve your most ambitious goals significantly faster."
    },
    {
      icon: DollarSign,
      title: "Increase Investor Confidence",
      description: "Demonstrate to investors that you are de-risking your venture by seeking guidance from industry veterans. This proactive approach strengthens your business case, enhances your credibility, and makes your pitch far more compelling."
    },
  ];

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {benefits.map((benefit, index) => (
             <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
             >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                  <benefit.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">{benefit.title}</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FaqSection = () => {
  const faqs1 = [
    {
      question: "Who are the experts?",
      answer: "Our experts are seasoned industry veterans, including successful founders, C-level executives, and top-tier consultants. Each is vetted for their real-world experience and track record of success in their specific domain."
    },
    {
      question: "What do I get from a consultation?",
      answer: "You receive a 60-minute one-on-one video session with a matched expert, a recording of the call, and a follow-up document with a summary of key takeaways and an actionable roadmap to help you implement the advice."
    },
    {
      question: "How much does a consultation cost?",
      answer: "Consultations are offered at a flat rate, providing affordable access to world-class expertise. The price is displayed when you select a topic, with no hidden fees."
    },
  ];
  const faqs2 = [
    {
      question: "How does the matching process work?",
      answer: "When you book a session, you'll fill out a brief questionnaire about your business and challenges. Our system and team then match you with the expert whose skills and experience are most relevant to your needs."
    },
    {
      question: "Is this advice confidential?",
      answer: "Absolutely. All consultations are held under a strict non-disclosure agreement (NDA) to ensure your ideas and business information remain completely confidential."
    },
    {
      question: "What if I need more than one session?",
      answer: "Many clients book follow-up sessions to track progress or tackle new challenges. We also offer packages for ongoing advisory services. Contact us to learn more."
    },
  ];

  return (
    <div className="py-16 sm:py-20 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Your Questions, Answered</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <Accordion type="single" collapsible className="w-full">
              {faqs1.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold text-left py-4">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Accordion type="single" collapsible className="w-full">
              {faqs2.map((faq, index) => (
                <AccordionItem key={index + faqs1.length} value={`item-${index + faqs1.length}`}>
                  <AccordionTrigger className="text-lg font-semibold text-left py-4">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </div>
      </div>
    </div>
  );
};

const ExpertAdvicePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Get Advice from an Industry Expert | Pay Per Project</title>
        <meta name="description" content="Book a one-on-one consultation with a vetted industry expert to solve your toughest business challenges in product, growth, fundraising, and more." />
      </Helmet>
      <div className="bg-background">
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary/5 to-transparent pt-24 sm:pt-32 pb-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <MessageSquare className="mx-auto h-12 w-12 text-primary" />
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Get Advice from an Industry Expert
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                Tap into decades of experience. Book a one-on-one consultation to solve your toughest business challenges and accelerate your path to success.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" asChild>
                  <Link to="/contact">
                    Book Your Session <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
            <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>
        </div>
        <BenefitsSection />
        <TopicsSection />
        <HowItWorksExpertSection />
        <FaqSection />
      </div>
    </>
  );
};

export default ExpertAdvicePage;
