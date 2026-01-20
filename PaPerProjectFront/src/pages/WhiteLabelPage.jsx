import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, Search, Rocket, Brain, Shield, GraduationCap, HeartPulse, Building, Store, Target, Landmark, Gamepad2, Truck, Briefcase, FlaskConical, Zap, DollarSign, Lightbulb } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { whiteLabelProducts } from '@/data/whiteLabelProducts';

const iconMap = {
  "Artificial Intelligence (AI & Data)": Brain,
  "Cybersecurity": Shield,
  "Education & Research (EdTech & R&D)": GraduationCap,
  "Healthcare & Wellness": HeartPulse,
  "Real Estate & Property": Building,
  "E-Commerce & Retail": Store,
  "Marketing & Lead Generation": Target,
  "Finance & FinTech": Landmark,
  "Gaming & Entertainment": Gamepad2,
  "Logistics, Supply Chain & Manufacturing": Truck,
  "Corporate & Enterprise Productivity": Briefcase,
  "Science, Research & Innovation (R&D)": FlaskConical,
};

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Lightbulb,
      title: "What is an MVP?",
      description: "An MVP (Minimum Viable Product) is the simplest version of a product that can be released to the market. It allows you to test your core idea with real users, gather valuable feedback, and iterate quickly without over-investing time or money."
    },
    {
      icon: Zap,
      title: "Boost Sales in Days",
      description: "Our SaaS tools are production-ready. Instead of building from scratch for months, you can launch a powerful, market-tested solution under your brand in a matter of days. This means faster revenue and a quicker path to market dominance."
    },
    {
      icon: DollarSign,
      title: "Affordable for Founders",
      description: "Custom software development is expensive. Our white-label solutions provide a cost-effective entry point for new founders, giving you access to enterprise-grade tools at a fraction of the cost, preserving your crucial startup capital."
    },
  ];

  return (
    <div className="py-24 sm:py-32 bg-secondary/40">
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
              <p className="mt-4 text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};


const WhiteLabelPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = Object.entries(whiteLabelProducts).reduce((acc, [category, products]) => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  const allCategories = Object.keys(whiteLabelProducts);
  const categoriesToShow = searchTerm ? Object.keys(filteredProducts) : allCategories;
  const defaultTab = categoriesToShow.length > 0 ? categoriesToShow[0] : allCategories[0];

  return (
    <>
      <Helmet>
        <title>{t('title_white_label')}</title>
        <meta name="description" content={t('meta_desc_white_label')} />
      </Helmet>
      <div className="bg-background">
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary/5 to-transparent pt-24 sm:pt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Package className="mx-auto h-12 w-12 text-primary" />
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                MVP-Ready Products & SaaS Tools
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                Launch faster and save thousands with our production-ready, white-label solutions. Buy, rebrand, and go to market in days, not months.
              </p>
            </motion.div>
          </div>
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
            <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>
        </div>

        <BenefitsSection />

        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
             <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Our White-Label Catalog</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
                    Browse our extensive library of ready-to-deploy solutions across various industries.
                </p>
                 <div className="mt-8 flex items-center justify-center">
                    <div className="relative w-full max-w-md">
                        <Input 
                        type="search" 
                        placeholder="Search for products..." 
                        className="h-12 pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
              </div>
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {allCategories.map((category) => (
                  <TabsTrigger key={category} value={category} disabled={searchTerm && !categoriesToShow.includes(category)}>{category.split('(')[0].trim()}</TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(whiteLabelProducts).map(([category, products]) => {
                 const Icon = iconMap[category];
                 const displayProducts = filteredProducts[category] || (searchTerm ? [] : products);

                 return (
                  <TabsContent key={category} value={category}>
                    <div className="mt-10">
                        <div className="flex items-center gap-4 mb-8">
                            {Icon && <Icon className="h-8 w-8 text-primary" />}
                            <h2 className="text-3xl font-bold tracking-tight text-foreground">{category}</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {displayProducts.map((product, index) => (
                            <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                            <Card className="flex h-full flex-col shadow-lg border-border hover:border-primary/50 transition-colors duration-300">
                                <CardHeader>
                                <CardTitle>{product.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <CardDescription>{product.description}</CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                      <Link to="/contact">Contact Us</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                            </motion.div>
                        ))}
                        </div>
                    </div>
                  </TabsContent>
                 )
                })}
            </Tabs>
            {categoriesToShow.length === 0 && searchTerm && (
                 <div className="text-center py-16">
                    <p className="text-xl text-muted-foreground">No products found matching your search.</p>
                </div>
            )}
          </div>
        </div>

        <div className="bg-secondary/40 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                 <Rocket className="mx-auto h-12 w-12 text-primary" />
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Can't find what you need?</h2>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">We can build a custom solution tailored to your exact specifications.</p>
                <div className="mt-8">
                    <Button size="lg" asChild>
                        <Link to="/post-project">Request a Custom Project</Link>
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default WhiteLabelPage;