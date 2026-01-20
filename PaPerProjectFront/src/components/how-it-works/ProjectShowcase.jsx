import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from 'framer-motion';
import { Zap, Clock, BarChart2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const projects = [
  {
    title: "Brand + Website for AI Startup",
    deliveryTime: "12 Days",
    result: "+$40k Launch Revenue",
    imageText: "AI startup branding on a laptop screen",
    alt: "Laptop showing a modern website for an AI startup."
  },
  {
    title: "E-commerce Platform for Fashion Brand",
    deliveryTime: "25 Days",
    result: "+150% Online Sales",
    imageText: "Fashion e-commerce site on a tablet",
    alt: "Tablet displaying a stylish e-commerce website for a fashion brand."
  },
  {
    title: "Mobile App for Fintech Company",
    deliveryTime: "45 Days",
    result: "50k+ Downloads in 3 Months",
    imageText: "Fintech mobile app on a smartphone",
    alt: "Smartphone showcasing a sleek mobile banking application."
  },
  {
    title: "SaaS Dashboard for Analytics Firm",
    deliveryTime: "30 Days",
    result: "80% Faster Data Processing",
    imageText: "Complex data dashboard for analytics",
    alt: "Computer monitor displaying a complex SaaS dashboard with charts and graphs."
  },
  {
    title: "Booking System for Travel Agency",
    deliveryTime: "18 Days",
    result: "+30% Booking Conversion",
    imageText: "Travel agency booking website",
    alt: "A user-friendly booking interface for a travel agency."
  },
  {
    title: "Corporate Identity for Law Firm",
    deliveryTime: "10 Days",
    result: "200% Increase in Consultations",
    imageText: "Professional law firm logo and branding",
    alt: "Branding materials for a professional law firm, including business cards and letterhead."
  }
];

const ProjectShowcase = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-24 bg-secondary/40">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">{t('how_it_works_showcase_title')}</h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
            {t('how_it_works_showcase_subtitle')}
          </p>
        </motion.div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {projects.map((project, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="overflow-hidden group h-full flex flex-col shadow-lg hover:shadow-primary/20 transition-all duration-300 border rounded-xl">
                    <div className="relative overflow-hidden">
                      <img  class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" alt={project.alt} src="https://images.unsplash.com/photo-1572177812156-58036aae439c" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <CardContent className="p-6 flex-grow flex flex-col justify-between bg-card">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">{project.title}</h3>
                      </div>
                      <div className="space-y-3 text-muted-foreground mt-4">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 mr-3 text-primary" />
                          <span className="font-medium">{t('how_it_works_showcase_delivery')}</span>
                          <span className="ml-auto font-semibold text-foreground">{project.deliveryTime}</span>
                        </div>
                        <div className="flex items-center">
                          <BarChart2 className="w-5 h-5 mr-3 text-primary" />
                          <span className="font-medium">{t('how_it_works_showcase_result')}</span>
                          <span className="ml-auto font-semibold text-foreground">{project.result}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-card/80 backdrop-blur-sm hover:bg-card text-foreground" />
          <CarouselNext className="bg-card/80 backdrop-blur-sm hover:bg-card text-foreground" />
        </Carousel>
      </div>
    </section>
  );
};

export default ProjectShowcase;