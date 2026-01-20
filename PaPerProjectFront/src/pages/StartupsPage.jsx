import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Rocket, Zap, Shield, TrendingUp, ArrowRight, ChevronsDown, Users, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const StartupsPage = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Launch Now, Pay Later",
      description: "For pre-revenue startups. Get your MVP built and launched with zero upfront costs. Pay only when you secure funding or start generating revenue."
    },
    {
      icon: Shield,
      title: "Project Insurance",
      description: "Your success is our success. If your project doesn't meet the agreed-upon goals, we'll fix it for free. We de-risk your development journey."
    },
    {
      icon: TrendingUp,
      title: "Execution as a Service™",
      description: "Focus on your vision, not managing developers. We provide a fully managed team that handles everything from scoping to delivery, so you can focus on growth."
    },
    {
      icon: Rocket,
      title: "15% Future Credits",
      description: "We invest back in you. Get 15% of your project cost back as credits for future work, helping you iterate and scale faster."
    }
  ];
  
  const comparisonData = [
      { feature: 'Upfront Cost', us: '£0 (Pay Later)', agency: '~£20,000+', hiring: '~£15,000 (Salaries)' },
      { feature: 'Time to Start', us: '24 Hours', agency: '2-4 Weeks', hiring: '1-3 Months' },
      { feature: 'Management Overhead', us: 'Zero (Fully Managed)', agency: 'Medium', hiring: 'High' },
      { feature: 'Risk', us: 'Low (Guaranteed)', agency: 'Medium', hiring: 'High' },
      { feature: 'Included Roles', us: 'PM, Devs, QA', agency: 'Varies', hiring: '1-2 Devs' },
  ];

  const handleScrollToContact = () => {
    document.getElementById('startup-contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Startup Solutions | Launch Now, Pay Later</title>
        <meta name="description" content="Specialized programs for startups. Build your MVP with zero upfront costs, project insurance, and a fully managed team. Let's build the future together." />
      </Helmet>
      <div className="bg-background text-foreground">
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary/5 to-transparent pt-24 sm:pt-32 pb-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Rocket className="mx-auto h-12 w-12 text-primary" />
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl font-heading">
                Built for Founders, by Builders
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                We're not just a service provider; we're your first technical co-founder. We help you launch faster, de-risk your vision, and scale smarter with programs designed specifically for startups.
              </p>
              <div className="mt-10">
                <Button size="lg" onClick={handleScrollToContact}>
                  Partner With Us <ChevronsDown className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        <section className="py-16 sm:py-20 bg-secondary/40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-heading">Your Unfair Advantage</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
                Programs designed to turn your idea into a market-ready product.
              </p>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                >
                  <Card className="text-center p-6 bg-card border shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center rounded-2xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                      <benefit.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-xl font-bold">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-muted-foreground text-base leading-relaxed">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-background">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-heading">How We Compare</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
                        The smart choice for building your MVP.
                    </p>
                </div>
                <Card className="shadow-2xl rounded-2xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-secondary/40">
                                <TableHead className="font-bold text-foreground w-1/4">Feature</TableHead>
                                <TableHead className="font-bold text-primary w-1/4 text-center">Our Platform</TableHead>
                                <TableHead className="font-bold text-foreground w-1/4 text-center">Agency</TableHead>
                                <TableHead className="font-bold text-foreground w-1/4 text-center">Hiring</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {comparisonData.map((row) => (
                                <TableRow key={row.feature} className="transition-colors hover:bg-secondary/20">
                                    <TableCell className="font-semibold text-foreground">{row.feature}</TableCell>
                                    <TableCell className="font-bold text-primary text-center">{row.us}</TableCell>
                                    <TableCell className="text-muted-foreground text-center">{row.agency}</TableCell>
                                    <TableCell className="text-muted-foreground text-center">{row.hiring}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </section>

        <section id="startup-contact" className="py-16 sm:py-20 bg-secondary/40">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-heading">Ready to Build the Future?</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              You have the vision. We have the team. Let's talk about how we can bring your idea to life.
            </p>
            <div className="mt-10">
              <Button asChild size="lg">
                <Link to="/contact">
                  Contact Us <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default StartupsPage;