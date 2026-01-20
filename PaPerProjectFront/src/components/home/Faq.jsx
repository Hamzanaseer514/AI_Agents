import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from 'react-i18next';

const Faq = () => {
  const { t } = useTranslation();
  const faqs = [
    { question: "faq_q_execution_service", answer: "faq_a_execution_service" },
    { question: "faq_q_difference", answer: "faq_a_difference" },
    { question: "faq_q_project_types", answer: "faq_a_project_types" },
    { question: "faq_q_who_for", answer: "faq_a_who_for" },
    { question: "faq_q_pricing", answer: "faq_a_pricing" },
    { question: "faq_q_lpnpl", answer: "faq_a_lpnpl" },
    { question: "faq_q_insurance", answer: "faq_a_insurance" },
    { question: "faq_q_referral", answer: "faq_a_referral" },
    { question: "faq_q_creator_miles", answer: "faq_a_creator_miles" },
    { question: "faq_q_build_in_public", answer: "faq_a_build_in_public" },
    { question: "faq_q_team_satisfaction", answer: "faq_a_team_satisfaction" },
    { question: "faq_q_start_time", answer: "faq_a_start_time" },
    { question: "faq_q_ip_protection", answer: "faq_a_ip_protection" },
    { question: "faq_q_upgrade_project", answer: "faq_a_upgrade_project" }
  ];

  const half = Math.ceil(faqs.length / 2);
  const firstHalf = faqs.slice(0, half);
  const secondHalf = faqs.slice(half);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground font-heading">{t('faq_title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('faq_subtitle')}
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-x-12 gap-y-2">
          <Accordion type="single" collapsible className="w-full">
            {firstHalf.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b">
                <AccordionTrigger className="text-lg font-semibold text-left py-6 hover:no-underline">{t(faq.question)}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground pb-6">
                  {t(faq.answer)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Accordion type="single" collapsible className="w-full">
            {secondHalf.map((faq, index) => (
              <AccordionItem key={index + half} value={`item-${index + half}`} className="border-b">
                <AccordionTrigger className="text-lg font-semibold text-left py-6 hover:no-underline">{t(faq.question)}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground pb-6">
                  {t(faq.answer)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq;