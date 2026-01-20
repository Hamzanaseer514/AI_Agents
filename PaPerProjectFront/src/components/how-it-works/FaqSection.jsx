import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FaqSection = () => {
  const { t } = useTranslation();

  const faqs = [
    { question: t('faq_how_it_works_q1', "What kind of projects can I submit?"), answer: t('faq_how_it_works_a1', "You can submit any digital project, from website development and mobile apps to complex SaaS platforms, AI/ML models, and marketing campaigns. If it's digital, we can build it.") },
    { question: t('faq_how_it_works_q2', "How do you determine the fixed price?"), answer: t('faq_how_it_works_a2', "Our experts analyze your brief to determine the scope, complexity, and required resources. We use historical data from thousands of projects to provide an accurate, transparent, fixed-price quote. No surprises.") },
    { question: t('faq_how_it_works_q3', "Who will be working on my project?"), answer: t('faq_how_it_works_a3', "Your project is assigned to a pre-vetted, elite team from our global talent network. This includes a dedicated project manager, developers, designers, and QA specialists perfectly matched to your project's needs.") },
    { question: t('faq_how_it_works_q4', "What is the 'Project Insurance' guarantee?"), answer: t('faq_how_it_works_a4', "Our Project Insurance means your success is guaranteed. If the final deliverable doesn't meet the agreed-upon scope and quality standards, we will continue working on it for free until it does.") },
    { question: t('faq_how_it_works_q5', "How do I communicate with the team?"), answer: t('faq_how_it_works_a5', "You'll have a single point of contact: your dedicated Project Manager. They handle all communication, provide regular updates via your preferred channel (Slack, email, etc.), and ensure the project stays on track.") },
    { question: t('faq_how_it_works_q6', "What if I need changes or revisions?"), answer: t('faq_how_it_works_a6', "Revisions are a natural part of the process. We have dedicated phases for feedback and revisions. Any changes outside the original scope can be handled through a simple change-order process.") },
    { question: t('faq_how_it_works_q7', "What payment options do you offer?"), answer: t('faq_how_it_works_a7', "We offer flexible payment options to suit your needs, including financing through Klarna and Clearpay, standard credit card payments via Stripe, and traditional invoicing. You can start most projects with a small deposit.") },
    { question: t('faq_how_it_works_q8', "How long does it take to start a project?"), answer: t('faq_how_it_works_a8', "Extremely fast. Once you approve the quote and make the initial deposit, our system instantly assembles your team, and work can begin in as little as 24-48 hours.") },
    { question: t('faq_how_it_works_q9', "Do I own the intellectual property?"), answer: t('faq_how_it_works_a9', "Yes, absolutely. Upon final payment, 100% of the intellectual property, including all code, designs, and assets created for your project, is transferred to you.") },
    { question: t('faq_how_it_works_q10', "What happens after the project is completed?"), answer: t('faq_how_it_works_a10', "We offer ongoing support and maintenance packages. Whether you need bug fixes, new features, or want to scale your project, we can seamlessly transition into your long-term on-demand tech partner.") },
    { question: t('faq_how_it_works_q11', "How is this different from a freelancer marketplace?"), answer: t('faq_how_it_works_a11', "We are a fully managed service, not a marketplace. We eliminate the risk and overhead of hiring, vetting, and managing individuals. We provide a complete, accountable team and guarantee the outcome.") },
    { question: t('faq_how_it_works_q12', "Can you work with my existing team?"), answer: t('faq_how_it_works_a12', "Yes. Our teams can integrate with your in-house staff to augment your capacity, provide specialized skills, or take on entire project components, all managed by our project manager for smooth collaboration.") },
    { question: t('faq_how_it_works_q13', "What if my project idea is just a rough concept?"), answer: t('faq_how_it_works_a13', "That's the perfect starting point! Our experts specialize in product discovery and strategy. We can help you refine your idea, define an MVP, and create a clear roadmap for development.") },
    { question: t('faq_how_it_works_q14', "What technologies do you work with?"), answer: t('faq_how_it_works_a14', "Our global talent network covers virtually every modern technology stack, from popular web frameworks (React, Vue, Node.js) and mobile platforms (iOS, Android, Flutter) to cloud services (AWS, Google Cloud) and AI/ML libraries.") },
    { question: t('faq_how_it_works_q15', "How do you ensure quality?"), answer: t('faq_how_it_works_a15', "Quality assurance is built into every step. We have dedicated QA engineers who perform rigorous testing, including manual and automated tests, to ensure your project is bug-free, performant, and secure.") },
    { question: t('faq_how_it_works_q16', "Can I get a discount for multiple projects?"), answer: t('faq_how_it_works_a16', "We offer retainer agreements and custom pricing for clients with ongoing or multiple project needs. Speak with one of our experts to discuss a long-term partnership.") },
    { question: t('faq_how_it_works_q17', "What is the typical project size you handle?"), answer: t('faq_how_it_works_a17', "We handle projects of all sizes, from small website enhancements costing a few thousand dollars to large-scale enterprise systems with budgets exceeding $100,000. No project is too big or too small.") },
    { question: t('faq_how_it_works_q18', "Are your teams located in a specific time zone?"), answer: t('faq_how_it_works_a18', "Our talent is distributed globally, allowing us to offer round-the-clock development cycles if needed. Your project manager will coordinate everything to align with your business hours for communication and updates.") },
    { question: t('faq_how_it_works_q19', "How do you handle project confidentiality?"), answer: t('faq_how_it_works_a19', "We take confidentiality very seriously. All clients are offered a standard Non-Disclosure Agreement (NDA) before any sensitive project details are shared, ensuring your ideas are protected.") },
    { question: t('faq_how_it_works_q20', "What if I'm not happy with the team?"), answer: t('faq_how_it_works_a20', "While rare due to our rigorous vetting, your satisfaction is paramount. If there are any issues with your assigned team, your project manager will address them immediately, and we can swap team members if necessary at no cost to you.") },
  ];

  const half = Math.ceil(faqs.length / 2);
  const firstHalf = faqs.slice(0, half);
  const secondHalf = faqs.slice(half);

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-4">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground font-heading">
            {t('faq_how_it_works_title', 'Frequently Asked Questions')}
          </h2>
          <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground">
            {t('faq_how_it_works_subtitle', 'Have questions? We have answers. Here are some of the most common queries we receive.')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-x-12"
        >
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {firstHalf.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="bg-card border rounded-lg mb-4 px-4 shadow-sm hover:border-primary/50 transition-colors">
                  <AccordionTrigger className="text-lg font-semibold text-left hover:text-primary hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="space-y-4 mt-4 lg:mt-0">
            <Accordion type="single" collapsible className="w-full">
              {secondHalf.map((faq, index) => (
                 <AccordionItem value={`item-${index + half}`} key={index + half} className="bg-card border rounded-lg mb-4 px-4 shadow-sm hover:border-primary/50 transition-colors">
                  <AccordionTrigger className="text-lg font-semibold text-left hover:text-primary hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;