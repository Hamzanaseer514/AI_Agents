import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, RefreshCw, Rocket, Shield, Gift, Award, Percent } from 'lucide-react';

const UniqueBenefits = () => {
  const benefits = [
    {
      icon: Rocket,
      title: "Launch Now, Pay Later",
      description: "For pre-revenue startups. Zero upfront costs to get your idea off the ground.",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10"
    },
    {
      icon: Shield,
      title: "Project Insurance",
      description: "If a project fails, we fix it for free. Your success is guaranteed.",
      color: "text-green-400",
      bg: "bg-green-500/10"
    },
    {
      icon: RefreshCw,
      title: "Upgrade Any Old Project — Half Price",
      description: "Revamp what didn’t work for you before and get it right this time.",
      color: "text-orange-400",
      bg: "bg-orange-500/10"
    },
    {
      icon: Gift,
      title: "We Invest Back: 15% Credits",
      description: "15% of your project cost goes directly into your account for future projects.",
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },
    {
      icon: Award,
      title: "Creator Miles",
      description: "Earn points on every project spend. Redeem for discounts and perks.",
      color: "text-purple-400",
      bg: "bg-purple-500/10"
    },
    {
      icon: Percent,
      title: "Build in Public? Get 20% Off",
      description: "Share your journey with the world and get a massive discount.",
      color: "text-pink-400",
      bg: "bg-pink-500/10"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground font-heading">Unbeatable Value, Unmatched Quality</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            We're committed to providing the cheapest B2B solutions without compromising on excellence. Here's how we make it happen.
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full bg-card shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 rounded-xl card-border-glow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className={`flex-shrink-0 ${benefit.bg} ${benefit.color} rounded-lg p-3`}>
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default UniqueBenefits;